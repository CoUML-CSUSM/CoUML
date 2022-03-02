import { GeneralCollection } from "./Collection";
import { IGettable } from "./Diagram";
import { DiagramElement, Operation, Attribute, ComponentProperty,  ICollection } from "./DiagramModel";


/**
 * Abstraction of Component 
 * Enumerations
 * Interface
 * AbstractClass
 * Class
 */
export abstract class Component extends DiagramElement implements IGettable
{
    public name:string;

    constructor(type: string, name: string)
    {
        super(type);
        this.name = name;
    }

    abstract get(id);
}

/**
 * Enumeration
 */
export class Enumeration extends Component
{
    public enums: ICollection<string>;

    public constructor(name: string = "EnumerationComponent")
    {
        super("Enumeration", name);
        this.enums  = new GeneralCollection<string> ([]);
    }

    get(id: any) {
        return this.enums.get(id);
    }
    
}

/**
 * Interface
 */
export class Interface extends Component
{
    public operations: ICollection<Operation>;

    public constructor(name: string = "InterfaceComponent")
    {
        super("Interface", name);
        this.operations  = new GeneralCollection<Operation> ([]);
    }

    get(id: any) {
        return this.operations.get(id);
    }
}

/**
 * AbstractClass
 */
export class AbstractClass extends Component
{
    public operations:ICollection<Operation>;
    public attributes:ICollection<Attribute>;

    public constructor(name: string = "AbstractClassComponent")
    {
        super("AbstractClass", name);
        this.operations  = new GeneralCollection<Operation> ([]);
        this.attributes  = new GeneralCollection<Attribute> ([]);
    }


    get(id: any) {
        return this.operations.get(id) || this.attributes.get(id);
    }
}

/**
 * Class
 */
export class Class extends Component
{

    public operations:ICollection<Operation>;
    public attributes:ICollection<Attribute>;

    public constructor(name: string = "ClassComponent")
    {
        super("Class", name);
        this.operations  = new GeneralCollection<Operation> ([]);
        this.attributes  = new GeneralCollection<Attribute> ([]);
    }


    get(id: any) {
        return this.operations.get(id) || this.attributes.get(id);
    }
}