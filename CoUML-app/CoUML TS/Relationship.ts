import { User } from "./User";
import { RootObject } from "./RootObject";
import { Component } from "./Component";
import { AttributeCollection } from "./Attribute";

enum RelationshipType{
    Dependency,
    Association,
    Aggregation,
    Composistion,
    Generalization
}

export class Relationship implements RootObject{
    editor:User;
    type:RelationshipType;
    fromComponent:Component;
    toComponent:Component;
    atributes:AttributeCollection;
}

export interface RelationshipCollectionIF{
    Iterator():RelationshipIteratorIF;
}

//after that rewrite in c# for both ends
//collections are part of iterator pattern
export class RelationshipCollection implements RelationshipCollectionIF{
    Relationships: Relationship[];
    
    //creates an iteratorIF
    Iterator():RelationshipIteratorIF{
        return new RelationshipIterator();
    }
}

export interface RelationshipIteratorIF{
    hasNextRelationship():boolean;
    getNextRelationship():Relationship;
    hasPreviousRelationship():boolean;
    getPreviousRelationship():Relationship;
}

//fetches objects from collection
export class RelationshipIterator implements RelationshipIteratorIF{
    collection:RelationshipCollection;
    position:number = 0;

    hasNextRelationship():boolean{
        return this.collection.Relationships.length > this.position+1;
    }
    getNextRelationship():Relationship{
        if(this.hasNextRelationship){
            return this.collection.Relationships[++this.position];
        }
    }
    hasPreviousRelationship():boolean{
        return this.position-1 > 0;
    }
    getPreviousRelationship():Relationship{
        if(this.hasPreviousRelationship){
            return this.collection.Relationships[--this.position];
        }
    }
}