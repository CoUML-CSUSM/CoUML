using CoUML_app.Models.User;
using CoUML_app.Models.Collection;


namespace CoUML_app.Models.Diagram
{

	public class Diagram
	{
		public ICollection<DiagramElement> elements { get; set; }= new RelationalCollection();
	}

	public abstract class DiagramElement
	{
		public IUser user { get; set; } = new NullUser();
	}
}