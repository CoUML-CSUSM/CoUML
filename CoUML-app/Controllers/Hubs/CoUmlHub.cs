using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;


/**
https://docs.microsoft.com/en-us/aspnet/signalr/overview/guide-to-the-api/working-with-groups
https://docs.microsoft.com/en-us/aspnet/signalr/overview/guide-to-the-api/mapping-users-to-connections

*/
namespace CoUML_app.Controllers.Hubs
{
    public interface ICoUmlClient{
        Task testInterfaceMethod(string message);
    }

/// data structure to store active users
    public class ConnectionMap<T>
    {
        /// <summary>
        /// the repo of active connections
        /// </summary>
        /// <typeparam name="T">connectionId: string</typeparam>
        /// <typeparam name="T">value: string</typeparam>
        private readonly Dictionary<T, T> _connections = new Dictionary<T, T>();

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
        /// <param name="value">
        ///     \! not currently used - a value to associate with the connectionId
        /// </param>
        public void Add(T connectionId, T value)
        {
            lock(_connections)
            {
                if(!IsConnected(connectionId))
                    _connections.Add(connectionId, value);
            }
        }

        /// <summary>
        /// removes a client connection from the repo
        /// </summary>
        /// <param name="connectionId">the id of the connection</param>
        /// <returns>true if sucsessfully removed</returns>
        public bool Remove(T connectionId)
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
        public bool IsConnected(T connectionId)
        {
            T temValueHolder;
            return _connections.TryGetValue(connectionId, out temValueHolder);
        }


    }
    public class CoUmlHub : Hub<ICoUmlClient>
    {
        /// <summary>
        /// connection repo
        /// </summary>
        /// <typeparam name="string"></typeparam>
        /// <returns></returns>
        private readonly static ConnectionMap<string> _connections = new ConnectionMap<string>();
        
        
        /// <summary>
        /// when a new user attemps to connect their connection id gets logged in the connection repo
        /// and calls test connection
        /// </summary>
        /// <returns></returns>
        public override Task OnConnectedAsync()
        {
            string connectionId = Context.ConnectionId;
            string name = Context.User.Identity.Name;
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
            _connections.Remove(connectionId);
            return base.OnDisconnectedAsync(exception);
        }

        /// <summary>
        /// test server to client communication
        /// </summary>
        /// <param name="connectionid">connectionId of client being called</param>
        public void TestCall(string connectionid)
        {
            Clients.Client(connectionid).testInterfaceMethod("this is the test message :D");
        }

    }

    [Route("[controller]")]
    [ApiController]
    public class CoUmlController: ControllerBase
    {
        private IHubContext<CoUmlHub> _hub;

        public CoUmlController(IHubContext<CoUmlHub> hub)
        {
            this._hub = hub;
        }

        // public async Task clientAdded()
        // {
        //     // this._hub.Clients.All.testInterfaceMethod("this is the test message :D");
        // }
    }
}