using  System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using CoUML_app.Controllers.Generators;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace CoUML_app.Models
{
	public static class CoUmlRegex
	{
		public const string VISIBILITY = "Visisbility";
		public const string NAME = "Name";
		public const string TYPE = "Type";
		public const string MULTIPLICITY = "Multiplicity";
		public const string DEFUALT_VALUE = "DefualtValue";
		public const string PROPERTY_STRING = "PropertySting";
		public const string PARAMETERS = "Parameters";
		public const string MIN = "Min";
		public const string MAX = "Max";


		public const string ATTIBUTE_PATTERN = @"(?<Visisbility>[\+\-\#\~])*\s*(?<Name>\w+)\s*(?:\:\s*(?<Type>\w+))*\s*(?:\[(?<Multiplicity>[\*0-9]+(?:\.\.)*[\*0-9]*)\])*\s*(?:\=\s*(?<DefualtValue>\""*\w+\""*))*\s*(?<PropertySting>\{.*\})*";
		/**
		* "- _myPrivateAtt: Object"
		* 1: Visisbility
		* 2: Name
		* 3: Type
		* 4: Multiplicity (lower..higher)
		* 5: Defualt Value
		* 6: Property Sting
		*/

		public const string OPERATION_PATTERN = @"(?<Visisbility>[\+\-\#\~])*\s*(?<Name>\w+)\s*(?:\(\s*(?<Parameters>.*)\))*\s*(?:\:\s*(?<Type>\w*))*\s*(?<PropertySting>\{.*\})*";
		/**
		* 1: Visisbility
		* 2: Name
		* 3: Parameters
		* 4: ReturnType
		* 5: Property Sting
		*/

		public const string MULTIPLICITY_PATTERN = @"(?:(?<Min>[0-9\2]+)*(?:\.\.))*(?<Max>[\*0-9]+)";
		/**
		*	*		["*",		null,	-1	]
		*	1		["1", 		null,	1	]
		*	15		["15", 		null,	15	]
		*	1..2	["1..2",	1,	 	2	]
		*	12..134	["12..134",	12,		134	]
		*	1..*	["1..*",	1		-1	]
		*	1..3	["1..3",	1,		3	]
		*/

		public static GroupCollection Match(string description, string pattern)
		{
			return Regex.Match(description, pattern).Groups;
		}
	}

	public class Relationship : UmlElement{
		public RelationshipType type {get; set;}
		public string source {get; set;}
		[JsonIgnore]
		public Component sourceComponent{set{source = value.id;}get{return (Component)Parent.elements[source];}}
		public string target {get; set;}
		[JsonIgnore]
		public Component targetComponent{set{target = value.id;} get{return (Component)Parent.elements[target];}}
		public Attribute? attribute{get; set;}

		public Relationship() { }
		override public void GenerateCode(ISourceCodeGenerator codeGenerator)
		{
			codeGenerator.Parse(this);
		}

		override public void Apply(ChangeRecord change, int depth)
		{
			if(AppliesToMe(change.id))
				ApplyLocally(change);
		}

		protected override void ApplyLocally(ChangeRecord change)
		{
			switch(change.action)
			{
				case ActionType.Label: 	
					Label((string?) change.value);
					break;

				case ActionType.Change:		
					switch (change.affectedProperty)
					{
						case PropertyType.Source:
							source = (string)change.value;
							break;

						case PropertyType.Target: 	
							target = (string)change.value; 
							break;
							
						case PropertyType.Type: 	
							type = Enum.Parse<RelationshipType>(change.value.ToString()); 
							break;

						default:
						base.ApplyLocally(change); break;
					}
					break;
				default: base.ApplyLocally(change);
				break;							
			}
				
		}

		public void Label(string? description = "")
		{
			attribute = description == "" ? null : new Attribute(description);
		}

		override
		public void Validate(Diagram parent)
		{
			base.Validate(parent);
			if(IsValidRelation())
				((Component)this.Parent.elements[source]).AddPropertiesFromRelation(this);

		}

		private bool IsValidRelation()
		{
			return source is not null && target is not null;
		}
	}


	public abstract class ComponentProperty: UmlElement{
		public VisibilityType visibility {get; set;} = VisibilityType.LocalScope;
		public string name{get; set;}
		public string propertyString {get; set;} = null;
		public DataType type{get; set;} 

		override public void GenerateCode(ISourceCodeGenerator codeGenerator)
		{
			codeGenerator.Parse(this);
		}

		override public void Apply(ChangeRecord change, int depth)
		{
			if(AppliesToMe(change.id))
				ApplyLocally(change);
		}

		override protected void ApplyLocally(ChangeRecord change)
		{
			switch(change.action)
			{
				case ActionType.Label: 	
					Label((string)change.value);	
					break;

				case ActionType.Change:		
					switch (change.affectedProperty)
					{
						case PropertyType.Visibility:
							visibility = (VisibilityType)change.value;
							break;

						case PropertyType.Name: 	
							name = (string)change.value; 
							break;

						case PropertyType.PropertyString:
							propertyString = (string)change.value;
							break;

						case PropertyType.Type: 	
							type = (DataType)change.value; 
							break;

						default: 
						base.ApplyLocally(change);
						break;
					}
					break;
				default: base.ApplyLocally(change);
				break;							
			}
				
		}

		public abstract void Label(string description);

	}

	public class Attribute: ComponentProperty{
		public Multiplicity multiplicity{get; set;} = new Multiplicity();
		public string defaultValue {get; set;} = null;

		public Attribute():base(){ }
		public Attribute(string description):base()
		{
			Label(description);
		}

		public override void Label(string description)
		{
			var tokens = CoUmlRegex.Match(description, CoUmlRegex.ATTIBUTE_PATTERN);

			visibility = VisibilityTypeHandler.From(tokens[CoUmlRegex.VISIBILITY].Value.Length>0 ? tokens[CoUmlRegex.VISIBILITY].Value.ToCharArray()[0] : ' ') ;
			name = tokens[CoUmlRegex.NAME].Value;
			type = new DataType(tokens[CoUmlRegex.TYPE].Value);
			multiplicity = new Multiplicity(tokens[CoUmlRegex.MULTIPLICITY].Success? tokens[CoUmlRegex.MULTIPLICITY].Value : "1");
			defaultValue =  tokens[CoUmlRegex.DEFUALT_VALUE].Value;
			propertyString = tokens[CoUmlRegex.PROPERTY_STRING].Value;
		}
	}

	public class Operation: ComponentProperty{
		public ICollection<Attribute> parameters{get; set;} = new RelationalCollection<Attribute> ();

		public Operation():base() { }
		public Operation(string description):base()
		{
			Label(description);
		}

		public override void Label(string description)
		{
			var tokens = CoUmlRegex.Match(description, CoUmlRegex.OPERATION_PATTERN);

			visibility = VisibilityTypeHandler.From(tokens[CoUmlRegex.VISIBILITY].Value.Length>0 ? tokens[CoUmlRegex.VISIBILITY].Value.ToCharArray()[0] : ' ') ;
			name = tokens[CoUmlRegex.NAME].Value;
			Parameterize(tokens[CoUmlRegex.PARAMETERS].Value);
			type = new DataType(tokens[CoUmlRegex.TYPE].Value);
			propertyString = tokens[CoUmlRegex.PROPERTY_STRING].Value;
		}

		private void Parameterize(string parameterString)
		{
			parameters.RemoveAll();
			if(parameterString.Length > 0)
			{
				var paramTokens = Regex.Split(parameterString, ", ");
				foreach( var param in paramTokens)
					parameters.Insert(new Attribute(param));
			}
		}
	}

	public class Enumeral: UmlElement
	{
		public string name {get; set;}

		public override void Apply(ChangeRecord change, int index)
		{
			switch(change.action)
			{
				case ActionType.Label:  
					this.name = (string)change.value;
					break;
				default: 
					base.ApplyLocally(change); 
					break;
			}
		}

	}

	public struct Multiplicity
	{
		public int min {get; set;}
		public int max {get; set;}

		public Multiplicity( string description = "1")
		{
			var tokens = CoUmlRegex.Match(description, CoUmlRegex.MULTIPLICITY_PATTERN);
			max = tokens[CoUmlRegex.MAX].Value == "*" ?  -1 : Int32.Parse(tokens[CoUmlRegex.MAX].Value);
			min = tokens[CoUmlRegex.MIN].Value.Length > 0 ?Int32.Parse(tokens[CoUmlRegex.MIN].Value): max;
		}

		public bool IsSingle()
		{
			return min == 1 && max == 1;
		}
	}

	public static class AttributeBuilder
	{
		public static Attribute CollectionAttribute(Component component)
		{
			Attribute a = DefualtAttribute(component);
			a.name+='s';
			a.multiplicity = new Multiplicity("*");
			return a;
		}
		public static Attribute DefualtAttribute(Component component)
		{
			Attribute a = new Attribute();
			a.visibility = VisibilityType.LocalScope;
			a.name = "_"+component.name.ToLower();
			a.type = new DataType(component.name);
			return a;
		}
	}
}