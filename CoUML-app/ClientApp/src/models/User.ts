export interface IUser
{
	readonly id: string;
}
export class User implements IUser {
	readonly id: string;
	constructor(id: string)
	{
		this.id = id
		this["$type"] = "CoUML_app.Models.User, CoUML-app"
	}
}
export class NullUser implements IUser {
	readonly id: string = "N/A";
	["$type"] = "CoUML_app.Models.NullUser, CoUML-app"
}