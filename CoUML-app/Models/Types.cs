namespace CoUML_app.Models
{

	public enum VisabilityType{//enums cant be strings in c#
		Private=1,//-
		Public=2,//+
		Protected=3,//#
		Package=4,//~
		LocalScope=5//
	}

	public struct DataType{
		public string dataType { get; set; }
		public DataType( string dt)
		{
			dataType = dt;
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