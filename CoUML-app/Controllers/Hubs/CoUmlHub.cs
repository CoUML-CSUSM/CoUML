using System;
using System.IO;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Newtonsoft.Json;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

using CoUML_app.Models;
using Attribute = CoUML_app.Models.Attribute;

//mongodb stuff
using MongoDB.Driver;
using MongoDB.Bson;

/**
https://docs.microsoft.com/en-us/aspnet/signalr/overview/guide-to-the-api/working-with-groups
https://docs.microsoft.com/en-us/aspnet/signalr/overview/guide-to-the-api/mapping-users-to-connections

*/
namespace CoUML_app.Controllers.Hubs
{
    ///<summary> 
    /// functions that can be run on the client from the server
    /// </summary>
    public interface ICoUmlClient{
        Task issueUser(string message);
        Task Dispatch(string changes);
    }

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

    public class CoUmlHub : Hub<ICoUmlClient>
    {
        /// <summary>
        /// connection repo
        /// </summary>
        /// <typeparam name="string"></typeparam>
        /// <returns></returns>
        private readonly static ConnectionMap<string, IUser> _connections = new ConnectionMap<string, IUser>();

        private static Diagram testDiagram = DevUtility.DiagramDefualt("test"); // test code here
        //private static Diagram testDiagram = DevUtility.EmptyDiagram();

        

        // public CoUmlHub()
        // {
        // }

        
        
        /// <summary>
        /// when a new user attemps to connect their connection id gets logged in the connection repo
        /// and calls test connection
        /// </summary>
        /// <returns></returns>
        public override Task OnConnectedAsync()
        {
            string connectionId = Context.ConnectionId;
            IUser name = new User(connectionId);//this needs to become email
            _connections.Add(connectionId, name);

            IssueUser(connectionId);
            //can be removed make this happend when they login
            //connectionID can be like email or sum shit

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
            
            // Groups.RemoveFromGroupAsync(connectionId)
            _connections.Remove(connectionId);
            //same stuff but for sign out
            return base.OnDisconnectedAsync(exception);
        }

        /// <summary>
        /// test server to client communication
        /// </summary>
        /// <param name="connectionId">connectionId of client being called</param>
        //make login changes here
        public void IssueUser(string connectionId)
        {
            Clients.Client(connectionId).issueUser(connectionId);
        }


        /// <summary>
        /// find an existing diagram in memory and return it to the requesting client
        /// </summary>
        /// <param name="dId">somthing to identify the diagram file by</param>
        /// <returns>the diagram requested</returns>
        public string Fetch(string dId, string uId)
        {
            //attacha as a listener to this diagram
            Groups.AddToGroupAsync(Context.ConnectionId,dId);

            // Diagram fechedDiagram = testDiagram; // test code with sample diagram
            
            if( dId != "test")
            {
                //TODO: look up real diagram and return
                Console.WriteLine("not test id");
            }

            
            //finds document from database
            var dbClient = new MongoClient("mongodb://localhost:27017");
            IMongoDatabase db = dbClient.GetDatabase("CoUML");

            var collection = db.GetCollection<BsonDocument>("Diagrams");
            var dIdFilter = Builders<BsonDocument>.Filter.Eq("id", dId);
            var uIdFilter = Builders<BsonDocument>.Filter.Eq("editor.id", uId);
            var filter = Builders<BsonDocument>.Filter.And(dIdFilter,uIdFilter);
            
            var diagram = collection.Find(filter).Project("{_id: 0}").FirstOrDefault(); //may return null

            if(diagram == null){
                Generate(dId,uId);//change later to match email
                diagram = collection.Find(filter).Project("{_id: 0}").FirstOrDefault();
            }

            var diagramText = diagram.ToString();
            Console.WriteLine(diagramText);//outputs the diagram text
            //^ should change it so this is what gets returned ^

            /*

            return JsonConvert.SerializeObject(testDiagram, Formatting.Indented, new JsonSerializerSettings
                    {
                        TypeNameHandling = TypeNameHandling.Auto
                    });
            */
            return diagramText;
        }

        public void Push(string dId, string changes)
        {
            // TODO: changes get pushed from client to server to be logged and sent backout to other clients

            //push changes out to other clients
            Dispatch(dId, Context.ConnectionId, changes);

            //add mongodb update code

            //mongodb database
            var dbClient = new MongoClient("mongodb://localhost:27017");
            //adds document to the database
            IMongoDatabase db = dbClient.GetDatabase("CoUML");

        }

        public void Dispatch(string dId, string callerId, string changes)
        {
            Clients.GroupExcept(dId, new List<string>(){callerId}.AsReadOnly()).Dispatch(changes);
        }

        public void TriggerBreakPoint()
        {
            ;
        }


        //creates a diagram string that gets sent to the database
        public void Generate(string dId, string uId){


            //
            Console.WriteLine($"user test {Context.ConnectionId}");
            Console.WriteLine($"{_connections.GetUser(Context.ConnectionId).ToString()}");

            //
            //mongodb database
            var dbClient = new MongoClient("mongodb://localhost:27017");
            //adds document to the database
            IMongoDatabase db = dbClient.GetDatabase("CoUML");

            var collection = db.GetCollection<BsonDocument>("Diagrams");

            Diagram d = new Diagram(dId);
            d.editor = new User(uId);

            //sends diagram as bson doc using the string of the diagram
            MongoDB.Bson.BsonDocument doc = MongoDB.Bson.Serialization.BsonSerializer.Deserialize<BsonDocument>(
                JsonConvert.SerializeObject(d, Formatting.Indented, new JsonSerializerSettings
                    {
                        TypeNameHandling = TypeNameHandling.Auto
                    })
            );

            collection.InsertOne(doc);
        }

