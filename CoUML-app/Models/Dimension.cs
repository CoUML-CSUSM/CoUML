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
		public Dimension( int x = 100, int y = 100, int w = 60,  int h = 40)
		{
			this.x = x;
			this.y = y;
			this.width = w;
			this.height = h;
		}
		public int x { get; set; }
		public int y { get; set; }
		public int width { get; set; }
		public int height { get; set; }
	}

}