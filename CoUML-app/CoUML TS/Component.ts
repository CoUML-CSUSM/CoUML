import { RootObject } from "./RootObject";
import { RelationshipCollection } from "./Relationship";
import { User } from "./User";
import { OperationCollection } from "./Opertaion";
import { AttributeCollection } from "./Attribute";

//should this be a interface?
export abstract class Component implements RootObject{
    editor:User;
    compName:string;
    relations:RelationshipCollection;
}

export class Interface extends Component{
    operations:OperationCollection;
}

export class AbstractClass extends Component{
    operations:OperationCollection;
    atributes:AttributeCollection
}

export class Class extends Component{
    operations:OperationCollection;
    atributes:AttributeCollection
}