        public string OpenSampleFile()
        {
            string path = Directory.GetFiles(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Samples/"))[0];

            return File.ReadAllText(path);

        }

        public void Send(string Did, String Diagram){
            var dbClient = new MongoClient("mongodb://localhost:27017");
            IMongoDatabase db = dbClient.GetDatabase("CoUML");
            var collection = db.GetCollection<BsonDocument>("Diagrams");

            var filter = Builders<BsonDocument>.Filter.Eq("id", Did);
            var doc = BsonDocument.Parse(Diagram);
            collection.ReplaceOne(filter, doc);
        }

        //saves email to database
        //
        public void register(string uId){
            //mongodb database
            var dbClient = new MongoClient("mongodb://localhost:27017");
            //adds document to the database
            IMongoDatabase db = dbClient.GetDatabase("CoUML");

            var collection = db.GetCollection<BsonDocument>("Users");
            var filter = Builders<BsonDocument>.Filter.Eq("id", uId);
            
            var user = collection.Find(filter).Project("{_id: 0}").FirstOrDefault(); //may return null

            if(user == null){
                
                var doc = new BsonDocument
                {
                    {"id", uId},
                };

                collection.InsertOne(doc);
                Console.WriteLine(doc.ToString());
            }

        }

        public string[] listMyDiagrams(string id){
            var dbClient = new MongoClient("mongodb://localhost:27017");
            IMongoDatabase db = dbClient.GetDatabase("CoUML");

            var Tcollection = db.GetCollection<BsonDocument>("Teams");
            //var TdIdFilter = Builders<BsonDocument>.Filter.Eq("diagrams", "ObjectId(\"624df21e084f4afd218cd597\")");
            var TuIdFilter = Builders<BsonDocument>.Filter.Eq("user", id);
            //var Tfilter = Builders<BsonDocument>.Filter.And(TdIdFilter,TuIdFilter);
            
            //var p = Builders<Array>

            var diagram = Tcollection.Find(TuIdFilter).Project("{_id: 0, user: 0}").FirstOrDefault(); //may return null

            if(diagram != null){
            var diagramText = diagram.ToString();
            Console.WriteLine(diagramText);//outputs the diagram text
            Console.WriteLine(diagram);//outputs the diagram text

            //var strings = diagram["diagrams"].AsBsonArray.Select(p -> p.AsString).toArray();
            var strings = diagram["diagrams"].AsBsonArray;
            string[] array = new string[strings.Count];
            Console.WriteLine(strings.Count);
            
            for(int i=0;i<strings.Count;i++){
                array[i] = strings[i].ToString();
            }
            ;

            //
            // for(int i=0;i<strings.Count;i++){
            //     array[i] = JsonConvert.SerializeObject(strings[i], Formatting.Indented, new JsonSerializerSettings
            //         {
            //             TypeNameHandling = TypeNameHandling.Auto
            //         });
            // }
            //

            //Console.WriteLine(array);
            return array;

            // return JsonConvert.SerializeObject(strings, Formatting.Indented, new JsonSerializerSettings
            //         {
            //             TypeNameHandling = TypeNameHandling.Auto
            //         });

            }
            else{
                Console.WriteLine("cant find doc");
                return null;
                            }
        }

        public string getName(string id){
            var dbClient = new MongoClient("mongodb://localhost:27017");
            IMongoDatabase db = dbClient.GetDatabase("CoUML");

            var collection = db.GetCollection<BsonDocument>("Diagrams");
            //var filter = Builders<BsonDocument>.Filter.Eq("_id", "ObjectId(\"624df1ee084f4afd218cd596\")");
            var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse("624df1ee084f4afd218cd596"));

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
    }

    static class DevUtility{
        public static Diagram DiagramDefualt(String dId)
        {
            Diagram d = new Diagram(dId);


            // interface
            Interface i = new Interface("IShape");
            Operation io = new Operation
            {   
                name = "draw",
                visibility = VisibilityType.Public,
                type = new DataType{ dataType = "void"}
            };
            i.operations.Insert(io);

            io = new Operation
            {   
                name = "scale",
                visibility = VisibilityType.Public,
                type = new DataType{ dataType = "void"}
            };
            io.parameters.Insert(
                new Attribute {
                    name = "percent",
                    visibility = VisibilityType.Private,
                    type = new DataType{ dataType = "double" }
                }
            );
            i.operations.Insert(io);

            io = new Operation
            {   
                name = "area",
                visibility = VisibilityType.Public,
                type = new DataType{ dataType = "double"}
            };
            i.operations.Insert(io);


            // class
            Class c1  =  new Class("Hexagon");
            Models.Attribute a1 = new Models.Attribute
            {
                name = "diagonal",
                visibility = VisibilityType.Private,
                type = new DataType{ dataType = "double" }
            };

            c1.dimension.y = 400;
            c1.attributes.Insert(a1);

            // c impliments i
            Relationship r1 = new Relationship
            {
                type = RelationshipType.Realization,
                sourceComponent = c1,
                targetComponent = i,
            };
            // c1.relations.Insert(r1.id);
            // i.relations.Insert(r1.id);


            // class2
            Class c2  =  new Class("Trangle");

            c2.dimension.y = 400;
            c2.dimension.x = 400;

            Relationship r2 = new Relationship
            {
                type = RelationshipType.Realization,
                sourceComponent = c2,
                targetComponent = i,
            };
            // c2.relations.Insert(r2.id);
            // i.relations.Insert(r2.id);

            d.elements.Insert(i);
            d.elements.Insert(c1);
            d.elements.Insert(r1); 
            d.elements.Insert(c2); 
            d.elements.Insert(r2); 

            return d;
        }


        public static Diagram EmptyDiagram(){
            return new Diagram();
        }      

    }
}