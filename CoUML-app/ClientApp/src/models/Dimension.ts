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
}
export class NullDimension implements IDimension {
	x: number = 100;
	y: number = 100;
	width: number = 60;
	height: number = 40;

}