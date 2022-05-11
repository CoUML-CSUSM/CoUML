using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
namespace CoUML_app.Models
{

	public enum VisibilityType{//enums cant be strings in c#
		Private = 0,
		Public = 1,
		Protected = 2,
		Package = 3,
		LocalScope = 4
	}
	public static class VisibilityTypeHandler
	{
		public static VisibilityType From(char symbol)
		{
			switch(symbol)
			{
				case '-': return VisibilityType.Private;
				case '+': return VisibilityType.Public;
				case '#': return VisibilityType.Protected;
				case '~': return VisibilityType.Package;
				case ' ': default:
					return VisibilityType.LocalScope;
			}
		}
	}

	public struct DataType{
		public string dataType { get; set; }
		public DataType(string typeName)
		{
			dataType = typeName;
		}
	}


	public enum RelationshipType{
		/// F uses a T  [F] - - - > [T]
		Dependency,

		/// F owns a T 	[F]---------[T]
		Association,

		/// F has a T 	[F]< >-------[T]
		Aggregation,

		/// T is a part of F	[F]<#>-----[T]
		Composistion,

		/// F extends T 	[F]-------|>[T]
		Generalization,

		/// F impliments T 	[F]- - - |>[T]
		Realization
	}

	public class DiagramSet
	{
		public string id;
		public string _id;

		public DiagramSet(string _id, string id)
		{
			this._id = _id;
			this.id = id;
		}

		public override string ToString()
		{
			return $"id: {id}, _id: {_id}";
		}
	}
}