using System;
using System.IO;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

using CoUML_app.Models;
using CoUML_app.Controllers.Project;
using CoUML_app.Utility;

//mongodb stuff
using MongoDB.Driver;
using MongoDB.Bson;
using CoUML_app.Controllers.Generators;

/**
https://docs.microsoft.com/en-us/aspnet/signalr/overview/guide-to-the-api/working-with-groups
https://docs.microsoft.com/en-us/aspnet/signalr/overview/guide-to-the-api/mapping-users-to-connections

*/
namespace CoUML_app.Controllers.Hubs
{
	///<summary> 
	/// functions that can be run on the client from the server
	/// </summary>
	public interface ICoUmlClient{
		Task issueUser(string message);
		Task Dispatch(string changes);
	}

	public static class CoUmlContext
	{
		public const string USER = "CoUmlUser";
		public const string DIAGRAM = "CoUmlDiagram";
		
	}



	public class CoUmlHub : Hub<ICoUmlClient>
	{
		/// <summary>
		/// connection repo
		/// </summary>
		/// <typeparam name="string"></typeparam>
		/// <returns></returns>
		// private readonly static ConnectionMap _connections = new ConnectionMap();


		private static ProjectController ProjectController = new ProjectController();
		private static SessionManager SessionManager = new SessionManager();

		
		/// <summary>
		/// when a new user attemps to connect their connection id gets logged in the connection repo
		/// and calls test connection
		/// </summary>
		/// <returns></returns>
		public override Task OnConnectedAsync()
		{

			InitContextItems();


			/* * * * Temp way to login * * * */
			/* * * * Delete later * * * */
			LogIn(Context.ConnectionId);
			/* * * * * * * * * * * * * * * * */

			return base.OnConnectedAsync();
		}

		public void InitContextItems()
		{
			Context.Items.Add(CoUmlContext.DIAGRAM, null); //string
			Context.Items.Add(CoUmlContext.USER, null); // User
		}

		/// <summary>
		/// remove connection from repo apon disconnection
		/// </summary>
		/// <param name="exception"> \!not used </param>
		/// <returns></returns>
		public override Task OnDisconnectedAsync(Exception exception)
		{
			LogOut();
			return base.OnDisconnectedAsync(exception);
		}

		/// <summary>
		/// test server to client communication
		/// </summary>
		/// <param name="connectionId">connectionId of client being called</param>
		public void IssueUser(string connectionId)
		{
			Clients.Client(connectionId).issueUser(connectionId);
		}

		public void LogIn(string userId)
		{
			Context.Items[CoUmlContext.USER] = new User(userId);
		}

		public void LogOut()
		{

			try
			{
			   SessionManager.LeaveSession((string)Context.Items[CoUmlContext.DIAGRAM], (User)Context.Items[CoUmlContext.USER]);
			}
			catch (KeyNotFoundException knf)
			{
				Console.WriteLine(knf);
			}
			
		}

		/// <summary>
		/// find an existing diagram in memory and return it to the requesting client
		/// </summary>
		/// <param name="dId">somthing to identify the diagram file by</param>
		/// <returns>the diagram requested</returns>
		public string Fetch(string dId)
		{

			if(Context.Items[CoUmlContext.DIAGRAM] != null)
			{ // remove self from other groups before continuing
				Groups.RemoveFromGroupAsync(Context.ConnectionId, (string)Context.Items[CoUmlContext.DIAGRAM]);
				SessionManager.LeaveSession((string)Context.Items[CoUmlContext.DIAGRAM], (User)Context.Items[CoUmlContext.USER]);
			}

			Context.Items[CoUmlContext.DIAGRAM] = dId;

			Diagram fetchedDiagram = null;
			if(!SessionManager.IsSessionActive(dId))
			{
				fetchedDiagram = ProjectController.FindDiagram(dId);
				SessionManager.InitSession(fetchedDiagram);
			}else
			{
				fetchedDiagram = SessionManager.GetLiveDiagram(dId);
			}

			Groups.AddToGroupAsync(Context.ConnectionId, dId);
			SessionManager.JoinSession(dId, (User)Context.Items[CoUmlContext.USER]);

			return DTO.FromDiagram(fetchedDiagram);
		}

		public void Generate(string dId){
			ProjectController.Generate(dId);
		}


		public void Push(string dId, string changes)
		{
			if((string)Context.Items[CoUmlContext.DIAGRAM] == dId)
			{
				SessionManager.CommitUpdatesToSession(dId, DTO.ToChangeRecords(changes));
				ProjectController.Overwrite(SessionManager.GetLiveDiagram(dId));
				Dispatch(dId, Context.ConnectionId, changes);
			}
		}

		//not needed
		// public void ApplyChange(string dId, ChangeRecord[] change)
		// {
		// 	ProjectController.Write(dId, change);
		// }

		public void Dispatch(string dId, string callerId, string changes)
		{
			Clients.GroupExcept(dId, new List<string>(){callerId}.AsReadOnly()).Dispatch(changes);
		}

		public void TriggerBreakPoint()
		{
			;
		}

		public void GenerateSourceCode( string dId, int language)
		{ 
			ISourceCodeGenerator codeGenerator;

			switch(language)
			{
				//TODO: enum for language, defualt is java
				case 0: 
				default:
					codeGenerator = new JavaCodeGenerator(); break;
			}

			Diagram testDiagram = ProjectController.FindDiagram(dId);
			if(testDiagram != null)
				testDiagram.GenerateCode(codeGenerator);
		}
	}
}