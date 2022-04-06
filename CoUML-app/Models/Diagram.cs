using  System;
using System.Collections.Generic;
using CoUML_app.Models;


namespace CoUML_app.Models
{

	public abstract class UmlElement
	{
		public string id { get; set; } = Guid.NewGuid().ToString();
		public IUser editor { get; set; } = new NullUser();
		public IDimension dimension { get; set; } = new Dimension(0,0,200,40);


		//abstract methods here
		//different from the ts versions

		public UmlElement(){

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

	}
}