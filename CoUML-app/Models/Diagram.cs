using  System;
using System.Collections.Generic;
using CoUML_app.Controllers.Generators;
using CoUML_app.Models;


namespace CoUML_app.Models
{

	public abstract class UmlElement
	{
		public string id { get; } = Guid.NewGuid().ToString();
		public IUser editor { get; set; } = new NullUser();
		public IDimension dimension { get; set; } = new Dimension(0,0,200,40);

		public abstract void GenerateCode(ISourceCodeGenerator codeGenerator);

		public UmlElement(){

		}
	}

	public class Diagram : UmlElement
	{
		// public string id { get; }
		public ICollection<UmlElement> elements {get;}

		public Diagram(String? dId = null)
		{
			// this.id = dId ?? Guid.NewGuid().ToString();
			this.elements = new RelationalCollection<UmlElement>();
		}

		override public void GenerateCode(ISourceCodeGenerator codeGenerator)
		{
			codeGenerator.CreatePackage(this);
			var elementIterator = elements.Iterator();
			while(elementIterator.HasNext())
				elementIterator.GetNext().GenerateCode(codeGenerator);
			codeGenerator.ClosePackage();
		}

	}
}