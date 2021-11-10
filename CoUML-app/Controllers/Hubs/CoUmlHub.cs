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
        private readonly Dictionary<T, T> _connections = new Dictionary<T, T>();
        public int Count
        {
            get
            {
                return _connections.Count;
            }
        }
        
        public void Add(T connectionId, T value)
        {
            lock(_connections)
            {
                if(!IsConnected(connectionId))
                    _connections.Add(connectionId, value);
            }
        }

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

        public bool IsConnected(T connectionId)
        {
            T temValueHolder;
            return _connections.TryGetValue(connectionId, out temValueHolder);
        }


    }
    public class CoUmlHub : Hub<ICoUmlClient>
    {
        private readonly static ConnectionMap<string> _connections = new ConnectionMap<string>();
        
        /// when a new user attemps to connect their connection id gets logged in the connection repo
        public override Task OnConnectedAsync()
        {
            string connectionId = Context.ConnectionId;
            string name = Context.User.Identity.Name;
            _connections.Add(connectionId, name);

            TestCall(connectionId);

            return base.OnConnectedAsync();
        }

        /// remove connection from repo apon disconnection
        public override Task OnDisconnectedAsync(Exception exception)
        {
            string connectionId = Context.ConnectionId;
            _connections.Remove(connectionId);
            return base.OnDisconnectedAsync(exception);
        }

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