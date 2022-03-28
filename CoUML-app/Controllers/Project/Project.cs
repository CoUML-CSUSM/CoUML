using System;
using System.IO;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

using CoUML_app.Models;

//mongodb stuff
using MongoDB.Driver;
using MongoDB.Bson;
using CoUML_app.Controllers.Generators;

namespace CoUML_app.Controllers.Project{

	public class ProjectController
	{
		const string COUMLDB_URL = "mongodb://localhost:27017";	
		const string COUMLDB_NAME = "CoUML";
        private IMongoClient _dbClient;

        public ProjectController()
        {
            _dbClient = new MongoClient(COUMLDB_URL);
        }
        // public Diagram? LookUp(string dId)
        public BsonDocument? LookUp(string dId)
        {
            var collection = GetCollection("Diagrams");
            var filter = Builders<BsonDocument>.Filter.Eq("id", dId);
            var diagramBSON = collection.Find(filter).Project("{_id: 0}").FirstOrDefault(); //may return null
            return diagramBSON;
            // if(diagramBSON != null)
            // {
            //     var d = DTO.ToDiagram(diagramBSON);
            //     Console.WriteLine(d);
            //     return d;
            // }
            // return null;
        }


        //creates a diagram string that gets sent to the database
		public void Generate(string dId){

            var collection = GetCollection("Diagrams");

            //sends diagram as bson doc using the string of the diagram
            MongoDB.Bson.BsonDocument doc = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(
                DTO.FromDiagram(new Diagram(dId))
            );

            collection.InsertOne(doc);
        }


        public void Overwrite(string dId, String diagramDTO){
            var collection = GetCollection("Diagrams");

            var filter = Builders<BsonDocument>.Filter.Eq("id", dId);
            MongoDB.Bson.BsonDocument doc = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(diagramDTO);
            collection.ReplaceOne(filter, doc);
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
            JsonConverter[] converters = { new UmlElementJsonConverter()};
            return JsonConvert.DeserializeObject<Diagram>(bd.ToString(), new JsonSerializerSettings
                {
                    TypeNameHandling = TypeNameHandling.Auto,
                    Converters = converters
                });
        }
    }
    #pragma warning restore format
    public class UmlElementJsonConverter: JsonConverter
    {    public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(UmlElement);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            //https://blog.codeinside.eu/2015/03/30/json-dotnet-deserialize-to-abstract-class-or-interface/
            JObject jo = JObject.Load(reader);

            Console.WriteLine($"{jo["$type"] ?? jo["typeName"]}");
            switch((jo["$type"]?? jo["typeName"]).ToString())
            {
                case "CoUML_app.Models.Diagram, CoUML-app": return jo.ToObject<Diagram>(serializer); break;
                case "CoUML_app.Models.Interface, CoUML-app": return jo.ToObject<Interface>(serializer); break;
                case "CoUML_app.Models.AbstractClass, CoUML-app": return jo.ToObject<AbstractClass>(serializer); break;
                case "CoUML_app.Models.Class, CoUML-app": return jo.ToObject<Class>(serializer); break;
                case "CoUML_app.Models.Enumeration, CoUML-app": return jo.ToObject<Enumeration>(serializer); break;
                case "CoUML_app.Models.Relationship, CoUML-app": return jo.ToObject<Relationship>(serializer); break;
                case "CoUML_app.Models.Operation, CoUML-app": return jo.ToObject<Operation>(serializer); break;
                case "CoUML_app.Models.Attribute, CoUML-app": return jo.ToObject<Models.Attribute>(serializer); break;
                case "CoUML_app.Models.User, CoUML-app": return jo.ToObject<Models.User>(serializer); break;
                case "CoUML_app.Models.NullUser, CoUML-app": return jo.ToObject<Models.NullUser>(serializer); break;
            }
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