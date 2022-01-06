import { DataType } from 'automerge';
import {v4 as uuidv4} from 'uuid';
import { Interface, Enumeration, AbstractClass, Class, Component, Relationship, GeneralCollection, ICollection, RelationalCollection, Dimension, Operation, User, IUser, NullUser  } from './DiagramModel';
import { Attribute } from './Subcomponent';

export class Diagram
{
	public elements: ICollection<DiagramElement> = new RelationalCollection([]);
}
export abstract class DiagramElement{
	editor: IUser = new NullUser();
	id: string = uuidv4();
	dimension: Dimension = new Dimension();
}
