import { RelationalCollection } from "./Collection";
import { GeneralCollection, ICollection, UmlElement, Component } from "./DiagramModel";
import { VisibilityType, DataType, RelationshipType} from "./Types";

/**
 * describ a relationship between a set of diagram elements
 * Examples: 
 * diagram
 *      [CompA] 1 --> [CompB]
 * implementation
 *      CompA{
 *          CompB classAttribute;
 *      }
 * 
 * diagram
 *      [Comp] - - |> [IComp]
 * implimentation
 *      Comp impliments IComp{}
 */

const VALID_ATTIBUTE = /([\+\-\#\~])*\s*(\w+)\s*\:*\s*(\w*)/i
/**
 * "- _myPrivateAtt: Object"
 * 1: "-" // if undefined then local
 * 2: "_myPrivateAtt"
 * 3: "Object"
 */

const VALID_OPERATION = /([\+\-\#\~])*\s*(\w+)\s*\(\s*((?:\w*\:*\s*\w*\,*\s*)*)\)\:\s*(\w*)/i
/**
 * "+ transpose(x: number, y: double): IShape"
 * 1: "+" // may be undefined, iff undefiend then local
 * 2: "transpose"
 * 3: "x: number, y: double"
 * 4: IShape
 */

export class Relationship extends UmlElement
{
	insert(element: any) {
		throw new Error("Method not implemented.");
	}
	remove(id: string) {
		throw new Error("Method not implemented.");
	}

	public type: RelationshipType;
	public source: string;
	public target: string;

	public attributes: Attribute;

	public constructor()
	{
		super("Relationship");
	}

	get(id: string) {
		return this.attributes.get(id);
	}

	sourceCompnent( component: Component){
		this.source = component.id
	}
	targetComponent( component: Component){
		this.target = component?.id
	}

	toUmlNotation(): string {
		return this.attributes?.name || "";
	}
	public label(description: string)
	{
		if( this.type == RelationshipType.Association)
		{	if(!this.attributes)
				this.attributes = new Attribute();
			this.attributes.label(description);
		}else
		{
			delete this.attributes;
		}
	}

}

export abstract class ComponentProperty extends UmlElement
{
	public name: string = "foo";
	public visibility: VisibilityType.VisibilityType = VisibilityType.VisibilityType.LocalScope;
	public isStatic: boolean = false;
	public propertyString: string = ""; 
	public type: DataType = new DataType("any");
	constructor(type)
	{
		super(type);
	}
}
/**
 * describs an attibute of a diagram element
 * diagram:
 *      [ - myAttribute: DataType = DefaultObject ]
 * implimentation: 
 *      private DataType myAttribute = new DefaultObject<DataType>();
 */
export class Attribute extends ComponentProperty
{
	insert(element: any) {
		throw new Error("Method not implemented.");
	}
	remove(id: string) {
		throw new Error("Method not implemented.");
	}

	multiplicity: Multiplicity; 
	
	defaultValue: string; 
	
	constructor(){
		super("Attribute");
	}

	toUmlNotation(): string
	{
		return `${this.visibility} ${this.name}: ${this.type.dataType}`;
	}

	get(id: string)
	{
		return this.id == id? this: null;
	}

	public label(description: string)
	{
		let tokenDescription  = description.match(VALID_ATTIBUTE);
		if(tokenDescription)
		{
			this.visibility = VisibilityType.get(tokenDescription[1]);
			this.name = tokenDescription[2];
			this.type = new DataType(tokenDescription[3]);
		}
		console.log(`Attribute.label = ${tokenDescription}`);
		console.log(this);
	}
}


/**
 * describs an operation from a diagram element
 * diagram:
 *      [ + foo(p: DataType, q: DataType): DataType ]
 * implimentation: 
 *      public DataType foo( DataType p, DataType q){}
 */
 export class Operation extends ComponentProperty
{
	insert(element: any) {
		throw new Error("Method not implemented.");
	}
	remove(id: string) {
		throw new Error("Method not implemented.");
	}

	public parameters: ICollection<Attribute>;

	constructor()
	{
		super("Operation");
		this.parameters = new RelationalCollection<Attribute> ([]);
	}

	get(id: string) {
		return this.parameters.get(id);
	}

	toUmlNotation(): string
	{
		return `${this.visibility} ${this.name}(${this.parameters.toUmlNotation()}): ${this.type.dataType}`;
	}

	public label(description: string)
	{
		let tokenDescription  = description.match(VALID_OPERATION);
		if(tokenDescription)
		{
			this.visibility = VisibilityType.get(tokenDescription[1]);
			this.name = tokenDescription[2];
			this.parameterize(tokenDescription[3], this.parameters)
			this.type = new DataType(tokenDescription[4]);
		}


		console.log(`Operation.label = ${tokenDescription}`);
		console.log(this);
	}

	parameterize(params: string, collection: ICollection<Attribute>): void
	{
		collection.removeAll();
		for(let attibuteDescription of params.split(', '))
		{
			if(attibuteDescription != ""){
				let a = new Attribute();
				a.label(attibuteDescription);
				collection.insert(a);
			}
		}
	}
}

export class Enumeral extends UmlElement
{
	public name: string = "enumeral";

	get(id: string) {
		throw new Error("Method not implemented.");
	}
	insert(element: any) {
		throw new Error("Method not implemented.");
	}
	remove(id: string) {
		throw new Error("Method not implemented.");
	}
	label(description: string) {
		this.name = description;
	}
	toUmlNotation(): string {
		return this.name;
	}

	constructor()
	{
		super("Enumeral");
	}
}

/**
 * The multiplicity of an attribute
 * types of representation and values:
 *  diagram     implimentation
 *  1           {   1, null  }  exact values: the inital value is min and max is null
 *  5           {   5, null  }
 *  0..5        {   0,  5    }  range values: min and max respective 
 *  2..*        {   2,  -1   }  infinite (*): ang value less than 0
 * 
 */
export class Multiplicity
{
	public min: number = null;
	public max: number = null;
}

