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
	public from: string;
	public to: string;

	public attributes: ICollection<Attribute>;

	public constructor()
	{
		super();
        this.attributes  = new GeneralCollection<Attribute> ([]);
	}

	get(id: string) {
		return this.attributes.get(id);
	}

	fromCompnent( component: Component){
		this.from = component.id
	}
	toComponent( component: Component){
		this.to = component?.id
	}

}

export abstract class ComponentProperty{
	public id: string;
	public visibility: VisibilityType;
	public name: string;
	public isStatic: boolean;
	public propertyString: string; 
	public type: DataType;
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
		super();
		this.parameters = new GeneralCollection<Attribute> ([]);
	}

	get(id: string) {
		return this.parameters.get(id);
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

