import {v4 as Uuid} from 'uuid';
import { GeneralCollection, RelationalCollection } from './Collection';
import { ICollection, Dimension, IUser, NullUser, Relationship, Interface, Class, AbstractClass, User,  } from './DiagramModel';

export  abstract class SerializedElement
{
	public id: string;
	abstract get(id: string)
	constructor ()
	{
		this.id = Uuid();
	}

}

export class Diagram extends SerializedElement
{

	public elements: ICollection<SerializedElement>;

	public constructor(Did:string)
	{
		super()
		this.id = Did;
		this.elements = new RelationalCollection([])
	}
	get(id: string)
	{	
		
		return this.id == id? this : this.elements.get(id);
	}

	at(ids: string []): SerializedElement
	{
		let comp: SerializedElement  = this;
		for( let id of ids)
			comp = comp.get(id);
		return comp;
	}

}

export abstract class DiagramElement extends SerializedElement
{

	public editor: IUser;	
	public dimension: Dimension;

	public constructor(type: string)
	{
		super();
		this.editor = new NullUser();
		this.dimension = new Dimension(0, 0, 200,  40);
		this["$type"] = `CoUML_app.Model.${type}, CoUML_app`;
	}

}
// [did, eleid, propid]