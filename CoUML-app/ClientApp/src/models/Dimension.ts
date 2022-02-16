export interface IDimension
{
	x: number,
	y: number,
	width: number,
	height: number,
}
export class Dimension implements IDimension {
	x: number;
	y: number;
	width: number;
	height: number;

	constructor (x = null, y = null, w = null, h = null)
	{
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
	}

	shift(point)
	{
		this.x = point.x;
		this.y = point.y;
	}

	change(newDim: Dimension)
	{
		this.x = newDim.x | this.x;
		this.y = newDim.y | this.y;
		this.width = newDim.x | this.width;
		this.height = newDim.x | this.height;
	}
}