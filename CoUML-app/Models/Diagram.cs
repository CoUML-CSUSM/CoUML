using  System;
using System.Collections.Generic;
using CoUML_app.Models;


namespace CoUML_app.Models
{

	public class Diagram
	{
		public string id { get; }
		public ICollection<DiagramElement> elements {get;}

		public Diagram(String? dId = null)
		{
			this.id = dId ?? Guid.NewGuid().ToString();
			this.elements = new RelationalCollection<DiagramElement>();
		}

	}

	public abstract class DiagramElement : SerializedElement
	{
		public IDimension dimension { get; set; } = new Dimension();
	}

	public abstract class SerializedElement
	{
		public string id { get; } = Guid.NewGuid().ToString();
		public IUser editor { get; set; } = new NullUser();
	}
}