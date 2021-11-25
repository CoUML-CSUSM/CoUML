import { ICollection } from "./Collection";
import { DiagramElement } from "./Diagram";
import { Operation, Attribute} from "./Subcomponent";
import { Relationship } from "./Subcomponent";

/**
 * Abstraction of Component 
 * Enumerations
 * Interface
 * AbstractClass
 * Class
 */
export abstract class Component extends DiagramElement
{
    compName:string;
    relations:ICollection<Relationship>;
}

/**
 * Enumeration
 */
export class Enumeration extends Component
{
    enums: ICollection<string>;
}

/**
 * Interface
 */
export class Interface extends Component
{
    operations: ICollection<Operation>;
}

/**
 * AbstractClass
 */
export class AbstractClass extends Component
{
    operations:ICollection<Operation>;
    atributes:ICollection<Attribute>;
}

/**
 * Class
 */
export class Class extends Component
{
    operations:ICollection<Operation>;
    atributes:ICollection<Attribute>;
}