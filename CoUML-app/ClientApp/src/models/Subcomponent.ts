import { DiagramElement } from "./Diagram";
import { Component } from "./Component";
import { VisibilityType, DataType, RelationshipType } from "./Types";
import { ICollection } from "./Collection";
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
export class Relationship extends DiagramElement {
	type: RelationshipType;
	from: string;
	to: string;
	atributes: ICollection<Attribute>;

	fromCompnent( component: Component){
		this.from = component.id
	}
	toComponent( component: Component){
		this.to = component?.id
	}
}

/**
 * The multiplicity of an atribute
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
	min: number = null;
	max: number = null;
}

/**
 * describs an attibute of a diagram element
 * diagram:
 *      [ - myAttribute: DataType = DefaultObject ]
 * implimentation: 
 *      private DataType myAttribute = new DefaultObject<DataType>();
 */
export class Attribute{
	visibility: VisibilityType;
	name: string;
	type: DataType;             //not sure if we want enums we can make an abstract rn
	multiplicity: Multiplicity; //diagram says int[10..-1]=null idk. no car in ts. make * -1
	defaultValue: string = null;      //says =null
	propertyString: string = null;//says =null
}


/**
 * describs an operation from a diagram element
 * diagram:
 *      [ + foo(p: DataType, q: DataType): DataType ]
 * implimentation: 
 *      public DataType foo( DataType p, DataType q){}
 */
 export class Operation{
	visibility: VisibilityType;
	name: string;
	parameters: ICollection<Attribute>;
	returnType: DataType;
	isStatic: boolean;
	propertyString: string = null; //=null
}
