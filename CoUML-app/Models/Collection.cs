using CoUML_app.Models.Diagram;

namespace CoUML_app.Models.Collection
{
	public interface ICollectionIterator<T>
	{
		public bool HasNext();
		public T GetNext();
		public bool HasPrevious();
		public T GetPervious();
		
	}
}