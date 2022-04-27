using System.Collections.Specialized;
using System.Collections.Generic;
using CoUML_app.Models;
using CoUML_app.Controllers.Project;
using System.Linq;

namespace CoUML_app.Controllers.Hubs
{
	/// data structure to store active users
	public class ConnectionMap
	{
		/// <summary>
		/// the repo of active connections
		/// </summary>
		/// <typeparam name="CID">connectionId: string</typeparam>
		/// <typeparam name="User">value: User Object</typeparam>
		private readonly Dictionary<string, User> _connections = new Dictionary<string, User>();

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
		public void Insert(string connectionId, User user)
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
		public IUser Remove(string connectionId)
		{
			IUser itemRemoved = new NullUser();
			lock(_connections)
			{
				if(IsConnected(connectionId))
				{
					itemRemoved = GetUser(connectionId);
					_connections.Remove(connectionId);
				}    
			}
			return itemRemoved;
		}

		/// <summary>
		/// determin if the connectioId is is in the repo
		/// </summary>
		/// <param name="connectionId">the connectionId of the client connection</param>
		/// <returns>true: connectionId is in repo</returns>
		public bool IsConnected(string connectionId)
		{
			User temValueHolder;
			return _connections.TryGetValue(connectionId, out temValueHolder);
		}

		public User GetUser(string connectionId)
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

		public Diagram Diagram{ get => _projectDiagram; }

		public User[] Team { get => _team.Values.ToArray<User>(); }

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

		public void UpdateModel(ChangeRecord [] changes)
		{
			_projectDiagram.Apply(changes);
			_history.InsertRange(_history.Count, changes);
		}
	}

	
	public class SessionHost
	{
		private Dictionary<string, ActiveSession> _sessions = new Dictionary<string, ActiveSession>();

		public bool InitSession(string dId, Diagram diagram)
		{
			return _sessions.TryAdd(dId, new ActiveSession(diagram));
		}

		public bool IsSessionActive(string id)
		{
			ActiveSession sess;
			return _sessions.TryGetValue(id, out sess);
		}

		public ActiveSession GetSession(string id)
		{
			ActiveSession sess;
			if(_sessions.TryGetValue(id, out sess))
				return sess;
			return null;
		}

		public Diagram GetLiveDiagram(string id)
		{
			return GetSession(id)?.Diagram;
		}

		public User[] ListTeamMembers(string id)
		{
			return GetSession(id)?.Team;
		}

		public bool TerminateSession(string id)
		{
			var session = GetSession(id);
			if(!session.IsActive())
				return _sessions.Remove(id);
			return false;
		}

		public bool JoinSession(string id, User user)
		{
			return _sessions[id].AddTeamMember(user);
		}

		public bool LeaveSession(string id, User user)
		{
			var left = _sessions[id].RemoveTeamMember(user);
			if(left && !_sessions[id].IsActive())
				TerminateSession(id);
			return left;
		}

		public bool CommitUpdatesToSession(string id, ChangeRecord[] changes)
		{
			_sessions[id].UpdateModel(changes);
			return false; 
		}

	}
}