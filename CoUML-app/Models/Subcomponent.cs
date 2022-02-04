using  System;
using System.Collections.Generic;
namespace CoUML_app.Models
{

	public class Relationship : DiagramElement{
		public RelationshipType type {get; set;}
		public string from {get; set;}
		public Component fromComponent{set{from = value.id;}}
		public string to {get; set;}
		public Component toComponent{set{to = value.id;}}
		public ICollection<Attribute> attributes{get; set;}

		public Relationship()
		{
			this.attributes = new GeneralCollection<Attribute> ();
		}
	}


	public abstract class ComponentProperty{
		public string id { get; }
		public VisibilityType visibility {get; set;}
		public string name{get; set;}
		public string propertyString {get; set;}
		public DataType type{get; set;}

		public ComponentProperty()
		{
			this.id = Guid.NewGuid().ToString();
		}
	}

	public class Attribute: ComponentProperty{
		public Multiplicity multiplicity{get; set;}
		public string defaultValue {get; set;}

		public Attribute():base(){}
	}

	public class Operation: ComponentProperty{
		public ICollection<Attribute> parameters{get; set;}

		public Operation():base()
		{
			this.parameters = new GeneralCollection<Attribute> ();
		}
	}

	public struct Multiplicity
	{
		public int min {get; set;}
		public int max {get; set;}

	}


}