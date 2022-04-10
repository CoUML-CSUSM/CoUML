namespace CoUML_app.Models
{

	public enum VisibilityType{//enums cant be strings in c#
		Private = '-',
		Public  = '+',
		Protected  = '#',
		Package  = '~',
		LocalScope = ' '
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


}