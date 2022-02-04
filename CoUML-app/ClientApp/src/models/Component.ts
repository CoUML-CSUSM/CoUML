import { GeneralCollection } from "./Collection";
import { DiagramElement, Operation, Attribute, ComponentProperty,  ICollection } from "./DiagramModel";


/**
 * Abstraction of Component 
 * Enumerations
 * Interface
 * AbstractClass
 * Class
 */
export abstract class Component extends DiagramElement
{
    public name:string;
    public relations:ICollection<string>;

    constructor(name: string)
    {
        super();
        this.name = name;
        this.relations = new GeneralCollection<string> ([]);
    }
}

/**
 * Enumeration
 */
export class Enumeration extends Component
{
    public enums: ICollection<string>;

    public constructor(name: string)
    {
        super(name);
        this.enums  = new GeneralCollection<string> ([]);
    }

}

/**
 * Interface
 */
export class Interface extends Component
{
    public operations: ICollection<Operation>;

    public constructor(name: string)
    {
        super(name);
        this.operations  = new GeneralCollection<Operation> ([]);
    }
}

/**
 * AbstractClass
 */
export class AbstractClass extends Component
{
    public operations:ICollection<Operation>;
    public attributes:ICollection<Attribute>;

    public constructor(name: string)
    {
        super(name);
        this.operations  = new GeneralCollection<Operation> ([]);
        this.attributes  = new GeneralCollection<Attribute> ([]);
    }
}

/**
 * Class
 */
export class Class extends Component
{
    public operations:ICollection<Operation>;
    public attributes:ICollection<Attribute>;

    public constructor(name: string)
    {
        super(name);
        this.operations  = new GeneralCollection<Operation> ([]);
        this.attributes  = new GeneralCollection<Attribute> ([]);
    }
}