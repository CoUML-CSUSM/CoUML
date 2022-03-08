import {v4 as Uuid} from 'uuid';
import { GeneralCollection, RelationalCollection } from './Collection';
import { ICollection, Dimension, IUser, NullUser, Relationship, Interface, Class, AbstractClass, User,  } from './DiagramModel';

export  abstract class SerializedElement
{
	public id: string;
	public editor: IUser;
	abstract get(id: string)
	constructor ()
	{
		this.id = Uuid();
		this.editor = new NullUser();
	}
	abstract toUmlNotation(): string;
	abstract label: string;

}

export class Diagram extends SerializedElement
{

	public elements: ICollection<DiagramElement>;
	label = "UML Diagram";


	public constructor(Did:string)
	{
		super()
		this.id = Did;
		this.elements = new RelationalCollection<DiagramElement>([])
	}
	get(id: string): SerializedElement
	{	
		return this.id == id? this : this.elements.get(id);
	}

	at(ids: string []): SerializedElement
	{

		let element: SerializedElement  = this;
		for( let id of ids)
			element = element.get(id);
		
		console.log(`returning serilized element at ${ids}\nfound: ${element?.id}`);
		return element;
	}

	toUmlNotation(): string {
		return this.label;
	}

}

export abstract class DiagramElement extends SerializedElement
{
	
	public dimension: Dimension;

	public constructor(type: string)
	{
		super();
		this.dimension = new Dimension(0, 0, 200,  40);
		this["$type"] = `CoUML_app.Model.${type}, CoUML_app`;
	}

}
// [did, eleid, propid]