namespace CoUML_app.Models
{
	public interface IDimension
	{
		public int x { get; set; }
		public int y { get; set; }
		public int width { get; set; }
		public int height { get; set; }
	}
	public class Dimension: IDimension
	{
		public Dimension( int x = 100, int y = 100, int h = 60, int w = 40)
		{
			this.x = x;
			this.y = y;
			this.height = h;
			this.width = w;
		}
		public int x { get; set; }
		public int y { get; set; }
		public int width { get; set; }
		public int height { get; set; }
	}

}