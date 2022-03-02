import {v4 as Uuid} from 'uuid';
import { GeneralCollection } from './Collection';
import { ICollection, Dimension, IUser, NullUser, Relationship, Interface, Class, AbstractClass, User,  } from './DiagramModel';

export class Diagram
{
	public id: string;

	public elements: ICollection<DiagramElement>;

	public constructor(Did:string)
	{
		this.id = Did;
		this.elements = new GeneralCollection<DiagramElement>([])
	}

}

export abstract class DiagramElement
{

	public editor: IUser;
	
	public id: string;
	
	public dimension: Dimension;

	public constructor(type: string)
	{
		this.editor = new NullUser();
		this.id = Uuid();
		this.dimension = new Dimension(0, 0, 200,  40);
		this["$type"] = `CoUML_app.Model.${type}, CoUML_app`;
	}

}

export interface IGettable
{
	get(id: string);
}