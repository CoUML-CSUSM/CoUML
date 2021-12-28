namespace CoUML_app.Models
{

	public class Relationship : DiagramElement{
		public RelationshipType type {get; set;}
		public Component fromComponent {get; set;}
		public Component toComponent {get; set;}
		public ICollection<Attribute> attributes;
	}


	public struct Attribute{
		public VisabilityType visability {get; set;}
		public string name{get; set;}
		public DataType type{get; set;}
		public Multiplicity multiplicity{get; set;}
		public string defaultValue {get; set;}
		public string propertyString {get; set;}
	}

	public struct Multiplicity
	{
		public int min {get; set;}
		public int max {get; set;}

	}

	public struct Operation{
		public VisabilityType visability {get; set;}
		public string name{get; set;}
		public ICollection<Attribute> parameters{get; set;}
		public DataType returnType{get; set;}
		public string propertyString {get; set;}
	}


}