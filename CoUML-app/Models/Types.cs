namespace CoUML_app.Models
{

	public enum VisabilityType{//enums cant be strings in c#
		Private=1,//-
		Public=2,//+
		Protected=3,//#
		Package=4,//~
		LocalScope=5//
	}

	public struct Datatype{
		public string DataType { get; set; }
	}


	enum RelationshipType{
		Dependency,
		Association,
		Aggregation,
		Composistion,
		Generalization
	}


}