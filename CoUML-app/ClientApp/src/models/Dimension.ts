import { TYPE } from "./Diagram";

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

	shift(point: Point)
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

export const DEFUALT_DIMENSION: IDimension = {x: 0, y: 0, width: 200, height: 20}

export class Point
{
	x: number;
	y: number;
	constructor(x: number, y: number)
	{
		this.x = x; 
		this.y = y;
		this[TYPE] = "CoUML_app.Models.Point";
	}
}