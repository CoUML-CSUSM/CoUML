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
		// public List<T> items{ get; }
		
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

	public class RelationalCollection<T> : ICollection<T> where T:UmlElement
	{
		private Dictionary<string, T> _items;
		// public List<UmlElement> items{
		// 	get{
		// 		return new List<UmlElement>(this._items.Values);
		// 	}
		// }

		public Dictionary<string, T> items{
			get{
				return _items;
			}
		}

		/// <summary>
		/// constructor
		/// </summary>
		/// <param name="collection"> set of diagram Elements</param>
		public RelationalCollection( T[] collection)
		{
			this._items = new Dictionary<string, T>();
			foreach (T item in collection)
			{
				this._items.Add(item.id, item);
			}
		}

		/// <summary>
		/// constructor - empty
		/// </summary>
		public RelationalCollection()
		{
			this._items = new Dictionary<string, T>();
		}

		public ICollectionIterator<T> Iterator()
		{
			return new CollectionIterator<T>(
				new GeneralCollection<T>(
					(new List<T>(this._items.Values)).ToArray()
				)
			);
		}
		
		public void Insert( T item)
		{
			this._items.Add( item.id, item);
		}

		public T Remove(string id)
		{
			T item = default(T);
			string guid = new Guid(id).ToString();
			if(this._items.TryGetValue(guid, out item))
				this._items.Remove(guid);
			return item;
		}

		public T Remove(int index)
		{
			T item = default(T);
			if(index >= 0 && index < size )
			{
				item = (new List<T>(this._items.Values)).ToArray()[index];
				this._items.Remove(((T)item).id);
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