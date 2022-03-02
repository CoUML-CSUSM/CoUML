using  System;
using System.Collections.Generic;
using CoUML_app.Models;


namespace CoUML_app.Models
{

	public class Diagram
	{

		public string id;

		public ICollection<DiagramElement> elements {get;}

		public Diagram(String dId = null)
		{
			id = dId == null? Guid.NewGuid().ToString() : dId;
			this.elements = new GeneralCollection<DiagramElement>();
		}

	}

	public abstract class DiagramElement
	{
		public IUser editor { get; set; } = new NullUser();
		public string id { get; } = Guid.NewGuid().ToString();
		public IDimension dimension { get; set; } = new Dimension();
	}
}