using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Converters;

namespace CoUML_app.Models
{
	public interface ICollectionIterator<T>
	{
		public bool HasNext();
		public T GetNext();
		public bool HasPrevious();
		public T GetPrevious();
		
	}

	public interface ICollection<T>
	{
		public ICollectionIterator<T> Iterator();
		public void Insert(T item);
		public T Remove(string key);
		public T Remove(int key);
		public int size { get;}
		public List<T> items{ get; }
		
	}
	public class GeneralCollection<T> : ICollection<T>
	{
		private List<T> _items;
		public List<T> items{
			get{
				return this._items;
			}
		}

		/// <summary>
		/// constructor
		/// </summary>
		/// <param name="items">an inital set of items</param>
		public GeneralCollection(T[] items)
		{
			this._items = new List<T>(items);
		}

		/// <summary>
		/// constructor - empty consructor
		/// </summary>
		public GeneralCollection()
		{
			this._items = new List<T>();
		}

		/// <summary>
		/// creates a collection itterator
		/// </summary>
		/// <returns>ICollectionIterator</returns>
		public ICollectionIterator<T> Iterator()
		{
			return new CollectionIterator<T>(this);
		}

		/// <summary>
		/// isnsert an item into a collection
		/// </summary>
		/// <param name="item"></param>
		public void Insert (T item)
		{
			this._items.Add(item);
		}

		/// <summary>
		/// removes item from collection
		/// </summary>
		/// <param name="itemAtIndex">index of item</param>
		/// <returns>item removed</returns>
		public T Remove(int itemAtIndex)
		{
			T item = default(T);
			if(ValidIndex(itemAtIndex))
			{
				item = this._items[itemAtIndex];
				this._items.RemoveAt(itemAtIndex);
			}
			return item;
		}

		/// <summary>
		/// removes item from collection
		/// </summary>
		/// <param name="itemAtIndex">index of item</param>
		/// <returns>item removed</returns>
		public T Remove(string itemAtIndex)
		{
			try
			{
				int i = Int32.Parse(itemAtIndex);
				return Remove(i);
			}
			catch (FormatException e)
			{
				Console.WriteLine(e.Message);
			}
			return default(T);
		}

		/// <summary>
		/// Size of the collecion
		/// </summary>
		/// <value>size</value>
		public int size
		{
			get
			{
				return this._items.Count;
			}
			
		}

		/// <summary>
		/// determins if the index number entered is in the collection
		/// </summary>
		/// <param name="i"> index </param>
		/// <returns>true if valid</returns>
		private bool ValidIndex(int i)
		{
			return i>=0 && i < size;
		}

		public T this[int i]
		{
			get {
				return this._items[i];
			}
		}
	}

	public class RelationalCollection: ICollection<DiagramElement>
	{
		private Dictionary<Guid, DiagramElement> _items;
		public List<DiagramElement> items{
			get{
				return new List<DiagramElement>(this._items.Values);
			}
		}

		/// <summary>
		/// constructor
		/// </summary>
		/// <param name="collection"> set of diagram Elements</param>
		public RelationalCollection( DiagramElement[] collection)
		{
			this._items = new Dictionary<Guid, DiagramElement>();
			foreach (DiagramElement item in collection)
			{
				this._items.Add(item.id, item);
			}
		}

		/// <summary>
		/// constructor - empty
		/// </summary>
		public RelationalCollection()
		{
			this._items = new Dictionary<Guid, DiagramElement>();
		}

		public ICollectionIterator<DiagramElement> Iterator()
		{
			return new CollectionIterator<DiagramElement>(
				new GeneralCollection<DiagramElement>(
					(new List<DiagramElement>(this._items.Values)).ToArray()
				)
			);
		}
		
		public void Insert( DiagramElement item)
		{
			this._items.Add( item.id, item);
		}

		public DiagramElement Remove(string id)
		{
			DiagramElement item = default(DiagramElement);
			Guid guid = new Guid(id);
			if(this._items.TryGetValue(guid, out item))
				this._items.Remove(guid);
			return item;
		}

		public DiagramElement Remove(int index)
		{
			DiagramElement item = default(DiagramElement);
			if(index >= 0 && index < size )
			{
				item = (new List<DiagramElement>(this._items.Values)).ToArray()[index];
				this._items.Remove(((DiagramElement)item).id);
			}
			return item;
		}


		public int size
		{
			get
			{
				return this._items.Count;
			}
		}

	}

	public class CollectionIterator<T>: ICollectionIterator<T>
	{
		private GeneralCollection<T> _collection;
		private int _position = 0;

		public CollectionIterator( GeneralCollection<T> collection)
		{
			this._collection = collection;
		}

		public bool HasNext()
		{
			return _position < _collection.size;
		}
		public T GetNext()
		{
			if(HasNext())
				return this._collection[_position++];
			throw new CollectionException("{size, position} = {" + this._collection.size + ", " + this._position + "}");
		}
		public bool HasPrevious()
		{
			return _position > 0;
		}
		public T GetPrevious()
		{
			if( HasPrevious())
				return this._collection[_position--];
			throw new CollectionException("{size, position} = {" + this._collection.size + ", " + this._position + "}");
		}
	}

	[Serializable]
	public class CollectionException: Exception
	{
		public CollectionException(string msg): base(msg){}
		protected CollectionException(System.Runtime.Serialization.SerializationInfo info,
        System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
	}
	
}