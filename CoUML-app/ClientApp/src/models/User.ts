import { TYPE } from "./DiagramModel";

export interface IUser
{
	readonly id: string;
}
export class User implements IUser {
	readonly id: string;
	constructor(id: string)
	{
		this.id = id
		this[TYPE] = "CoUML_app.Models.User"
	}
}
export class NullUser implements IUser {
	readonly id: string = "N/A";
	[TYPE] = "CoUML_app.Models.NullUser"
}