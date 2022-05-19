using System;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

using CoUML_app.Models;
//mongodb stuff
using MongoDB.Driver;
using MongoDB.Bson;

namespace CoUML_app.DataAccess
{
	public interface IUserDAO
	{
		public void RegisterUser(User newUser);
		public bool AddToTeam(string dId, User user);
		public void CreateTeam(User newUser);
	}

	public interface IProjectDAO
	{
		public string ListDiagrams(User user);
		public void Overwrite(string dId, Diagram diagram);
		public string CreateDiagram(string dId, User projectManager);
		public Diagram FindDiagram(string dId);
	}
}