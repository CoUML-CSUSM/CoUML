using System;
using System.Collections.Generic;
using CoUML_app.Models;
using CoUML_app.Controllers.Generators;

namespace CoUML_app.Models
{
	public abstract class Component : UmlElement{
		public string name { get;set; }

		public Component(string name)
		{
			this.name = name;
		}
		override public void GenerateCode(ISourceCodeGenerator codeGenerator)
		{
			codeGenerator.Parse(this);
		}

		protected override void ApplyLocally(ChangeRecord change)
		{
			switch(change.action)
			{
				case ActionType.Change: break;
				case ActionType.Label: name = (string)change.value; break;
				default: base.ApplyLocally(change);	break;							
			}
		}

	}

	public class Enumeration : Component{
		public ICollection<string> enums { get;set; }= new GeneralCollection<string>();

		public Enumeration(string name): base(name) { }
		
		override public void Apply(ChangeRecord change, int depth)
		{
			if(AppliesToMe(change.id))
				ApplyLocally(change);
		}

		protected override void ApplyLocally(ChangeRecord change)
		{
			switch(change.action)
			{
				case ActionType.Insert: enums.Insert((string) change.value); break;
				case ActionType.Remove: enums.Remove((string) change.value); break;
				default: base.ApplyLocally(change);	break;							
			}
		}

	}
	
	public class Interface : Component{
		public ICollection<Operation> operations { get;set; }= new RelationalCollection<Operation>();
		public Interface(string name): base(name) { }
		
		override public void Apply(ChangeRecord change, int depth)
		{
			if(AppliesToMe(change.id))
				ApplyLocally(change);
			else
				operations[change.id[depth]].Apply(change, ++depth);
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
		public ICollection<Attribute>  attributes { get;set; }= new RelationalCollection<Attribute>();
		
		public AbstractClass(string name): base(name) { }

		override public void Apply(ChangeRecord change, int depth)
		{
			if(AppliesToMe(change.id))
				ApplyLocally(change);
			else
			{
				var next = change.id[depth++];
				ComponentProperty prop = operations[next];
				prop ??= attributes[next];
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
						case PropertyType.Attributes: attributes.Insert((Attribute)change.value); break;
						case PropertyType.Operations: operations.Insert((Operation)change.value); break;
						default: break;
					}
					break;
				case ActionType.Remove:
					switch(change.affectedProperty)
					{
						case PropertyType.Attributes: attributes.Remove((string)change.value); break;
						case PropertyType.Operations: operations.Remove((string)change.value); break;
						default: break;
					}
					break;
				case ActionType.Change: break;
				default: base.ApplyLocally(change);	break;							
			}
		}
	}

	public class Class : Component{
		public ICollection<Operation> operations { get;set; }= new RelationalCollection<Operation>();
		public ICollection<Attribute> attributes { get;set; }= new RelationalCollection<Attribute>();

		public Class(string name): base(name) { }

		override public void Apply(ChangeRecord change, int depth)
		{
			if(AppliesToMe(change.id))
				ApplyLocally(change);
			else
			{
				var next = change.id[depth++];
				ComponentProperty prop = operations[next];
				prop ??= attributes[next];
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
						case PropertyType.Attributes: attributes.Insert((Attribute)change.value); break;
						case PropertyType.Operations: operations.Insert((Operation)change.value); break;
					}
					break;
				case ActionType.Remove:
					switch(change.affectedProperty)
					{
						case PropertyType.Attributes: attributes.Remove((string)change.value); break;
						case PropertyType.Operations: operations.Remove((string)change.value); break;
					}
					break;
				case ActionType.Change: break;
				default: base.ApplyLocally(change);	break;							
			}
		}
	}
}

