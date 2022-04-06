import { ChangeRecord } from "./ChangeRecord";
import { GeneralCollection, RelationalCollection } from "./Collection";
import { UmlElement } from "./Diagram";
import { Operation, Attribute, ComponentProperty,  ICollection, Enumeral } from "./DiagramModel";


/**
 * Abstraction of Component 
 * Enumerations
 * Interface
 * AbstractClass
 * Class
 */
export abstract class Component extends UmlElement 
{
    public name:string;

    constructor(type: string, name: string)
    {
        super(type);
        this.name = name;
    }

    toUmlNotation(): string {
        return this.name;
    }

    label( newLabel: string)
    {
        this.name = newLabel;
    }
}

/**
 * Enumeration
 */
export class Enumeration extends Component
{
    change(change: ChangeRecord) {
        throw new Error("Method not implemented.");
    }
    insert(element: any) {
        this.enums.insert(element);
    }
    remove(id: string) {
        this.enums.remove(id);
    }
    public enums: ICollection<Enumeral>;

    public constructor(name: string = "EnumerationComponent")
    {
        super("Enumeration", name);
        this.enums  = new RelationalCollection<Enumeral> ([]);
    }

    get(id: string) {
        return this.enums.get(id);
    }
}

/**
 * Interface
 */
export class Interface extends Component
{
    change(change: ChangeRecord) {
        throw new Error("Method not implemented.");
    }
    insert(element: any) {
        this.operations.insert(element);
    }
    remove(id: string) {
        this.operations.remove(id);
    }
    public operations: ICollection<Operation>;

    public constructor(name: string = "InterfaceComponent")
    {
        super("Interface", name);
        this.operations  = new RelationalCollection<Operation> ([]);
    }

    get(id: string) {
        return this.operations.get(id);
    }
}

/**
 * AbstractClass
 */
export class AbstractClass extends Component
{
    change(change: ChangeRecord) {
        throw new Error("Method not implemented.");
    }
    insert(element: any) {
        console.log(element);
        if(element.constructor.name == Operation.name){
            this.operations.insert(element);
        }
        if(element.constructor.name == Attribute.name){
            this.attributes.insert(element);
        }
    }
    remove(id: string) {
       
        let element = this.get(id);
      
        console.log(element);
        if(element.constructor.name == Operation.name){
            this.operations.remove(id);
        }
        if(element.constructor.name == Attribute.name){
            this.attributes.remove(id);
        }
        // return element
    }

    public operations:ICollection<Operation>;
    public attributes:ICollection<Attribute>;

    public constructor(name: string = "AbstractClassComponent")
    {
        super("AbstractClass", name);
        this.operations  = new RelationalCollection<Operation> ([]);
        this.attributes  = new RelationalCollection<Attribute> ([]);
    }


    get(id: any) : Operation | Attribute{
        return this.operations.get(id) || this.attributes.get(id);
    }
}

/**
 * Class
 */
export class Class extends Component
{
    change(change: ChangeRecord) {
        throw new Error("Method not implemented.");
    }
    insert(element: any) {
        
        
        if(element.constructor.name == Operation.name){
            this.operations.insert(element);
        }
        if(element.constructor.name == Attribute.name){
            this.attributes.insert(element);
        }
    }
    remove(id: string) {

        let element = this.get(id);
        console.log(element);
        if(element.constructor.name == Operation.name){
            this.operations.remove(id);
        }
        if(element.constructor.name == Attribute.name){
            this.attributes.remove(id);
        }
        
        // return element
    }

    public operations:ICollection<Operation>;
    public attributes:ICollection<Attribute>;

    public constructor(name: string = "ClassComponent")
    {
        super("Class", name);
        this.operations  = new RelationalCollection<Operation> ([]);
        this.attributes  = new RelationalCollection<Attribute> ([]);
    }


    get(id: any)  : Operation | Attribute{
        return this.operations.get(id) || this.attributes.get(id);
    }
}