import { Class, Component, Interface } from "./Component";
import { DiagramElement, IGettable } from "./Diagram";

//interface for collections to create iterators
export interface ICollectionIterator<T>
{
	hasNext():boolean;
	getNext():T;
	hasPrevious():boolean;
	getPrevious():T;
}

export interface ICollection<T> extends IGettable
{
	iterator(): ICollectionIterator<T>;
	insert(item: T): void;
	remove(id: any): T | null;
	get(id: string): T | null;
	size: number;
}

export class GeneralCollection<T> implements ICollection<T>{

	items: T[] = [];

	/**
	 * contstuctor with array of item type
	 * @param collection 
	 */
	constructor(items: T[])
	{
		this.items = items;
	}

	/**
	 * Creates a collection iterator
	 * @returns CollectionIterator
	 */
	iterator(): ICollectionIterator<T>
	{
		return new CollectionIterator<T>(this);
	}

	/**
	 * isnsert an item into a collection
	 * @param item 
	 */
	insert(item: T): void {
		console.log("inserting....");
		console.log(item);
		 this.items.push(item);
	}

	/**
	 * removes item from collection
	 * @param id index of item
	 * @returns item removed
	 */
	remove(id: any): T | null
	{
		console.log(`!!!!!!!removing \n${id} \nfrom \n[${this.items.toString()}]`)
		let item: T = null;
		if(typeof(id) == 'number' && this.validIndex(id))
		{
			item = this.items[id];
			this.items = this.items.splice(id);
		}
		else
		{
			console.log("id is string");
			// let i = this.items.indexOf(id as unknown as T);
			// this.items = this.items.splice(i);
			this.items = this.items.filter(item => (item as unknown as string) !== id);
		}
		return item;
	}

	/**
	 * size of collection
	 */
	get size(): number
	{
		return this.items?.length || -1;
	}

	/**
	 * determines if the index is in the collection
	 * @param i index 
	 * @returns tue if valid index
	 */
	validIndex(i: number): boolean
	{
		try{
			return i >= 0 && i < this.size; 
		}catch(error){
			return false;
		}
	}


	// this breaks if it's not a more complex item!!!
	get(id: string): null | T
	{
		for(let de of this.items as unknown[] as DiagramElement[])
			if(id == de?.id)
					return de as unknown as T;
		return null;
	}
}

// /**
//  * RelationshipCollection
//  */
// export class RelationalCollection implements ICollection<DiagramElement>{
	
// 	private items: Map<string, DiagramElement> = new Map<string, DiagramElement>();
// 	toJSON(): any {
// 		return {
// 			items: Object.fromEntries(this.items),
// 		}
// 	 }

// 	constructor(collection: DiagramElement[])
// 	{
// 		for(let elem of collection)
// 			this.insert(elem)
// 	}

// 	iterator(): ICollectionIterator<DiagramElement> 
// 	{
// 		return new CollectionIterator<DiagramElement>(
// 				new GeneralCollection<DiagramElement>(
// 					Array.from(this.items.values())
// 				)
// 			);
// 	}

// 	insert(item: DiagramElement): void {
// 		console.log("inserting....");
// 		console.log(item);
// 		this.items.set(item.id, item);
// 	}

// 	remove(signature: string): DiagramElement | null 
// 	{
// 		let relation = null
// 		if(this.items.has(signature))
// 		{
// 			relation = this.items.get(signature);
// 			this.items.delete(relation);
// 		}
// 		return relation;
// 	}
	
// 	get(key: string): null | DiagramElement
// 	{
// 		if(this.items.has(key))
// 			return this.items.get(key);
// 		return this.find(key);
// 	}

// 	private find(key: string): null | DiagramElement
// 	{
// 		for(let e of this.items.values())
// 		{
// 			if(!(e instanceof RelationalCollection)){
// 				let de = e as Component;
// 				if(key === de.name)
// 					return de;
// 			}
// 		}
// 		return null;
// 	}

// 	get size(): number 
// 	{
// 		return this.items.size
// 	}

// }

/**
 * AttributeCollectionIterator
 * fetches objects from collection
 */
 export class CollectionIterator<T> implements ICollectionIterator<T>{
	_collection: GeneralCollection<T>;
	_position: number = 0;

	constructor( collection: GeneralCollection<T> )
	{
		this._collection = collection;
	}

	hasNext():boolean{
		return  this._position < this._collection.size;
	}
	getNext():T{
		if(this.hasNext){
			return this._collection.items[this._position++];
		}
	}
	hasPrevious():boolean{
		return this._position > 0;
	}
	getPrevious():T{
		if(this.hasPrevious){
			return this._collection.items[this._position--];
		}
	}
}
