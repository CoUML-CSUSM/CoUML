using System;
using System.Collections.Generic;
using System.Linq;
using CoUML_app.Controllers.Generators;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace CoUML_app.Models
{
	public abstract class Component : UmlElement{
		public string name { get;set; }

		[JsonIgnore]
		public ICollection<Component> ParentClasses { get; } = new GeneralCollection<Component>();
		[JsonIgnore]
		public ICollection<Component> ParentInterfaces { get; } = new GeneralCollection<Component>();
		[JsonIgnore]
		public ICollection<Component> Dependencies { get; } = new UniquCollection<Component>();

		
		public virtual void AddPropertiesFromRelation(Relationship relationship)
		{
			switch(relationship.type)
			{
				case RelationshipType.Generalization:
					ParentClasses.Insert(relationship.targetComponent);
					break;
				case RelationshipType.Realization:
					ParentInterfaces.Insert(relationship.targetComponent);
					break;
			}
			Dependencies.Insert(relationship.sourceComponent);
		}

		override public void GenerateCode(ISourceCodeGenerator codeGenerator)
		{
			codeGenerator.Parse(this);
		}

		override protected void ApplyLocally(ChangeRecord change)
		{
			switch(change.action)
			{
				case ActionType.Label: name = (string)change.value; break;
				default: base.ApplyLocally(change);	break;							
			}
		}

	}

	public class Enumeration : Component{
		public ICollection<Enumeral> enums { get;set; }= new RelationalCollection<Enumeral>();

		public Enumeration(): base() { }
		
		override public void Apply(ChangeRecord change, int depth)
		{
			if(AppliesToMe(change.id))
				ApplyLocally(change);
			else
				enums[change.id[++depth]].Apply(change, depth);
		}

		protected override void ApplyLocally(ChangeRecord change)
		{
			switch(change.action)
			{
				case ActionType.Insert: enums.Insert((Enumeral) change.value); break;
				case ActionType.Remove: enums.Remove((string) change.value); break;
				default: base.ApplyLocally(change);	break;							
			}
		}

	}
	
	public class Interface : Component{
		public ICollection<Operation> operations { get;set; }= new RelationalCollection<Operation>();
		public Interface(): base() { }
		
		override public void Apply(ChangeRecord change, int depth)
		{
			if(AppliesToMe(change.id))
				ApplyLocally(change);
			else
				operations[change.id[++depth]].Apply(change, depth);
		}

		protected override void ApplyLocally(ChangeRecord change)
		{
			switch(change.action)
			{
				case ActionType.Insert: operations.Insert((Operation)change.value); break;
				case ActionType.Remove: operations.Remove((string)change.value); break;
				default: base.ApplyLocally(change);	break;							
			}
		}
	}

	public class AbstractClass : Component{
		public ICollection<Operation> operations { get;set; }= new RelationalCollection<Operation>();
		public ICollection<Attribute>  attribute { get;set; }= new RelationalCollection<Attribute>();
		
		public AbstractClass(): base() { }

		override public void Apply(ChangeRecord change, int depth)
		{
			if(AppliesToMe(change.id))
				ApplyLocally(change);
			else
			{
				var next = change.id[++depth];
				ComponentProperty prop = operations[next];
				prop ??= attribute[next];
				prop?.Apply(change, depth);
			}
				
		}

		protected override void ApplyLocally(ChangeRecord change)
		{
			switch(change.action)
			{
				case ActionType.Insert: 
					switch(change.affectedProperty)
					{
						case PropertyType.Attribute: attribute.Insert((Attribute)change.value); break;
						case PropertyType.Operations: operations.Insert((Operation)change.value); break;
						default: break;
					}
					break;
				case ActionType.Remove:
					switch(change.affectedProperty)
					{
						case PropertyType.Attribute: attribute.Remove((string)change.value); break;
						case PropertyType.Operations: operations.Remove((string)change.value); break;
						default: break;
					}
					break;
				case ActionType.Change: 
				default: base.ApplyLocally(change);	break;							
			}
		}

		override
		public void AddPropertiesFromRelation(Relationship relationship)
		{
			switch(relationship.type)
			{
				case RelationshipType.Composistion:
				case RelationshipType.Aggregation:
					attribute.Insert(
						AttributeBuilder.CollectionAttribute(relationship.targetComponent)
					);
					break;
				case RelationshipType.Association:
					attribute.Insert(
						relationship.attribute ?? 
						AttributeBuilder.DefualtAttribute(relationship.targetComponent)
					);
					break;
			}
			base.AddPropertiesFromRelation(relationship);
		}
	}

	public class Class : AbstractClass{

		public Class(): base() { }
	}
}

