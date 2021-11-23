import { VisabilityType } from "./Attribute";
import { DataType } from "./Attribute";

export class Operation{
    visability:VisabilityType;
    name:string;
    parameters:OperationCollection;
    returnType:DataType;
    isStatic:Boolean;
    propertyString:string = null;//=null
}


export interface OperationCollectionIF{
    Iterator():OperationIteratorIF;
}

//after that rewrite in c# for both ends
//collections are part of iterator pattern
export class OperationCollection implements OperationCollectionIF{
    Operations: Operation[];
    
    //creates an iteratorIF
    Iterator():OperationIteratorIF{
        return new OperationIterator();
    }
}

export interface OperationIteratorIF{
    hasNextOperation():boolean;
    getNextOperation():Operation;
    hasPreviousOperation():boolean;
    getPreviousOperation():Operation;
}

//fetches objects from collection
export class OperationIterator implements OperationIteratorIF{
    collection:OperationCollection;
    position:number = 0;

    hasNextOperation():boolean{
        return this.collection.Operations.length > this.position+1;
    }
    getNextOperation():Operation{
        if(this.hasNextOperation){
            return this.collection.Operations[++this.position];
        }
    }
    hasPreviousOperation():boolean{
        return this.position-1 > 0;
    }
    getPreviousOperation():Operation{
        if(this.hasPreviousOperation){
            return this.collection.Operations[--this.position];
        }
    }
}