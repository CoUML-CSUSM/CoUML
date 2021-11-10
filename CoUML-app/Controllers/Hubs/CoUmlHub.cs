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
namespace CoUUML_app.Controllers.Hubs
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
                T temValueHolder;
                if(!_connections.TryGetValue(connectionId, out temValueHolder))
                    _connections.Add(connectionId, value);
            }
        }

        public bool Remove(T connectionId)
        {
            bool isItemRemoved = false;
            lock(_connections)
            {
                T temValueHolder;
                if(_connections.TryGetValue(connectionId, out temValueHolder))
                    isItemRemoved = _connections.Remove(connectionId);
            }
            return isItemRemoved;
        }

        public bool Has(T connectionId)
        {
            T temValueHolder;
            return _connections.TryGetValue(connectionId, out temValueHolder);
        }


    }
    [Authorize]
    public class CoUmlHub : Hub<ICoUmlClient>
    {
        private readonly static Connection
        public override Task OnConnect()
        {

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

        public async Task clientAdded()
        {
            this._hub.Clients.All.testInterfaceMethod("this is the test message :D");
        }
    }
}