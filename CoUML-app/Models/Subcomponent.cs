using  System;
using System.Collections.Generic;
using CoUML_app.Controllers.Generators;
namespace CoUML_app.Models
{

	public class Relationship : UmlElement{
		public RelationshipType type {get; set;}
		public string source {get; set;}
		public Component sourceComponent{set{source = value.id;}}
		public string target {get; set;}
		public Component targetComponent{set{target = value.id;}}
		public Attribute attributes{get; set;}

		public Relationship()
		{
		}
		override public void GenerateCode(ISourceCodeGenerator codeGenerator)
		{
			codeGenerator.Parse(this);
		}
	}


	public abstract class ComponentProperty: UmlElement{
		public VisibilityType visibility {get; set;}
		public string name{get; set;}
		public string propertyString {get; set;}
		public DataType type{get; set;}
		override public void GenerateCode(ISourceCodeGenerator codeGenerator)
		{
			codeGenerator.Parse(this);
		}
	}

	public class Attribute: ComponentProperty{
		public Multiplicity multiplicity{get; set;}
		public string defaultValue {get; set;}

		public Attribute():base(){}
	}

	public class Operation: ComponentProperty{
		public ICollection<Attribute> parameters{get; set;} = new RelationalCollection<Attribute> ();

		public Operation():base()
		{
		}
	}

	public struct Multiplicity
	{
		public int min {get; set;}
		public int max {get; set;}

	}
}