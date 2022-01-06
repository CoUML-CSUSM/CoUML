using CoUML_app.Models;

namespace CoUML_app.Models
{
	public abstract class Component : DiagramElement{
		public string name { get;set; }
		ICollection<string> relations {get; set;} = new GeneralCollection<string>();
	}

	public class Enumeration : Component{
		public ICollection<string> Enums { get;set; } = new GeneralCollection<string>();

		public Enumeration(string name)
		{
			this.name = name;
		}
	}
	public class Interface : Component{
		public ICollection<Operation> operations { get;set; } = new GeneralCollection<Operation>();
		public Interface(string name)
		{
			this.name = name;
		}
	}

	public class AbstractClass : Component{
		public ICollection<Operation>  operations { get;set; } = new GeneralCollection<Operation>();
		public ICollection<Attribute>  attributes { get;set; } = new GeneralCollection<Attribute>();
		
		public AbstractClass(string name)
		{
			this.name = name;
		}
	}

	public class Class : Component{
		public ICollection<Operation> operations { get;set; } = new GeneralCollection<Operation>();
		public ICollection<Attribute> attributes { get;set; } = new GeneralCollection<Attribute>();

		public Class(string name)
		{
			this.name = name;
		}
	}
}

