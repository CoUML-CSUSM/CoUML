using  System;
using System.Collections.Generic;
using CoUML_app.Models;


namespace CoUML_app.Models
{

	public class Diagram
	{
		public string id { get; }
		public ICollection<SerializedElement> elements {get;}

		public Diagram(String? dId = null)
		{
			this.id = dId ?? Guid.NewGuid().ToString();
			this.elements = new RelationalCollection();
		}

	}

	public abstract class DiagramElement : SerializedElement
	{
		public IUser editor { get; set; } = new NullUser();
		public IDimension dimension { get; set; } = new Dimension();
	}

	public abstract class SerializedElement
	{
		public string id { get; } = Guid.NewGuid().ToString();
	}
}