using CoUML_app.Models;

namespace CoUML_app.Models
{
	public abstract class Component : DiagramElement{
		protected string compName;
		ICollection<Relationship> relations;
	}

	public class Enumeration : Component{
		public ICollection<string> Enums;

		public Enumeration(string name)
		{
			this.compName = name;
		}
	}
	public class Interface : Component{
		public ICollection<Operation> Operations;
		public Interface(string name)
		{
			this.compName = name;
		}
	}

	public class AbstractClass : Component{
		public ICollection<Operation>  operations;
		public ICollection<Attribute>  attributes;
		
		public AbstractClass(string name)
		{
			this.compName = name;
		}
	}

	public class Class : Component{
		public ICollection<Operation>  operations;
		public ICollection<Attribute> attributes;

		public Class(string name)
		{
			this.compName = name;
		}
	}
}

