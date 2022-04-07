using System.Collections.Specialized;
using System.Collections.Generic;
using CoUML_app.Models;

namespace CoUML_app.Controllers.Hubs
{
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

    public class ActiveSession
    {
        private Diagram _projectDiagram;
        private Dictionary<string, User> _team;
        private List<ChangeRecord> _history;
        private SessionManager _observer;

        public ActiveSession( Diagram diagram)
        {
            _projectDiagram = diagram;
            _team = new Dictionary<string, User>();
            _history = new List<ChangeRecord>();
        }

        public bool AddTeamMember(User user)
        {
            return _team.TryAdd(user.id, user);
        }

        public bool RemoveTeamMember(User user)
        {
            return RemoveTeamMember(user.id);
        }

        public bool RemoveTeamMember(string userId)
        {
            return _team.Remove(userId);
        }

        public bool IsActive()
        {
            return _team.Count > 0;
        }

    }

    public class SessionManager
    {
        private Dictionary<string, ActiveSession> _sessions = new Dictionary<string, ActiveSession>();

        public bool InitSession(Diagram diagram)
        {
            return _sessions.TryAdd(diagram.id, new ActiveSession(diagram));
        }

        public bool IsSessionActive(string dId)
        {
            ActiveSession sess;
            return _sessions.TryGetValue(dId, out sess);
        }

        public ActiveSession GetSession(string dId)
        {
            ActiveSession sess;
            _sessions.TryGetValue(dId, out sess);
            return sess;
        }

        public bool TerminateSession(string dId)
        {
            var session = GetSession(dId);
            if(!session.IsActive())
                return _sessions.Remove(dId);
            return false;
        }

        public bool JoinSession(string dId, User user)
        {
            return _sessions[dId].AddTeamMember(user);
        }

        public bool LeaveSession(string dId, User user)
        {
            var left = _sessions[dId].RemoveTeamMember(user);
            if(left && !_sessions[dId].IsActive())
                TerminateSession(dId);
            return left;
        }
    }
}