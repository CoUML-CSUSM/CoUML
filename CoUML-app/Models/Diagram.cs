using  System;
using System.Collections.Generic;
using CoUML_app.Controllers.Generators;
using CoUML_app.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using CoUML_app.Controllers.Project;

namespace CoUML_app.Models
{

	public abstract class UmlElement
	{
		public string id { get; set;} = Guid.NewGuid().ToString();
		public IUser editor { get; set; } = new NullUser();
		public IDimension dimension { get; set; } = new Dimension(0,0,200,40);

		public abstract void GenerateCode(ISourceCodeGenerator codeGenerator);
		public abstract void Apply(ChangeRecord change, int index);
		protected bool IsThis(string[] ids)
		{
			return ids[ids.Length-1] == id;
		}
	}

	public class Diagram : UmlElement
	{
		public ICollection<UmlElement> elements {get;} = new RelationalCollection<UmlElement>();

		public Diagram(String dId)
		{
			id = dId;
		}
		public Diagram(){}

		override public void GenerateCode(ISourceCodeGenerator codeGenerator)
		{
			codeGenerator.CreatePackage(this);
			var elementIterator = elements.Iterator();
			while(elementIterator.HasNext())
				elementIterator.GetNext().GenerateCode(codeGenerator);
			codeGenerator.ClosePackage();
		}

		override public void Apply(ChangeRecord change, int depth)
		{
			if(IsThis(change.id))
			{
				
			}
			else
			{
				elements[change.id[depth]].Apply(change, ++depth);
			}

		}

		public void Apply(ChangeRecord[] changes)
		{
			foreach (var change in changes)
			{
				Apply(change, 0);
			}
		}

	}
}