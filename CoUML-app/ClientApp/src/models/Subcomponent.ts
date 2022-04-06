import { ChangeRecord, PropertyType } from "./ChangeRecord";
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

const VALID_ATTIBUTE = /([\+\-\#\~])*\s*(\w+)\s*(?:\:\s*(\w+))*\s*(?:\[([\*0-9]+(?:\.\.)*[\*0-9]*)\])*\s*(?:\=\s*(\"*\w+\"*))*\s*(\{.*\})*/i
/**
 * "- _myPrivateAtt: Object"
 * 1: Visisbility
 * 2: Name
 * 3: Type
 * 4: Multiplicity (lower..higher)
 * 5: Defualt Value
 * 6: Property Sting
 */

const VALID_OPERATION = /([\+\-\#\~])*\s*(\w+)\s*(?:\(\s*(.*)\))*\s*(?:\:\s*(\w*))*\s*(\{.*\})*/i
/**
 * 1: Visisbility
 * 2: Name
 * 3: Parameters
 * 4: ReturnType
 * 5: Property Sting
 */

const VALID_MULTIPLICITY = /(?:([0-9\2]+)*(?:\.\.))*([\*0-9]+)/i
/**
 *	*		["*",		null,	-1	]
 *	1		["1", 		null,	1	]
 *	15		["15", 		null,	15	]
 *	1..2	["1..2",	1,	 	2	]
 *	12..134	["12..134",	12,		134	]
 *	1..*	["1..*",	1		-1	]
 *	1..3	["1..3",	1,		3	]
 */

const DEFUALT_DATATYPE_OPPERATION = "void";
const DEFUALT_DATATYPE_ATTRIBUTE = "any";
export class Relationship extends UmlElement
{
	public type: RelationshipType;
	public source: string | null;
	public target: string | null;
	public attributes: Attribute | null;

	get attSet(){return this.attributes != null}

	public constructor()
	{
		super("Relationship");
	}

	sourceCompnent( component: Component){
		this.source = component.id
	}
	targetComponent( component: Component){
		this.target = component?.id
	}


	get(id: string) 
	{
		return this.attributes.get(id);
	}
	insert(element: any) 
	{
		throw new Error("Method not implemented.");
	}
	remove(id: string) 
	{
		throw new Error("Method not implemented.");
	}

	toUmlNotation(): string 
	{
		return this.attributes? `${this.attributes?.visibility} ${this.attributes?.name}`: "";
	}

	change(change: ChangeRecord) {
		console.log(`
		Relation.change(changeRecord)
		${change.toString()}
		`);

		switch(change.affectedProperty)
		{
			case PropertyType.Attributes:
				this.attributes = change.value;
				break;
			case PropertyType.Target:
				this.target = change.value;
				break;
			case PropertyType.Source:
				this.source = change.value;
				break;
			case PropertyType.Dimension:
				this.dimension = change.value;
				break;
			case PropertyType.Type:
				this.type = change.value;
				break;
		}
	}

	public label(description: string)
	{
		if( this.type == RelationshipType.Association && description != "")
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
	public abstract name: string;
	public visibility: VisibilityType.VisibilityType = VisibilityType.VisibilityType.LocalScope;
	public isStatic: boolean = false;
	public propertyString: string = ""; 
	public abstract type: DataType;
	constructor(type)
	{
		super(type);
		// this["_$type"] = `CoUML_app.Model.${type}, CoUML-app`;
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
	change(change: ChangeRecord) {
		throw new Error("Method not implemented.");
	}
	public multiplicity: Multiplicity = new Multiplicity();
	public name: string = "attribute"
	public type: DataType = new DataType(DEFUALT_DATATYPE_ATTRIBUTE);
	
	defaultValue: string; 
	
	constructor(){
		super("Attribute");
	}

	toUmlNotation(): string
	{
		return `${this.visibility} ${this.name}${this.type.toUmlNotation()}`+
		(this.multiplicity.isSingle() ? "": `[${this.multiplicity.toUmlNotation()}]` )+
		` ${this.defaultValue? " = "+this.defaultValue: ""}${this.propertyString}`;
	}

	get(id: string)
	{
		return this.id == id? this: null;
	}
	insert(element: any) {
		throw new Error("Method not implemented.");
	}
	remove(id: string) {
		throw new Error("Method not implemented.");
	}


	/**
	 * ~ _secretItem: Object[5..10] = null { uniqe, ordered}
	 * + something: boolean
	 * @param description Inline attibute format
	 */
	public label(description: string)
	{
		/**
		 * "- _myPrivateAtt: Object"
		 * 1: Visisbility
		 * 2: Name
		 * 3: Type
		 * 4: Multiplicity (lower..higher)
		 * 5: Defualt Value
		 * 6: Property Sting
		 */
		let tokenDescription  = description.match(VALID_ATTIBUTE);
		if(tokenDescription)
		{
			this.visibility = VisibilityType.get(tokenDescription[1]) || VisibilityType.VisibilityType.LocalScope;
			this.name = tokenDescription[2] || "attribute";
			this.type = new DataType(tokenDescription[3] || DEFUALT_DATATYPE_ATTRIBUTE);
			this.multiplicity =  new Multiplicity(tokenDescription[4]);
			this.defaultValue = tokenDescription[5] || "";
			this.propertyString = tokenDescription[6] || "";
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
	change(change: ChangeRecord) {
		throw new Error("Method not implemented.");
	}

	public parameters: ICollection<Attribute>;
	public name: string = "operation"
	public type: DataType = new DataType(DEFUALT_DATATYPE_OPPERATION);

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
		/**
		 * 1: Visisbility
		 * 2: Name
		 * 3: Parameters
		 * 4: ReturnType
		 * 5: Property Sting
		 **/
		if(tokenDescription)
		{
			this.visibility = VisibilityType.get(tokenDescription[1]) || VisibilityType.VisibilityType.LocalScope;
			this.name = tokenDescription[2] || "operation";
			this.parameterize(tokenDescription[3]);
			this.type = new DataType(tokenDescription[4] || DEFUALT_DATATYPE_OPPERATION);
			this.propertyString = tokenDescription[5] || "";
		}


		console.log(`Operation.label = ${tokenDescription}`);
		console.log(this);
	}

	insert(element: any) {
		throw new Error("Method not implemented.");
	}
	remove(id: string) {
		throw new Error("Method not implemented.");
	}

	parameterize(params: string): void
	{
		this.parameters.removeAll();
		if(params)
		for(let attibuteDescription of params.split(', '))
		{
			if(attibuteDescription != ""){
				let a = new Attribute();
				a.label(attibuteDescription);
				this.parameters.insert(a);
			}
		}
	}
}

export class Enumeral extends UmlElement
{
	change(change: ChangeRecord) {
		throw new Error("Method not implemented.");
	}
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
 *  1           {   1, 1  }  exact values: the inital value is min and max is null
 *  5           {   5, 5  }
 *  0..5        {   0,  5    }  range values: min and max respective 
 *  2..*        {   2,  -1   }  infinite (*): ang value less than 0
 * 
 */
export class Multiplicity
{
	public min: number = null;
	public max: number = null;

	public constructor( description: string = "1")
	{
		this["_$type"] = `CoUML_app.Model.${Multiplicity}, CoUML_app`;
		let tokenDescription  = description.match(VALID_MULTIPLICITY);
		if(tokenDescription)
		{
			this.max = tokenDescription[2] == "*" ? -1: parseInt(tokenDescription[2])
			this.min = tokenDescription[1]? parseInt(tokenDescription[1]):this.max;
		}
	}

	public toUmlNotation(): string
	{
		// if(this.isSingle)
		// 	return "";
		return `${this.min != this.max ? this.min+"..": ""}${this.max == -1? "*":this.max}`;
	}

	isSingle():boolean
	{
		return this.min == 1 && this.max == 1;
	}
}

