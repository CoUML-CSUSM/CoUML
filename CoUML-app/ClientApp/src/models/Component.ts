import { UUID } from "automerge";
import { GeneralCollection, ICollection, RelationalCollection } from "./Collection";
import { DiagramElement } from "./Diagram";
import { Operation, Attribute, ComponentProperty} from "./Subcomponent";
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
    relations:ICollection<string> = new GeneralCollection<string>([]);
    constructor(name: string)
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
    get(id: string)
    {
        return this.enums.get(id)
    }
}

/**
 * Interface
 */
export class Interface extends Component
{
    operations: ICollection<Operation> = new GeneralCollection<Operation>([]);
    get(id: string)
    {
        return this.operations.get(id)
    }
}

/**
 * AbstractClass
 */
export class AbstractClass extends Component
{
    operations:ICollection<Operation> = new GeneralCollection<Operation>([]);
    attributes:ICollection<Attribute> = new GeneralCollection<Attribute>([]);
    get(id: string)
    {
        let property: ComponentProperty = this.operations.get(id);
        if(!property)
            property = this.attributes.get(id)
        return property;
    }
}

/**
 * Class
 */
export class Class extends Component
{
    operations:ICollection<Operation> = new GeneralCollection<Operation>([]);
    attributes:ICollection<Attribute> = new GeneralCollection<Attribute>([]);
    get(id: string)
    {
        let property: ComponentProperty = this.operations.get(id);
        if(!property)
            property = this.attributes.get(id)
        return property;
    }
}