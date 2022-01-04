using CoUML_app.Models;

namespace CoUML_app.Models
{
	public abstract class Component : DiagramElement{
		protected string compName { get;set; }
		ICollection<DiagramElement> Relations = new RelationalCollection();
	}

	public class Enumeration : Component{
		public ICollection<string> Enums { get;set; } = new GeneralCollection<string>();

		public Enumeration(string name)
		{
			this.compName = name;
		}
	}
	public class Interface : Component{
		public ICollection<Operation> Operations { get;set; } = new GeneralCollection<Operation>();
		public Interface(string name)
		{
			this.compName = name;
		}
	}

	public class AbstractClass : Component{
		public ICollection<Operation>  Operations { get;set; } = new GeneralCollection<Operation>();
		public ICollection<Attribute>  Attributes { get;set; } = new GeneralCollection<Attribute>();
		
		public AbstractClass(string name)
		{
			this.compName = name;
		}
	}

	public class Class : Component{
		public ICollection<Operation> Operations { get;set; } = new GeneralCollection<Operation>();
		public ICollection<Attribute> Attributes { get;set; } = new GeneralCollection<Attribute>();

		public Class(string name)
		{
			this.compName = name;
		}
	}
}

