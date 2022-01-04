import { GeneralCollection, ICollection, RelationalCollection } from "./Collection";
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
    name:string;
    relations:ICollection<DiagramElement> = new RelationalCollection([]);
    constructor( name: string)
    {
        super();
        this.name = name;
    }
}

/**
 * Enumeration
 */
export class Enumeration extends Component
{
    enums: ICollection<string> = new GeneralCollection<string>([]);
}

/**
 * Interface
 */
export class Interface extends Component
{
    operations: ICollection<Operation> = new GeneralCollection<Operation>([]);
}

/**
 * AbstractClass
 */
export class AbstractClass extends Component
{
    operations:ICollection<Operation> = new GeneralCollection<Operation>([]);
    attributes:ICollection<Attribute> = new GeneralCollection<Attribute>([]);
}

/**
 * Class
 */
export class Class extends Component
{
    operations:ICollection<Operation> = new GeneralCollection<Operation>([]);
    attributes:ICollection<Attribute> = new GeneralCollection<Attribute>([]);
}