namespace CoUML_app.Models
{
	public interface IDimension
	{
		public int? x { get; set; }
		public int? y { get; set; }
		public int? width { get; set; }
		public int? height { get; set; }
		public void Shift(Point point);
		public void Style(string color);
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
		public string? fillColor { get; set; }

		public void Shift(Point point)
		{
			x = point.X;
			y = point.Y;
		}

		public void Style(string color)
		{
			fillColor = color;
		}
	}

	public struct Point
	{
		public int X { get;set; }
		public int Y { get;set; }
	}
}