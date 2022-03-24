using  System;
using System.Collections.Generic;
using CoUML_app.Models;


namespace CoUML_app.Models
{

	public abstract class UmlElement
	{
		public string id { get; } = Guid.NewGuid().ToString();
		public IUser editor { get; set; } = new NullUser();
		public IDimension dimension { get; set; } = new Dimension(0,0,200,40);


		//abstract methods here
		//different from the ts versions

		public UmlElement(){

		}
	}

	public class Diagram
	{
		public string id { get; }
		public ICollection<UmlElement> elements {get;}

		public Diagram(String? dId = null)
		{
			this.id = dId ?? Guid.NewGuid().ToString();
			this.elements = new RelationalCollection<UmlElement>();
		}

	}
}