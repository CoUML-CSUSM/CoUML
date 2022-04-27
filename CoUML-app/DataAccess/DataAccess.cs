using System;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

using CoUML_app.Models;
using CoUML_app.Utility;
//mongodb stuff
using MongoDB.Driver;
using MongoDB.Bson;


namespace CoUML_app.DataAccess
{
	public abstract class MongoDAO
	{
		const string COUMLDB_URL = "mongodb://localhost:27017";	
		const string COUMLDB_NAME = "CoUML";
		private IMongoClient _dbClient;

		public MongoDAO()
		{
			_dbClient = new MongoClient(COUMLDB_URL);
		}

		protected IMongoCollection<BsonDocument> GetCollection(string collectionName)
		{
			IMongoDatabase db = _dbClient.GetDatabase(COUMLDB_NAME);
			return db.GetCollection<BsonDocument>(collectionName);
		}
	}

	public class UserDAO: MongoDAO, IUserDAO
	{
		public void AddToTeam(string dId, User user){
			var collection = GetCollection("Teams");
			var filter = Builders<BsonDocument>.Filter.Eq("user", user.id);	

			var team = collection.Find(filter).FirstOrDefault();
			if(team is null)
				CreateTeam(user);

			var update = Builders<BsonDocument>.Update.Push<String>("diagrams", dId);

            	collection.UpdateOne(filter, update);
		}

		public void RegisterUser(User newUser)
		{
			var collection = GetCollection("Users");
			var filter = Builders<BsonDocument>.Filter.Eq("id", newUser.id);
			
			var user = collection.Find(filter).Project("{_id: 0}").FirstOrDefault(); //may return null

			if(user == null){
				
				var doc = new BsonDocument
				{
					{"id", newUser.id},
				};

				collection.InsertOne(doc);
				Console.WriteLine(doc.ToString());

				//create team database
				CreateTeam(newUser);
			}
		}

		public void CreateTeam(User newUser)
		{
			var collection = GetCollection("Teams");

			string[] a = new String[0];

			var doc = new BsonDocument
			{
				{"diagrams", new BsonArray(a)},
				{"user", newUser.id}
				
			};
			collection.InsertOne(doc);
		}

	}


	public class ProjectDAO: MongoDAO, IProjectDAO
	{
		public Diagram FindDiagram(string dId)
		{
			BsonDocument diagramBSON = Find(dId);
			if(diagramBSON != null)
			{
				var d = DTO.ToDiagram(diagramBSON);
				return d;
			}
			return null;
		}

		private BsonDocument? Find(string dId)
		{
			var collection = GetCollection("Diagrams");
			var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(dId));
			var diagramBSON = collection.Find(filter).Project("{_id: 0}").FirstOrDefault(); //may return null
			return diagramBSON;
		}

		public string CreateDiagram(string dId, User projectManager){

			var collection = GetCollection("Diagrams");
			var projectDiagram = dId =="test" ? Template.DiagramDefualt(dId): new Diagram(dId);
			projectDiagram.editor = projectManager;

			//sends diagram as bson doc using the string of the diagram
			MongoDB.Bson.BsonDocument doc = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(
				DTO.FromDiagram(projectDiagram)
			);

			collection.InsertOne(doc);

			new UserDAO().AddToTeam(doc["_id"].ToString(), projectManager);

			return doc["_id"].ToString();
		}

		public string ListDiagrams(User user)
		{


			var Tcollection = GetCollection("Teams");
			var TuIdFilter = Builders<BsonDocument>.Filter.Eq("user", user.id);
			

			var diagram = Tcollection.Find(TuIdFilter).Project("{_id: 0, id: 0}").FirstOrDefault(); //may return null

			if(diagram != null){
				var diagramText = diagram.ToString();
				Console.WriteLine(diagramText);//outputs the diagram text
				Console.WriteLine(diagram);//outputs the diagram text

				var strings = diagram["diagrams"].AsBsonArray;
				string[] array = new string[strings.Count];
				Console.WriteLine(strings.Count);
				
				for(int i=0;i<strings.Count;i++){
					array[i] = strings[i].ToString();
				}
				
				DiagramSet[] diagrams = new DiagramSet[array.Count()];


				for(int i=0;i<strings.Count;i++){
					diagrams[i] = new DiagramSet(array[i], this.GetName(array[i]));
				}

				return JsonConvert.SerializeObject(diagrams);
			}
			else{
				Console.WriteLine("cant find doc");
				return null;
			}
		}

		private string GetName(string id){
			var collection = GetCollection("Diagrams");
			var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id));

			var doc = collection.Find(filter).FirstOrDefault();//not needed
			if(doc != null){
				Console.WriteLine(doc["id"].ToString());
				return doc["id"].ToString();
			}
			else{
				Console.WriteLine("cant find mongodb id");
				return null;
			}
		}

		public void Overwrite(Diagram diagram){
			var collection = GetCollection("Diagrams");

			var filter = Builders<BsonDocument>.Filter.Eq("id", diagram.id);
			MongoDB.Bson.BsonDocument doc = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(DTO.FromDiagram(diagram));
			collection.ReplaceOne(filter, doc);
		}
	}
}