import {v4 as Uuid} from 'uuid';
import { ChangeRecord } from './ChangeRecord';
import { GeneralCollection, RelationalCollection } from './Collection';
import { ICollection, Dimension, IUser, NullUser, Relationship, Interface, Class, AbstractClass, User} from './DiagramModel';

export const TYPE ='$type';
export  abstract class UmlElement
{
	public id: string;
	public editor: IUser;
	public dimension: Dimension;
	public isStatic: boolean = false;

	abstract get(id: string);
	abstract insert(element);
	abstract remove(id: string);
	abstract change(change: ChangeRecord);
	abstract label(description: string)
	abstract toUmlNotation(): string;

	public constructor(type: string)
	{
		this.id = Uuid();
		this.editor = new NullUser();
		this.dimension = new Dimension(0, 0, 200,  40);
		this[TYPE] = `CoUML_app.Models.${type}`;
	}

	public lock(editor: IUser){
		this.editor = editor;
	}

	public release(editor: IUser){
		this.editor = editor;
	}


	public shift(point)
	{
		this.dimension.shift(point);
	}

	public style(color)
	{
		this.dimension.style(color);
	}

	public path(path: mxPoint[])
	{
		this.dimension.path(path);
	}
}

export class Diagram extends UmlElement
{
	change(change: ChangeRecord) {
		throw new Error('Method not implemented.');
	}
	shift(point: any) {
		throw new Error('shift Method not implemented.');
	}
	lock(editor: User) {
		throw new Error(' lock Method not implemented.');
	}
	release() {
		throw new Error('release Method not implemented.');
	}
	insert(element: any) {
		this.elements.insert(element);
	}
	remove(id: string) {
		this.elements.remove(id);
	}
	label(description: string)
	{
		throw new Error('label Method not implemented.');
	}

	public elements: ICollection<UmlElement>;


	public constructor(Did:string)
	{
		super('Diagram')
		this.id = Did;
		this.elements = new RelationalCollection<UmlElement>([])
	}
	get(id: string): UmlElement
	{	
		return this.id == id? this : this.elements.get(id);
	}

	at(ids: string []): UmlElement
	{

		let element: UmlElement  = this;
		for( let id of ids)
			element = element.get(id);
		
		console.log(`returning serilized element at ${ids}\nfound: ${element?.id}`);
		return element;
	}

	toUmlNotation(): string {
		return this.id;
	}

}
