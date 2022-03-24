using System;
using System.Collections.Generic;
using CoUML_app.Models;

namespace CoUML_app.Models
{
	public abstract class Component : UmlElement{
		public string name { get;set; }

		public Component(string name)
		{
			this.name = name;
		}
	}

	public class Enumeration : Component{
		public ICollection<string> enums { get;set; }

		public Enumeration(string name): base(name)
		{
			this.enums = new GeneralCollection<string>();
		}
	}
	
	public class Interface : Component{
		public ICollection<Operation> operations { get;set; }
		public Interface(string name): base(name)
		{
			this.operations = new RelationalCollection<Operation>();
		}
	}

	public class AbstractClass : Component{
		public ICollection<Operation> operations { get;set; }
		public ICollection<Attribute>  attributes { get;set; }
		
		public AbstractClass(string name): base(name)
		{
			this.operations = new RelationalCollection<Operation>();
			this.attributes = new RelationalCollection<Attribute>();
		}
	}

	public class Class : Component{
		public ICollection<Operation> operations { get;set; }
		public ICollection<Attribute> attributes { get;set; }

		public Class(string name): base(name)
		{
			this.operations = new RelationalCollection<Operation>();
			this.attributes = new RelationalCollection<Attribute>();
		}
	}
}

