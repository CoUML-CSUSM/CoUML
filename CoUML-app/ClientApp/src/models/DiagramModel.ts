import { GeneralCollection, ICollection } from './Collection';
import { Interface, Enumeration, AbstractClass, Class } from './Component';
import { Diagram, DiagramElement } from './Diagram';
import { Dimension } from './Dimension';
import { Relationship, Operation, Attribute } from './Subcomponent';
import { User, IUser, NullUser } from './User';

export * from './Collection';
export * from './Diagram';
export * from './Component';
export * from './Subcomponent';
export * from './Types';
export * from './User';
export * from './Dimension';


export class DiagramBuilder
{
	buildDiagram(diagram_DTO: string): Diagram
	{
		let d = JSON.parse(diagram_DTO);

		let __diagram = new Diagram();
		// console.log("d.elements.items[0]\n" + JSON.stringify(d.elements.items[0], undefined, 2));
		for(let i = 0; i<d.elements.size; i++)
		{

			console.log("processing element");
			console.log(d.elements.items[i]);

			__diagram.elements.insert(d.elements.items[i]);
			// let e = JSON.parse(d.elements.items[i]);

			// console.log(`parsed elem...`);

			// let diagramElementType = this.getType(e);
			// if(diagramElementType)
			// {
			// 	//is a compnent or sub component
			// 	let element: DiagramElement;
			// 	switch(diagramElementType)
			// 	{
			// 		case Interface.name:
			// 			element = this.buildInterface(e as Interface);
			// 			break;
			// 		case Enumeration.name:
			// 			element  = this.buildEnumeration(e as Enumeration);
			// 			break;
			// 		case AbstractClass.name:
			// 			element = this.buildAbstractClass(e as AbstractClass);
			// 			break;
			// 		case Class.name:
			// 			element = this.buildClass(e as Class);
			// 			break;
			// 		case Relationship.name:
			// 			element = this.buildRelationship(e as Relationship);
			// 			break;
			// 	}
			// 	__diagram.elements.insert(element);
			// }

		}
		console.log("Final Diagram");
		console.log(__diagram);
		return __diagram;
	}
	
	buildRelationship(x: Relationship): DiagramElement {
		let __relationship = new Relationship();
		__relationship.id = x.id;
		__relationship.editor = this.buildUser(x.editor);
		__relationship.dimension = this.buildDimension(x.dimension);
		__relationship.from = x.from;
		__relationship.to = x.to;
		__relationship.atributes = this.buildAttributeCollection(x.atributes as GeneralCollection<Attribute>)
		return __relationship;
	}
	
	buildClass(x: Class): DiagramElement {
		let __class = new Class(x.name);
		__class.id = x.id;
		__class.editor = this.buildUser(x.editor);
		__class.dimension = this.buildDimension(x.dimension);
		__class.attributes = this.buildAttributeCollection( x.attributes as GeneralCollection<Attribute>);
		__class.operations = this.buildOperationsCollection( x.operations as GeneralCollection<Operation>);
		__class.relations = this.buildRelationshipCollection( x.relations as GeneralCollection<string>);
		return __class;
	}
	buildAbstractClass(x: AbstractClass): DiagramElement {
		let __abstract = new AbstractClass(x.name);
		__abstract.id = x.id;
		__abstract.editor = this.buildUser(x.editor);
		__abstract.dimension = this.buildDimension(x.dimension);
		__abstract.attributes = this.buildAttributeCollection( x.attributes as GeneralCollection<Attribute>);
		__abstract.operations = this.buildOperationsCollection( x.operations as GeneralCollection<Operation>);
		__abstract.relations = this.buildRelationshipCollection( x.relations as GeneralCollection<string>);
		return __abstract;
	}
	buildEnumeration(x: Enumeration): DiagramElement {
		return new Enumeration(x.name);
	}

	buildInterface(x: Interface): DiagramElement
	{
		let __interface: Interface = new Interface(x.name);
		__interface.id = x.id;
		__interface.editor = this.buildUser(x.editor);
		__interface.dimension = this.buildDimension(x.dimension);
		__interface.operations = this.buildOperationsCollection(x.operations as GeneralCollection<Operation>);
		__interface.relations = this.buildRelationshipCollection(x.relations as GeneralCollection<string>);
		return __interface;
	}


	buildRelationshipCollection(x: GeneralCollection<string>): ICollection<string> {
		return new GeneralCollection<string>(x.items);
	}


	buildOperationsCollection(x: GeneralCollection<Operation>): ICollection<Operation> {
		return new GeneralCollection<Operation>(x.items);
	}

	buildAttributeCollection(x: GeneralCollection<Attribute>): ICollection<Attribute> {
		return new GeneralCollection<Attribute>(x.items);
	}

	buildUser(x: User): IUser {
			return this.getType(x)[0] == User.name ? new User(x.id): new NullUser();
	}

	buildDimension(x: Dimension): Dimension
	{
		return {
			x: x.x,
			y: x.y,
			width: x.width,
			height: x.height
		}
	}

	getType(e)
	{
		console.log(`get type`);
		console.log(JSON.stringify(e, undefined, 2));
		let rx = /\w+\.\w+\.(\w+)/g;
		return rx.exec(e.$type)[0];
	}
} 
