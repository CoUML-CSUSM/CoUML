namespace CoUML_app.Models
{
	public interface IUser{
		public string Id{get;}
	}

	public class User: IUser
	{
		private string _id;
		private string _diagramId = null;

		public User(string id)
		{
			this._id = id;
		}

		public string Id{
			get
			{
				return this._id;
			}
		}

		public string DiagramId{
			get
			{ 
				return this._diagramId;
			}
			set
			{ 
				this._diagramId = value;
			}
		}

	}

	public class NullUser: IUser
	{
		public string Id
		{
			get
			{
				return "N/A";
			}
		}
	}
}
