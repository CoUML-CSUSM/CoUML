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
		Task JoinedTeam(string teamMemeber);
		Task LeftTeam(string teamMemeber);
		Task InitTeam(string teamMemebers);
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

		public string LogIn(string userId)
		{
			Context.Items[CoUmlContext.USER] = new User(userId);
			ProjectController.Register((User)Context.Items[CoUmlContext.USER]);
			return DTO.From<User>((User)Context.Items[CoUmlContext.USER]);
		}

		public void LogOut()
		{
			try
			{
				LeaveSession();
				Context.Items[CoUmlContext.USER] = null;
			}
			catch (KeyNotFoundException knf)
			{
				Console.WriteLine(knf);
			}
		}

		private void JoinSession(string dId)
		{
			User self = (User)Context.Items[CoUmlContext.USER];
			Context.Items[CoUmlContext.DIAGRAM] = dId;
			
			Groups.AddToGroupAsync(Context.ConnectionId, dId);
			SessionManager.JoinSession(dId, self);

			Clients.GroupExcept(dId, new List<string>(){Context.ConnectionId}.AsReadOnly())
				.JoinedTeam(
					DTO.From<User>(self)
				);
			Clients.Caller
				.InitTeam(
					DTO.From<User[]>(SessionManager.ListTeamMembers(dId))
				);
		}

		private void LeaveSession()
		{
			string dId = (string) Context.Items[CoUmlContext.DIAGRAM];
			User self = (User)Context.Items[CoUmlContext.USER];

			if(dId is not null)
			{
				Clients.GroupExcept(dId, new List<string>(){Context.ConnectionId}.AsReadOnly())
					.LeftTeam(DTO.From<User>(self));

				SessionManager.LeaveSession(dId, self);
				Groups.RemoveFromGroupAsync(Context.ConnectionId, dId);
			}
			Context.Items[CoUmlContext.DIAGRAM] = null;
		}


		/// <summary>
		/// find an existing diagram in memory and return it to the requesting client
		/// </summary>
		/// <param name="dId">somthing to identify the diagram file by</param>
		/// <returns>the diagram requested</returns>
		public string Fetch(string dId)
		{

			LeaveSession();

			Diagram fetchedDiagram = null;
			if(SessionManager.IsSessionActive(dId))
			{
				fetchedDiagram = SessionManager.GetLiveDiagram(dId);
			}else
			{
				fetchedDiagram = ProjectController.FindDiagram(dId);
				SessionManager.InitSession(dId, fetchedDiagram);
			}

			JoinSession(dId);			

			return DTO.FromDiagram(fetchedDiagram);
		}

		

		

		public string Generate(string dId){
			return ProjectController.Generate(dId,  (User)Context.Items[CoUmlContext.USER]);
		}
		
		public string ListMyDiagrams(){
			return ProjectController.ListMyDiagrams( (User)Context.Items[CoUmlContext.USER] );
		}

		public void Push(string changes)
		{
			var dId = (string)Context.Items[CoUmlContext.DIAGRAM];
			SessionManager.CommitUpdatesToSession(dId, DTO.ToChangeRecords(changes));
			ProjectController.Overwrite(SessionManager.GetLiveDiagram(dId));
			Dispatch(dId, Context.ConnectionId, changes);
		}

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

		public void Invite(string uId){
			User add = new User(uId);
			ProjectController.AddToTeam((string)(Context.Items[CoUmlContext.DIAGRAM]),add);	
		}
	}
}