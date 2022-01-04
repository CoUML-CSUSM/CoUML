using  System;
using CoUML_app.Models;


namespace CoUML_app.Models
{

	public class Diagram
	{
		public ICollection<DiagramElement> Elements {get;} = new RelationalCollection();
	}

	public abstract class DiagramElement
	{
		public IUser User { get; set; } = new NullUser();
		public Guid Id { get; } = Guid.NewGuid();
		public IDimension Dimension { get; set; } = new Dimension();
	}
}