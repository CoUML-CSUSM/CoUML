export interface IUser
{
	readonly id: string;
}
export class User implements IUser {
	readonly id: string;
	constructor(id: string)
	{
		this.id = id
	}
}
export class NullUser implements IUser {
	readonly id: string = "N/A"
}