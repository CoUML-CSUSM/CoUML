/*
using User;
using RootObject;
using Component;
*/

enum RelationshipType{
    Dependency,
    Association,
    Aggregation,
    Composistion,
    Generalization
}

class Relationship : RootObject{
    User editor;
    RelationshipType type;
    Component fromComponent;
    Component toComponent;
    AttributeCollection attributes;
}

interface RelationshipCollectionIF{
    RelationshipIteratorIF Iterator();
}

class RelationshipCollection : RelationshipCollectionIF{
    public Relationship[] relationships;
    RelationshipIteratorIF RelationshipCollectionIF.Iterator(){
        return new RelationshipIterator();
    }
}

interface RelationshipIteratorIF{
    bool hasNextRelationship();
    Relationship getNextRelationship();
    bool hasPreviousRelationship();
    Relationship getPreviousRelationship();
}

class RelationshipIterator : RelationshipIteratorIF{
    RelationshipCollection collection;
    int position = 0;

    bool RelationshipIteratorIF.hasNextRelationship(){
        return this.collection.relationships.Length > this.position+1;
    }
    Relationship RelationshipIteratorIF.getNextRelationship(){
        RelationshipIteratorIF iterator = this;
        if (iterator.hasNextRelationship()){
            return this.collection.relationships[++this.position];
        }
        return null;
    }
    bool RelationshipIteratorIF.hasPreviousRelationship(){
        return this.position-1 > 0;
    }
    Relationship RelationshipIteratorIF.getPreviousRelationship(){
        RelationshipIteratorIF iterator = this;
        if(iterator.hasPreviousRelationship()){
            return this.collection.relationships[--this.position];
        }
        return null;
    }
}