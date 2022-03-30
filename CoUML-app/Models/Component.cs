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
	}

	public class Enumeration : Component{
		public ICollection<string> enums { get;set; }= new GeneralCollection<string>();

		public Enumeration(string name): base(name)
		{
		}
	}
	
	public class Interface : Component{
		public ICollection<Operation> operations { get;set; }= new RelationalCollection<Operation>();
		public Interface(string name): base(name)
		{
		}
		
	}

	public class AbstractClass : Component{
		public ICollection<Operation> operations { get;set; }= new RelationalCollection<Operation>();
		public ICollection<Attribute>  attributes { get;set; }= new RelationalCollection<Attribute>();
		
		public AbstractClass(string name): base(name)
		{
		}

	}

	public class Class : Component{
		public ICollection<Operation> operations { get;set; }= new RelationalCollection<Operation>();
		public ICollection<Attribute> attributes { get;set; }= new RelationalCollection<Attribute>();

		public Class(string name): base(name)
		{
		}

	}
}

