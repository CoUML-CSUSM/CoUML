
export enum VisabilityType{
    Private="-",
    Public="+",
    Protected="#",
    Package="~",
    LocalScope=""
}

/*
export enum DataType{
    Int,
    Double,
    Float,
    String
}
*/

//maybe add a value for type?
export abstract class DataType{

}


export class Attribute{
    visibility:VisabilityType;
    name:string;
    type:DataType;//not sure if we want enums we can make an abstract rn
    multiplicity:number = null;//diagram says int[10..-1]=null idk. no car in ts. make * -1
    default:string = null;//says =null
    propertyString:string = null;//says =null
}


export interface AttributeCollectionIF{
    Iterator():AttributeIteratorIF;
}

//after that rewrite in c# for both ends
//collections are part of iterator pattern
export class AttributeCollection implements AttributeCollectionIF{
    attributes: Attribute[];
    
    //creates an iteratorIF
    Iterator():AttributeIteratorIF{
        return new AttributeIterator();
    }
}

export interface AttributeIteratorIF{
    hasNextAttribute():boolean;
    getNextAttribute():Attribute;
    hasPreviousAttribute():boolean;
    getPreviousAttribute():Attribute;
}

//fetches objects from collection
export class AttributeIterator implements AttributeIteratorIF{
    collection:AttributeCollection;
    position:number = 0;

    hasNextAttribute():boolean{
        return this.collection.attributes.length > this.position+1;
    }
    getNextAttribute():Attribute{
        if(this.hasNextAttribute){
            return this.collection.attributes[++this.position];
        }
    }
    hasPreviousAttribute():boolean{
        return this.position-1 > 0;
    }
    getPreviousAttribute():Attribute{
        if(this.hasPreviousAttribute){
            return this.collection.attributes[--this.position];
        }
    }
}