using  System;
using CoUML_app.Models;


namespace CoUML_app.Models
{

	public class Diagram
	{
		public string id;
		public ICollection<DiagramElement> elements {get;} = new RelationalCollection();
	}

	public abstract class DiagramElement
	{
		public IUser user { get; set; } = new NullUser();
		public Guid id { get; } = Guid.NewGuid();
		public IDimension dimension { get; set; } = new Dimension();
	}
}