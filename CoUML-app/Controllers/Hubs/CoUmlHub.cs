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

    public class CoUmlHub : Hub<ICoUmlClient>
    {
        /// <summary>
        /// connection repo
        /// </summary>
        /// <typeparam name="string"></typeparam>
        /// <returns></returns>
        private readonly static ConnectionMap<string, IUser> _connections = new ConnectionMap<string, IUser>();

        private static Diagram testDiagram = DevUtility.DiagramDefualt("test"); // test code here

        private static ProjectController _projectController = new ProjectController();
        private static SessionManager _sessionManager = new SessionManager();
       
        
        /// <summary>
        /// when a new user attemps to connect their connection id gets logged in the connection repo
        /// and calls test connection
        /// </summary>
        /// <returns></returns>
        public override Task OnConnectedAsync()
        {
            string connectionId = Context.ConnectionId;
            IUser name = new User(connectionId);
            _connections.Add(connectionId, name);

            IssueUser(connectionId);

            return base.OnConnectedAsync();
        }

        /// <summary>
        /// remove connection from repo apon disconnection
        /// </summary>
        /// <param name="exception"> \!not used </param>
        /// <returns></returns>
        public override Task OnDisconnectedAsync(Exception exception)
        {
            string connectionId = Context.ConnectionId;
            
            // Groups.RemoveFromGroupAsync(connectionId)
            _connections.Remove(connectionId);
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


        /// <summary>
        /// find an existing diagram in memory and return it to the requesting client
        /// </summary>
        /// <param name="dId">somthing to identify the diagram file by</param>
        /// <returns>the diagram requested</returns>
        public string Fetch(string dId)
        {
            
            //attacha as a listener to this diagram
            Groups.AddToGroupAsync(Context.ConnectionId, dId);

            // string diagram = _projectController.LookUp(dId);
            var diagram = _projectController.Find(dId);
            

            if(diagram == null){
                _projectController.Generate(dId);
                diagram = _projectController.Find(dId);
            }

            var diagramText = diagram.ToString();
            Console.WriteLine(diagramText);//outputs the diagram text

            return diagramText;
            // return DTO.FromDiagram(diagram);
            //TODO: Change _projectController.LookUp to accomidate for Diagram return type
        }

        public void Generate(string dId){
            _projectController.Generate(dId);
        }


        public void Push(string dId, string changes)
        {
            // TODO: changes get pushed from client to server to be logged and sent backout to other clients

            //push changes out to other clients
            Dispatch(dId, Context.ConnectionId, changes);

            //add mongodb update code

            //mongodb database
            var dbClient = new MongoClient("mongodb://localhost:27017");
            //adds document to the database
            IMongoDatabase db = dbClient.GetDatabase("CoUML");

        }

        public void ApplyChange(string dId, ChangeRecord[] change)
        {
            _projectController.Write(dId, change);
        }

        public void Dispatch(string dId, string callerId, string changes)
        {
            Clients.GroupExcept(dId, new List<string>(){callerId}.AsReadOnly()).Dispatch(changes);
        }

        public void TriggerBreakPoint()
        {
            ;
        }

        public void Send(string dId, String diagramDTO){
            _projectController.Overwrite(dId, diagramDTO);
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

            Diagram testDiagram = _projectController.FindDiagram(dId);
            if(testDiagram != null)
                testDiagram.GenerateCode(codeGenerator);
        }
    }
}