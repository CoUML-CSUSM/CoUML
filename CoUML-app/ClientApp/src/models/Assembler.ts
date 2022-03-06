import { SerializedElement } from "./Diagram";
import { DataType, Diagram, Relationship, RelationshipType, DiagramElement, Class, Dimension, Operation, Attribute, AbstractClass, Interface, Enumeration, ICollection, IUser, User, NullUser } from "./DiagramModel";

	export function assembleDiagram(diagram_DTO: string): Diagram
	{
		let d = JSON.parse(diagram_DTO);

		let __diagram = new Diagram(d.id);
		for(let [id, elem] of Object.entries(d["elements"]["items"]))
		{
			__diagram.elements.insert(assembleDiagramElement(elem));
		}
		return __diagram;
	}

	export function assembleDiagramElement(elem): DiagramElement
	{
		let element;
		switch(getType(elem)){
			case "Relationship":
				case Relationship.name:
				element = assembleRelationship(elem);
				break;
			case "Interface":
				case Interface.name:
				element = assembleInterface(elem);
				break;
			case "AbstractClass":
				case AbstractClass.name:
				element = assembleAbstractClass(elem);
				break;
			case "Class":
				element = assembleClass(elem);
				break;
			case "Enumeration":
				case Enumeration.name:
				element = assembleEnumeration(elem);
				break;
			case "Operation":
				case Operation.name:
				element = assembleOperation(elem);
				break;
			case "Attribute":
				case Attribute.name:
				element = assembleAttribute(elem);
				break;
			case "User":
				case User.name:
					element = assembleUser(elem)
				break;

			case "NullUser":
				case NullUser.name:
					element = new NullUser();
				break;
			default:
				console.log("Component is not an object");
				element = elem;
				break;
		}
		console.log("New Component created");
		console.log(element)
		
		return element;
	}

	function assembleRelationship(x: Relationship): DiagramElement {
		let __relationship = new Relationship();
		__relationship.id = x.id;
		__relationship.editor = assembleUser(x["editor"]);
		__relationship.dimension = assembleDimension(x["dimension"]);
		__relationship.source = x.source;
		__relationship.target = x.target;
		__relationship.type = x.type;
		assembleAttributeCollection(__relationship.attributes, x.attributes)
		return __relationship;
	}
	
	function assembleClass(x: Class): DiagramElement {
		let __class = new Class(x.name);
		__class.id = x.id;
		__class.editor = assembleUser(x.editor);
		__class.dimension = assembleDimension(x.dimension);
		assembleAttributeCollection(__class.attributes, x.attributes);
		assembleOperationsCollection(__class.operations, x.operations);
		// assembleStringCollection( __class.relations, x.relations);
		return __class;
	}
	function assembleAbstractClass(x: AbstractClass): DiagramElement {
		let __abstract = new AbstractClass(x.name);
		__abstract.id = x.id;
		__abstract.editor = assembleUser(x.editor);
		__abstract.dimension = assembleDimension(x.dimension);
		assembleAttributeCollection(__abstract.attributes, x.attributes);
		assembleOperationsCollection(__abstract.operations, x.operations);
		// assembleStringCollection(__abstract.relations, x.relations);
		return __abstract;
	}
	function assembleEnumeration(x: Enumeration): DiagramElement {
		let __enum = new Enumeration(x.name);
		__enum.id = x.id;
		__enum.editor = assembleUser(x.editor);
		__enum.dimension = assembleDimension(x.dimension);
		// __enum.enums = assembleStringCollection(e.enums);
		return __enum;
	}

	function assembleInterface(x: Interface): DiagramElement
	{
		let __interface: Interface = new Interface(x.name);
		__interface.id = x.id;
		__interface.editor = assembleUser(x["editor"]);
		__interface.dimension = assembleDimension(x["dimension"]);
		assembleOperationsCollection(__interface.operations, x["operations"]);
		// assembleStringCollection(__interface.relations, x["relations"]);
		return __interface;
	}


	function assembleStringCollection(coll, x)
	{
		for(let str of x.items)
			coll.insert(str)
	}


	function assembleOperationsCollection(coll, x)
	{
		for(let [id, op] of Object.entries(x.items))
			coll.insert(assembleOperation(op));
	}

	function assembleOperation(x: any): Operation {
		let __operation = new Operation();
		__operation.id = x.id;
		__operation.visibility = x.visibility;
		__operation.name = x.name;
		__operation.isStatic = x.isStatic;
		__operation.propertyString = x.propertyString;
		__operation.type = new DataType(x.type.dataType);
		assembleAttributeCollection(__operation.parameters, x.parameters);
		return __operation;
	}

	function assembleAttributeCollection(coll: ICollection<SerializedElement>, x)
	{
		for(let [id, at] of Object.entries(x.items))
			coll.insert(assembleAttribute(at));
	}

	function assembleAttribute(x: any): any {
		let __attribute = new Attribute()
		__attribute.id = x.id;
		__attribute.visibility = x.visibility;
		__attribute.name = x.name;
		__attribute.isStatic = x.isStatic;
		__attribute.propertyString = x.propertyString;
		__attribute.type =  new DataType(x.type.dataType);
		__attribute.multiplicity = x.multiplicity;
		__attribute.defaultValue = x.defaultValue;
		return __attribute;
	}

	function assembleUser(x): IUser {
		return getType(x) == "User" ? new User(x.id): new NullUser();
	}

	function assembleDimension(x: Dimension): Dimension
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
	function getType(element)
	{
		console.log("----- getType")
		console.log(element)
		try{
			console.log(element["$type"]);
			let regex = /(\w*?),*?(?=,)/g;
			let type = regex.exec(element["$type"])[0];
			console.log(`returning "${type}"-----`);
			return type;
		}catch(any){
			console.log("no $type");
			return null;
		}
	}
