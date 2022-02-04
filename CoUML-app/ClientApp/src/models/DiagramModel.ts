import { GeneralCollection, ICollection } from './Collection';
import { Interface, Enumeration, AbstractClass, Class } from './Component';
import { Diagram, DiagramElement } from './Diagram';
import { Dimension } from './Dimension';
import { Relationship, Operation, Attribute } from './Subcomponent';
import { User, IUser, NullUser } from './User';
import {DataType} from'./Types';

export * from './Collection';
export * from './Diagram';
export * from './Component';
export * from './Subcomponent';
export * from './Types';
export * from './User';
export * from './Dimension';
export * from './ChangeRecord'

export class DiagramBuilder
{
	buildDiagram(diagram_DTO: string): Diagram
	{
		let d = JSON.parse(diagram_DTO);

		let __diagram = new Diagram();
		for(let elem of d["elements"]["items"])
		{
			let element;
			switch(this.getType(elem)){
				case "Interface":
					element = this.buildInterface(elem);
					break;
				case "Relationship":
					element = this.buildRelationship(elem);
					break;
				case "Class":
					element = this.buildClass(elem);
					break;
				case "AbstractClass":
					element = this.buildAbstractClass(elem);
					break;
				case "Enumeration":
					element = this.buildEnumeration(elem);
					break;
				default:
					break;
			}
			__diagram.elements.insert(element);
		}
		return __diagram;
	}

	buildRelationship(x: Relationship): DiagramElement {
		let __relationship = new Relationship();
		__relationship.id = x.id;
		__relationship.editor = this.buildUser(x["editor"]);
		__relationship.dimension = this.buildDimension(x["dimension"]);
		__relationship.from = x.from;
		__relationship.to = x.to;
		this.buildAttributeCollection(__relationship.attributes, x.attributes)
		return __relationship;
	}
	
	buildClass(x: Class): DiagramElement {
		let __class = new Class(x.name);
		__class.id = x.id;
		__class.editor = this.buildUser(x.editor);
		__class.dimension = this.buildDimension(x.dimension);
		this.buildAttributeCollection(__class.attributes, x.attributes);
		this.buildOperationsCollection(__class.operations, x.operations);
		this.buildStringCollection( __class.relations, x.relations);
		return __class;
	}
	buildAbstractClass(x: AbstractClass): DiagramElement {
		let __abstract = new AbstractClass(x.name);
		__abstract.id = x.id;
		__abstract.editor = this.buildUser(x.editor);
		__abstract.dimension = this.buildDimension(x.dimension);
		this.buildAttributeCollection(__abstract.attributes, x.attributes);
		this.buildOperationsCollection(__abstract.operations, x.operations);
		this.buildStringCollection(__abstract.relations, x.relations);
		return __abstract;
	}
	buildEnumeration(x: Enumeration): DiagramElement {
		return new Enumeration(x.name);
	}

	buildInterface(x: Interface): DiagramElement
	{
		let __interface: Interface = new Interface(x.name);
		__interface.id = x.id;
		__interface.editor = this.buildUser(x["editor"]);
		__interface.dimension = this.buildDimension(x["dimension"]);
		this.buildOperationsCollection(__interface.operations, x["operations"]);
		this.buildStringCollection(__interface.relations, x["relations"]);
		return __interface;
	}


	buildStringCollection(coll, x)
	{
		for(let str of x.items)
			coll.insert(str)
	}


	buildOperationsCollection(coll, x)
	{
		for(let op of x.items)
			coll.insert(this.buildOperation(op));
	}

	buildOperation(x: any): Operation {
		let __operation = new Operation();
		__operation.id = x.id;
		__operation.visibility = x.visibility;
		__operation.name = x.name;
		__operation.isStatic = x.isStatic;
		__operation.propertyString = x.propertyString;
		__operation.type = new DataType(x.type);
		this.buildAttributeCollection(__operation.parameters, x.parameters);
		return __operation;
	}

	buildAttributeCollection(coll: ICollection<Attribute>, x)
	{
		for(let at of x.items)
			coll.insert(this.buildAttribute(at));
	}

	buildAttribute(x: any): any {
		let __attribute = new Attribute()
		__attribute.id = x.id;
		__attribute.visibility = x.visibility;
		__attribute.name = x.name;
		__attribute.isStatic = x.isStatic;
		__attribute.propertyString = x.propertyString;
		__attribute.type =  new DataType(x.type);
		__attribute.multiplicity = x.multiplicity;
		__attribute.defaultValue = x.defaultValue;
		return __attribute;
	}

	buildUser(x): IUser {
		return this.getType(x) == "User" ? new User(x.id): new NullUser();
	}

	buildDimension(x: Dimension): Dimension
	{
		return new Dimension(
			x.x,
			x.y,
			x.width,
			x.height
		);
	}


	/**
	 * takes a JSON string {  "$type": "CoUML_app.Models.Interface, CoUML-app", ...}
	 * returns "Interface"
	 * @param element 
	 * @returns 
	 */
	getType(element)
	{
		console.log(element["$type"]);
		let regex = /(\w*?),*?(?=,)/g;
		let type = regex.exec(element["$type"])[0];
		return type;
	}
} 
