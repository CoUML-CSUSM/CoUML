using System;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

using CoUML_app.Models;
using CoUML_app.Controllers.Hubs;
using CoUML_app.Utility;
//mongodb stuff
using MongoDB.Driver;
using MongoDB.Bson;

namespace CoUML_app.Controllers.Project
{

	public class ProjectController
	{
		const string COUMLDB_URL = "mongodb://localhost:27017";	
		const string COUMLDB_NAME = "CoUML";
		private IMongoClient _dbClient;

		public ProjectController()
		{
			_dbClient = new MongoClient(COUMLDB_URL);
		}

		public BsonDocument? Find(string dId)
		{
			var collection = GetCollection("Diagrams");
			var filter = Builders<BsonDocument>.Filter.Eq("id", dId);
			var diagramBSON = collection.Find(filter).Project("{_id: 0}").FirstOrDefault(); //may return null
			return diagramBSON;
		}

		public Diagram FindDiagram(string dId)
		{
			BsonDocument diagramBSON = Find(dId);
			if(diagramBSON != null)
			{
				var d = DTO.ToDiagram(diagramBSON);
				;
				return d;
			}
			return null;
		}


		//creates a diagram string that gets sent to the database
		public Diagram Generate(string dId){

			var collection = GetCollection("Diagrams");
			var projectDiagram = dId =="test" ? Template.DiagramDefualt(dId): new Diagram(dId);

			//sends diagram as bson doc using the string of the diagram
			MongoDB.Bson.BsonDocument doc = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(
				DTO.FromDiagram(projectDiagram)
			);

			collection.InsertOne(doc);
			return projectDiagram;
		}


		public void Overwrite(Diagram diagram){
			var collection = GetCollection("Diagrams");

			var filter = Builders<BsonDocument>.Filter.Eq("id", diagram.id);
			MongoDB.Bson.BsonDocument doc = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(DTO.FromDiagram(diagram));
			collection.ReplaceOne(filter, doc);
		}

		public void Write(string dId, ChangeRecord[] change)
		{
			
		}

		private IMongoCollection<BsonDocument> GetCollection(string collectionName)
		{
			IMongoDatabase db = _dbClient.GetDatabase(COUMLDB_NAME);
			return db.GetCollection<BsonDocument>(collectionName);
		}
	}

	public static class DTO
	{
		public static string FromDiagram(Diagram d)
		{
			return JsonConvert.SerializeObject(d, Formatting.Indented, new JsonSerializerSettings
					{
						TypeNameHandling = TypeNameHandling.Auto
					});
		}

		public static Diagram ToDiagram(BsonDocument bd)
		{
			return JsonConvert.DeserializeObject<Diagram>(bd.ToString(), new JsonSerializerSettings
					{
						TypeNameHandling = TypeNameHandling.Auto,
					});
		}

		public static string From<T>(T typedObject)
		{
			return JsonConvert.SerializeObject(typedObject, Formatting.Indented, new JsonSerializerSettings
					{
						TypeNameHandling = TypeNameHandling.Auto
					});
		}

		public static T To<T>(string stringObject)
		{
			return JsonConvert.DeserializeObject<T>(stringObject, new JsonSerializerSettings
					{
						TypeNameHandling = TypeNameHandling.Auto,
					});
		}

		public static ChangeRecord[] ToChangeRecords(string crs)
		{
			var changeRecords = To<ChangeRecord[]>(crs);
			for(int i = 0; i< changeRecords.Length; i++)
			{
				JObject value = (JObject)changeRecords[i].value;
				if(value.HasValues)
				{
					 changeRecords[i].value = ToUnknownType(value);
				}
					
				
			}
			return changeRecords;
		}


		public static object ToUnknownType(JObject obj)
		{
			var t = obj.GetValue("$type").Value<string>();
			switch(t)
			{
				case "CoUML_app.Models.Diagram":        return To<Diagram>(obj.ToString());
				case "CoUML_app.Models.Interface":      return To<Interface>(obj.ToString());
				case "CoUML_app.Models.AbstractClass":  return To<AbstractClass>(obj.ToString());
				case "CoUML_app.Models.Class":          return To<Class>(obj.ToString());
				case "CoUML_app.Models.Enumeration":    return To<Enumeration>(obj.ToString());
				case "CoUML_app.Models.Relationship":   return To<Relationship>(obj.ToString());
				case "CoUML_app.Models.Operation":      return To<Operation>(obj.ToString());
				case "CoUML_app.Models.Attribute":      return To<Models.Attribute>(obj.ToString());
				case "CoUML_app.Models.User":           return To<Models.User>(obj.ToString());
				case "CoUML_app.Models.NullUser":       return To<Models.NullUser>(obj.ToString());
				case "CoUML_app.Models.Dimension":		return To<Dimension>(obj.ToString());
				default: return null;
			}
		}
	}


	public class BaseSpecifiedConcreteClassConverter : DefaultContractResolver
	{
		protected override JsonConverter ResolveContractConverter(Type objectType)
		{
			if (typeof(UmlElement).IsAssignableFrom(objectType) && !objectType.IsAbstract)
				return null; // pretend TableSortRuleConvert is not specified (thus avoiding a stack overflow)
			return base.ResolveContractConverter(objectType);
		}
	}
	public class UmlElementJsonConverter: JsonConverter
	{
		static JsonSerializerSettings SpecifiedSubclassConversion = new JsonSerializerSettings() { ContractResolver = new BaseSpecifiedConcreteClassConverter() };


		public override bool CanConvert(Type objectType)
		{
			return objectType == typeof(UmlElement);
		}

		public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
		{
			//https://blog.codeinside.eu/2015/03/30/json-dotnet-deserialize-to-abstract-class-or-interface/
			JObject jo = JObject.Load(reader);

			Console.WriteLine($"Type:\t{objectType}\t{jo["$type"] ?? jo["typeName"]}");
			Console.WriteLine(jo);
			switch(objectType.ToString())
			{
				case "CoUML_app.Models.Diagram":        return jo.ToObject<Diagram>(serializer);
				case "CoUML_app.Models.Interface":      return jo.ToObject<Interface>(serializer);
				case "CoUML_app.Models.AbstractClass":  return jo.ToObject<AbstractClass>(serializer);
				case "CoUML_app.Models.Class":          return jo.ToObject<Class>(serializer);
				case "CoUML_app.Models.Enumeration":    return jo.ToObject<Enumeration>(serializer);
				case "CoUML_app.Models.Relationship":   return jo.ToObject<Relationship>(serializer);
				case "CoUML_app.Models.Operation":      return jo.ToObject<Operation>(serializer);
				case "CoUML_app.Models.Attribute":      return jo.ToObject<Models.Attribute>(serializer);
				case "CoUML_app.Models.User":           return jo.ToObject<Models.User>(serializer);
				case "CoUML_app.Models.NullUser":       return jo.ToObject<Models.NullUser>(serializer);

			}
			Console.WriteLine("returning null");
			return null;
		}

		public override bool CanWrite
		{
			get { return false; }
		}

		public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
		{
			serializer.Serialize(writer, value);
		}
	}
}