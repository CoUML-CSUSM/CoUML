using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Newtonsoft.Json;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using CoUML_app.Models;

/**
https://docs.microsoft.com/en-us/aspnet/signalr/overview/guide-to-the-api/working-with-groups
https://docs.microsoft.com/en-us/aspnet/signalr/overview/guide-to-the-api/mapping-users-to-connections

*/
namespace CoUML_app.Controllers.Hubs
{
    public interface ICoUmlClient{
        Task testInterfaceMethod(string message);
        Task Dispatch(sbyte[] changes);
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
        /// <param name="connectionid">connectionId of client being called</param>
        public void TestCall(string connectionid)
        {
            Clients.Client(connectionid).testInterfaceMethod(connectionid + ": this is the test message :D");
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
            
            if( dId != "test")
            {
                //TODO: look up real diagram and return
            }

            string jsonTypeNameAll = JsonConvert.SerializeObject(DevUtility.DiagramDefualt(), Formatting.Indented, new JsonSerializerSettings
            {
                TypeNameHandling = TypeNameHandling.None
            });
            return jsonTypeNameAll;
                
        }

        public void Push(string dId, sbyte[] changes)
        {
            // TODO: changes get pushed from client to server to be logged and sent backout to other clients
        }

        public void Dispatch(string dId, sbyte[] changes)
        {
            Clients.Group(dId).Dispatch(changes);
        }

    }

    static class DevUtility{
        public static Diagram DiagramDefualt()
        {
            Diagram d = new Diagram();


            // interface
            Interface i = new Interface("IShape");
            Operation io = new Operation();
                io.visibility = VisibilityType.Public;
                io.name = "draw";
                io.returnType = new DataType("void");
            i.Operations.Insert(io);

            // class
            Class c  =  new Class("Hexigon");
            Models.Attribute a = new Models.Attribute(); // include "Models." as part of the name because there is also a System.Attribute class. 
            a.visibility = VisibilityType.Private;
            a.type = new DataType("double");
            c.Attributes.Insert(a);

            // c impliments i
            Relationship r = new Relationship();
            r.type = RelationshipType.Realization;
            r.from = c;
            r.to = i;

            d.Elements.Insert(i);
            d.Elements.Insert(c);
            d.Elements.Insert(r);            

            return d;
        }
    }
}