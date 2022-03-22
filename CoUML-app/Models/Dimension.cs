namespace CoUML_app.Models
{
	public interface IDimension
	{
		public int? x { get; set; }
		public int? y { get; set; }
		public int? width { get; set; }
		public int? height { get; set; }
	}
	public class Dimension: IDimension
	{
		public Dimension( int? x = null, int? y = null, int? w = null,  int? h = null)
		{
			this.x = x;
			this.y = y;
			this.width = w;
			this.height = h;
		}
		public int? x { get; set; }
		public int? y { get; set; }
		public int? width { get; set; }
		public int? height { get; set; }
	}

}