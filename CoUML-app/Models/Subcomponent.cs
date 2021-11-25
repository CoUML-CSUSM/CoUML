namespace CoUML_app.Models
{

	public class Relationship : DiagramElement{
		RelationshipType type;
		Component fromComponent;
		Component toComponent;
		ICollection<Attribute> attributes;
	}


	public struct Attribute{
		VisabilityType visability {get; set;}
		string name{get; set;}
		Datatype type{get; set;}
		Multiplicity multiplicity{get; set;}
		string defaultName {get; set;}
		string propertyString {get; set;}
	}

	public struct Multiplicity
	{
		public int min {get; set;}
		public int max {get; set;}

	}

	public struct Operation{
		VisabilityType visability {get; set;}
		string name{get; set;}
		ICollection<Attribute> parameters{get; set;}
		Datatype returnType{get; set;}
		string propertyString {get; set;}
	}


}