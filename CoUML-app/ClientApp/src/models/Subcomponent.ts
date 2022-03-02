import { DiagramElement, GeneralCollection, ICollection, IGettable, Component } from "./DiagramModel";
import { VisibilityType, DataType, RelationshipType } from "./Types";

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
export class Relationship extends DiagramElement implements IGettable
{

	public type: RelationshipType;
	public source: string;
	public target: string;

	public attributes: ICollection<Attribute>;

	public constructor()
	{
		super("Relationship");
        this.attributes  = new GeneralCollection<Attribute> ([]);
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

}

export abstract class ComponentProperty{
	public id: string;
	public name: string = "foo";
	public visibility: VisibilityType = VisibilityType.Public;
	public isStatic: boolean = false;
	public propertyString: string = ""; 
	public type: DataType = new DataType("any");
	constructor(type)
	{
		this["$type"] = `CoUML_app.Model.${type}, CoUML-app`;
	}

	abstract toString(): string;

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

	multiplicity: Multiplicity; 
	
	defaultValue: string; 
	
	constructor(){
		super("Attribute");
	}

	toString(): string
	{
		return `${String.fromCharCode(this.visibility as unknown as number)} ${this.name}: ${this.type.dataType}`;
	}
}


/**
 * describs an operation from a diagram element
 * diagram:
 *      [ + foo(p: DataType, q: DataType): DataType ]
 * implimentation: 
 *      public DataType foo( DataType p, DataType q){}
 */
 export class Operation extends ComponentProperty implements IGettable
{
	public parameters: ICollection<Attribute>;

	constructor()
	{
		super("Operation");
		this.parameters = new GeneralCollection<Attribute> ([]);
	}

	get(id: string) {
		return this.parameters.get(id);
	}

	toString(): string
	{
		return `${String.fromCharCode(this.visibility as unknown as number) } ${this.name}(${this.parameters.size>0? this.parameters.toString(): ""}): ${this.type.dataType}`;
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

