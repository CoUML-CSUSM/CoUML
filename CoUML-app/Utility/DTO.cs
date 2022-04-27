using System;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

using CoUML_app.Models;
using MongoDB.Bson;

namespace CoUML_app.Utility
{
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
						TypeNameHandling = TypeNameHandling.All
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
				if(changeRecords[i].value is JObject)
				{
					JObject value = (JObject)changeRecords[i].value;
					if(value.HasValues)
					{
						changeRecords[i].value = ToUnknownType(value);
					}
				}
			}
			return changeRecords;
		}


		public static object ToUnknownType(JObject obj)
		{
			var t = obj.GetValue("$type")?.Value<string>();
			switch(t)
			{
				case "CoUML_app.Models.Diagram":        return To<Models.Diagram>(obj.ToString());
				case "CoUML_app.Models.Interface":      return To<Models.Interface>(obj.ToString());
				case "CoUML_app.Models.AbstractClass":  return To<Models.AbstractClass>(obj.ToString());
				case "CoUML_app.Models.Class":          return To<Models.Class>(obj.ToString());
				case "CoUML_app.Models.Enumeration":    return To<Models.Enumeration>(obj.ToString());
				case "CoUML_app.Models.Relationship":   return To<Models.Relationship>(obj.ToString());
				case "CoUML_app.Models.Operation":      return To<Models.Operation>(obj.ToString());
				case "CoUML_app.Models.Attribute":      return To<Models.Attribute>(obj.ToString());
				case "CoUML_app.Models.User":           return To<Models.User>(obj.ToString());
				case "CoUML_app.Models.NullUser":       return To<Models.NullUser>(obj.ToString());
				case "CoUML_app.Models.Dimension":		return To<Models.Dimension>(obj.ToString());
				case "CoUML_app.Models.Enumeral":		return To<Models.Enumeral>(obj.ToString());
				case "CoUML_app.Models.Point": 			return To<Models.Point>(obj.ToString());
				default: return JsonConvert.DeserializeObject(obj.ToString());
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
				case "CoUML_app.Models.Enumeral":    	return jo.ToObject<Enumeration>(serializer);
				case "CoUML_app.Models.Relationship":   return jo.ToObject<Relationship>(serializer);
				case "CoUML_app.Models.Operation":      return jo.ToObject<Operation>(serializer);
				case "CoUML_app.Models.Attribute":      return jo.ToObject<Models.Attribute>(serializer);
				case "CoUML_app.Models.User":           return jo.ToObject<Models.User>(serializer);
				case "CoUML_app.Models.NullUser":       return jo.ToObject<Models.NullUser>(serializer);
				case "CoUML_app.Models.Point": 			return jo.ToObject<Point>(serializer);

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