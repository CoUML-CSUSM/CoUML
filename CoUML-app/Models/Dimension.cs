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
		public void Path(Point[] path);
	}
	public class Dimension: IDimension
	{
		public Dimension( 
			int? x = null, 
			int? y = null, 
			int? w = null,  
			int? h = null, 
			Point[]? path = null)
		{
			this.x = x;
			this.y = y;
			this.width = w;
			this.height = h;
			edgePath = path;
		}
		public int? x { get; set; }
		public int? y { get; set; }
		public int? width { get; set; }
		public int? height { get; set; }
		public string? fillColor { get; set; }
		public Point[]? edgePath { get; set; }

		public void Shift(Point point)
		{
			x = point.x;
			y = point.y;
		}

		public void Style(string color)
		{
			fillColor = color;
		}

		public void Path(Point[] path)
		{
			edgePath = path;
		}
	}

	public struct Point
	{
		public int x { get;set; }
		public int y { get;set; }
	}
}