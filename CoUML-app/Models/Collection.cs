using System;
using System.Collections.Generic;

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
		public void RemoveAll();
		public int Size { get;}
		public T? this[string id]{get;}
		
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

		public T? this[string id]
		{
			get =>  items.Find(x => x.Equals(id));
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
		public virtual void Insert (T item)
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

		public void RemoveAll()
		{
			_items.Clear();
		}

		/// <summary>
		/// Size of the collecion
		/// </summary>
		/// <value>size</value>
		public int Size
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
			return i>=0 && i < Size;
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

		public T? this[string id]
		{
			get
			{  
				try{
					return _items[id];
				}catch(KeyNotFoundException){
					return null;
				}
			}
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
			if(index >= 0 && index < Size )
			{
				item = (new List<T>(this._items.Values)).ToArray()[index];
				this._items.Remove(((T)item).id);
			}
			return item;
		}

		public void RemoveAll()
		{
			_items.Clear();
		}

		public int Size
		{
			get
			{
				return this._items.Count;
			}
		}
	}

	public class UniquCollection<T>: GeneralCollection<T> where T: UmlElement
	{
		override
		public void Insert(T item)
		{
			if(!items.Contains(item))
				base.Insert(item);
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
			return _position < _collection.Size;
		}
		public T GetNext()
		{
			if(HasNext())
				return this._collection[_position++];
			throw new CollectionException($"(size, position) = ({this._collection.Size}, {this._position})");
		}
		public bool HasPrevious()
		{
			return _position > 0;
		}
		public T GetPrevious()
		{
			if( HasPrevious())
				return this._collection[_position--];
			throw new CollectionException($"(size, position) = ({this._collection.Size}, {this._position})");
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