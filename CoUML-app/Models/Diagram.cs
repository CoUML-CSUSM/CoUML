using CoUML_app.Models;


namespace CoUML_app.Models
{

	public class Diagram
	{
		public ICollection<DiagramElement> elements { get; set; } = new RelationalCollection();
	}

	public abstract class DiagramElement
	{
		public IUser User { get; set; } = new NullUser();
		public string Id { get; }

		public IDimension Dimension { get; set; } = new Dimension();
	}
}