namespace CoUML_app.Models
{
	public interface IUser{
		public string Id{get;}
	}

	public class User: IUser
	{
		private string _id;

		User(string id)
		{
			this._id = id;
		}

		public string Id{
			get
			{
				return this._id;
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
