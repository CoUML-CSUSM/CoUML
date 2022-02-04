import { Type } from 'class-transformer';
import {v4 as Uuid} from 'uuid';
import { GeneralCollection } from './Collection';
import { ICollection, Dimension, IUser, NullUser, Relationship, Interface, Class, AbstractClass, User,  } from './DiagramModel';

export class Diagram
{
	public elements: ICollection<DiagramElement>;

	public constructor()
	{
		this.elements = new GeneralCollection<DiagramElement>([])
	}
}

export abstract class DiagramElement
{

	public editor: IUser;
	
	public id: string;
	
	public dimension: Dimension;

	public constructor()
	{
		this.editor = new NullUser();
		this.id = Uuid();
		this.dimension = new Dimension();
	}

}

export interface IGettable
{
	get(id: string);
}