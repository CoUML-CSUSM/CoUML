import { GeneralCollection, RelationalCollection } from "./Collection";
import { UmlElement } from "./Diagram";
import { Operation, Attribute, ComponentProperty,  ICollection } from "./DiagramModel";


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
    insert(element: any) {
        this.enums.insert(element);
    }
    remove(id: string) {
        this.enums.remove(id);
    }
    public enums: ICollection<string>;

    public constructor(name: string = "EnumerationComponent")
    {
        super("Enumeration", name);
        this.enums  = new GeneralCollection<string> ([]);
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
    insert(element: any) {
        
        console.log(`xxxxxxxxxxxxxxx INSERTING xxxxxxxxxxxxxxx \n${element.name}`);

        console.log(`
        typeof(element)     ${element.constructor.name}
        Operation.name      ${Operation.name}
        Attribute.name      ${Attribute.name}
        `)
        console.log(element);
        if(element.constructor.name == Operation.name){
            console.log(`
            element.constructor.name == Operation.name
            ${element.constructor.name == Operation.name}
            `);
            this.operations.insert(element);

        }
        if(element.constructor.name == Attribute.name){
            console.log(`
            element.constructor.name == Attribute.name
            ${element.constructor.name == Attribute.name}
            `);
            this.attributes.insert(element);
        }
    }
    remove(id: string) {
        console.log(`xxxxxxxxxxxxxxx removing xxxxxxxxxxxxxxx \n${id}`);

        let element = this.get(id);
        console.log(`
        typeof(element)     ${element.constructor.name}
        Operation.name      ${Operation.name}
        Attribute.name      ${Attribute.name}
        `)
        console.log(element);
        if(element.constructor.name == Operation.name){
            console.log(`
            element.constructor.name == Operation.name
            ${element.constructor.name == Operation.name}
            `);
            this.operations.remove(id);

        }
        if(element.constructor.name == Attribute.name){
            console.log(`
            element.constructor.name == Attribute.name
            ${element.constructor.name == Attribute.name}
            `);
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
    insert(element: any) {
        
        console.log(`xxxxxxxxxxxxxxx INSERTING xxxxxxxxxxxxxxx \n${element.name}`);

        console.log(`
        typeof(element)     ${element.constructor.name}
        Operation.name      ${Operation.name}
        Attribute.name      ${Attribute.name}
        `)
        console.log(element);
        if(element.constructor.name == Operation.name){
            console.log(`
            element.constructor.name == Operation.name
            ${element.constructor.name == Operation.name}
            `);
            this.operations.insert(element);

        }
        if(element.constructor.name == Attribute.name){
            console.log(`
            element.constructor.name == Attribute.name
            ${element.constructor.name == Attribute.name}
            `);
            this.attributes.insert(element);
        }
    }
    remove(id: string) {
        console.log(`xxxxxxxxxxxxxxx removing xxxxxxxxxxxxxxx \n${id}`);

        let element = this.get(id);
        console.log(`
        typeof(element)     ${element.constructor.name}
        Operation.name      ${Operation.name}
        Attribute.name      ${Attribute.name}
        `)
        console.log(element);
        if(element.constructor.name == Operation.name){
            console.log(`
            element.constructor.name == Operation.name
            ${element.constructor.name == Operation.name}
            `);
            this.operations.remove(id);

        }
        if(element.constructor.name == Attribute.name){
            console.log(`
            element.constructor.name == Attribute.name
            ${element.constructor.name == Attribute.name}
            `);
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