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

	constructor (x: number = 100, y: number = 100, h: number = 60, w: number = 40)
	{
		this.x = x;
		this.y = y;
		this.height = h;
		this.width = w;
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