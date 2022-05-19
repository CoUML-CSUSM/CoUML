using System;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

using CoUML_app.Models;
using CoUML_app.DataAccess;
//mongodb stuff
using MongoDB.Driver;
using MongoDB.Bson;

namespace CoUML_app.Controllers
{

	public class ProjectController
	{

		private IProjectDAO dao;

		public ProjectController()
		{
			dao = new ProjectDAO();
		}

		public Diagram FindDiagram(string dId)
		{
			return dao.FindDiagram(dId);
		}

		public string CreateDiagram(string dId, User user)
		{
			return dao.CreateDiagram(dId,user);
		}

		public string CreateProjectFromDiagram(Diagram diagram, User user)
		{
			string _id = dao.CreateDiagram(diagram.id,user);
			dao.Overwrite(_id, diagram);
			return _id;
		}


		public string ListDiagrams(User user)
		{
			return dao.ListDiagrams(user);
		}
		public void Overwrite(string dId, Diagram diagram)
		{
			dao.Overwrite(dId, diagram);
		}

	}

	public class UserController
	{

		private IUserDAO dao;

		public UserController()
		{
			dao = new UserDAO();
		}

		public void CreateTeam(User newUser)
		{
			dao.CreateTeam(newUser);
		}

		public bool AddToTeam(string dId, User user)
		{
			return dao.AddToTeam(dId,user);
		}

		public void RegisterUser(User newUser)
		{
			dao.RegisterUser(newUser);
		}
	}
}