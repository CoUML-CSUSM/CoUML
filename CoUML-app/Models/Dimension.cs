namespace CoUML_app.Models
{
	public interface IDimension
	{
		public int X { get; set; }
		public int Y { get; set; }
		public int Width { get; set; }
		public int Height { get; set; }
	}
	public class Dimension: IDimension
	{
		public Dimension( int x = 100, int y = 100, int h = 60, int w = 40)
		{
			this.X = x;
			this.Y = y;
			this.Height = h;
			this.Width = w;
		}
		public int X { get; set; }
		public int Y { get; set; }
		public int Width { get; set; }
		public int Height { get; set; }
	}

}