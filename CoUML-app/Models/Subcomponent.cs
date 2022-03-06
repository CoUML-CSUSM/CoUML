using  System;
using System.Collections.Generic;
namespace CoUML_app.Models
{

	public class Relationship : DiagramElement{
		public RelationshipType type {get; set;}
		public string source {get; set;}
		public Component sourceComponent{set{source = value.id;}}
		public string target {get; set;}
		public Component targetComponent{set{target = value.id;}}
		public ICollection<Attribute> attributes{get; set;}

		public Relationship()
		{
			this.attributes = new RelationalCollection<Attribute> ();
		}
	}


	public abstract class ComponentProperty: SerializedElement{
		public VisibilityType visibility {get; set;}
		public string name{get; set;}
		public string propertyString {get; set;}
		public DataType type{get; set;}
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
			this.parameters = new RelationalCollection<Attribute> ();
		}
	}

	public struct Multiplicity
	{
		public int min {get; set;}
		public int max {get; set;}

	}


}