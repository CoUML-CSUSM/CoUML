using System;
using System.IO;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Newtonsoft.Json;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

using CoUML_app.Models;
using Attribute = CoUML_app.Models.Attribute;


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
        Task testInterfaceMethod(string message);
        Task Dispatch(string changes);
    }

    /// data structure to store active users
    public class ConnectionMap<CID, User>
    {
        /// <summary>
        /// the repo of active connections
        /// </summary>
        /// <typeparam name="CID">connectionId: string</typeparam>
        /// <typeparam name="DID">value: string</typeparam>
        private readonly Dictionary<CID, User> _connections = new Dictionary<CID, User>();

        /// <summary>
        /// get the count of client connections in the repo
        /// </summary>
        /// <value>int</value>
        public int Count
        {
            get
            {
                return _connections.Count;
            }
        }
        
        /// <summary>
        /// add a client connection to the repo
        /// </summary>
        /// <param name="connectionId">
        ///     the client id retrieved from the hub context
        ///     > Context.ConnectionId
        /// </param>
        /// <param name="user">
        ///     \! not currently used - a value to associate with the connectionId
        /// </param>
        public void Add(CID connectionId, User user)
        {
            lock(_connections)
            {
                if(!_connections.TryAdd(connectionId, user)){
                    //TODO: error because tryadd failed
                }
            }
        }

        /// <summary>
        /// removes a client connection from the repo
        /// </summary>
        /// <param name="connectionId">the id of the connection</param>
        /// <returns>true if sucsessfully removed</returns>
        public bool Remove(CID connectionId)
        {
            bool isItemRemoved = false;
            lock(_connections)
            {
                if(IsConnected(connectionId))
                    isItemRemoved = _connections.Remove(connectionId);
            }
            return isItemRemoved;
        }

        /// <summary>
        /// determin if the connectioId is is in the repo
        /// </summary>
        /// <param name="connectionId">the connectionId of the client connection</param>
        /// <returns>true: connectionId is in repo</returns>
        public bool IsConnected(CID connectionId)
        {
            User temValueHolder;
            return _connections.TryGetValue(connectionId, out temValueHolder);
        }

        public User GetUser(CID connectionId)
        {
            User user;
            _connections.TryGetValue(connectionId, out user);
            return user;

        }


    }

    public class CoUmlHub : Hub<ICoUmlClient>
    {
        /// <summary>
        /// connection repo
        /// </summary>
        /// <typeparam name="string"></typeparam>
        /// <returns></returns>
        private readonly static ConnectionMap<string, IUser> _connections = new ConnectionMap<string, IUser>();
        private static Diagram testDiagram = DevUtility.DiagramDefualt(); // test code here

        
        
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

            TestCall(connectionId);

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
        public void TestCall(string connectionId)
        {
            Clients.Client(connectionId).testInterfaceMethod(connectionId + ": this is the test message :D");
        }


        /// <summary>
        /// find an existing diagram in memory and return it to the requesting client
        /// </summary>
        /// <param name="dId">somthing to identify the diagram file by</param>
        /// <returns>the diagram requested</returns>
        public string Fetch(string dId)
        {
            //attacha as a listener to this diagram
            Groups.AddToGroupAsync(Context.ConnectionId,dId);

            // Diagram fechedDiagram = testDiagram; // test code with sample diagram
            
            if( dId != "test")
            {
                //TODO: look up real diagram and return
            }

            // return JsonConvert.SerializeObject(testDiagram, Formatting.Indented, new JsonSerializerSettings
            //         {
            //             TypeNameHandling = TypeNameHandling.Auto
            //         });
            return this.OpenSampleFile();
            // return JsonConvert.SerializeObject(testDiagram, Formatting.Indented);

                
        }

        public void Push(string dId, string changes)
        {
            // TODO: changes get pushed from client to server to be logged and sent backout to other clients

            //push changes out to other clients
            Dispatch(dId, changes);

        }

        public void Dispatch(string dId, string changes)
        {
            Clients.Group(dId).Dispatch(changes);
        }

        public void TriggerBreakPoint()
        {
            ;
        }

        public string OpenSampleFile()
        {
            string path = Directory.GetFiles(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Samples/"))[0];

            return File.ReadAllText(path);
        }


    }

    static class DevUtility{
        public static Diagram DiagramDefualt()
        {
            Diagram d = new Diagram();


            // interface
            Interface i = new Interface("IShape");
            Operation io = new Operation
            {   
                name = "draw",
                visibility = VisibilityType.Public,
                type = new DataType{ dataType = "void"}
            };
            i.operations.Insert(io);

            io = new Operation
            {   
                name = "scale",
                visibility = VisibilityType.Public,
                type = new DataType{ dataType = "void"}
            };
            io.parameters.Insert(
                new Attribute {
                    name = "percent",
                    visibility = VisibilityType.Private,
                    type = new DataType{ dataType = "double" }
                }
            );
            i.operations.Insert(io);

            io = new Operation
            {   
                name = "area",
                visibility = VisibilityType.Public,
                type = new DataType{ dataType = "double"}
            };
            i.operations.Insert(io);


            // class
            Class c  =  new Class("Hexagon");
            Models.Attribute a = new Models.Attribute
            {
                name = "diagonal",
                visibility = VisibilityType.Private,
                type = new DataType{ dataType = "double" }
            };
            c.attributes.Insert(a);

            // c impliments i
            Relationship r = new Relationship
            {
                type = RelationshipType.Realization,
                fromComponent = c,
                toComponent = i,
            };
            c.relations.Insert(r.id);
            i.relations.Insert(r.id);

            d.elements.Insert(i);
            d.elements.Insert(c);
            d.elements.Insert(r); 

            return d;
        }


    }
}