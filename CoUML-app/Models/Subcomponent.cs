using  System;
namespace CoUML_app.Models
{

	public class Relationship : DiagramElement{
		public RelationshipType type {get; set;}
		public Guid from {get; set;}
		public Component fromComponent{set{from = value.id;}}
		public Guid to {get; set;}
		public Component toComponent{set{to = value.id;}}
		public ICollection<Attribute> attributes = new GeneralCollection<Attribute>();
	}


	public struct Attribute{
		public VisibilityType visibility {get; set;}
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
		public VisibilityType visibility {get; set;}
		public string name{get; set;}
		public ICollection<Attribute> parameters{get; set;}
		public DataType returnType{get; set;}
		public string propertyString {get; set;}
	}


}