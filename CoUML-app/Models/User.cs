namespace CoUML_app.Models
{
	public interface IUser{
		public string id{get;}
	}

	public class User: IUser
	{
		private string _id;

		public User(string id)
		{
			this._id = id;
		}

		public string id{
			get
			{
				return this._id;
			}
		}


	public override string ToString(){
		return this._id;
	}
}

	public class NullUser: IUser
	{
		public string id
		{
			get
			{
				return "N/A";
			}
		}
	}
}
