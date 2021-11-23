
enum VisabilityType{//enums cant be strings in c#
    Private=1,//-
    Public=2,//+
    Protected=3,//#
    Package=4,//~
    LocalScope=5//
}

abstract class Datatype{

}


class Attribute{
    VisabilityType visability;
    string name;
    Datatype type;
    int multiplicity;
    string defaultName = null;//default value in ts
    string propertyString = null;
}

interface AttributeCollectionIF{
    AttributeIteratorIF Iterator();
}

class AttributeCollection : AttributeCollectionIF{
    public Attribute[] attributes;//needs to be a dynamic array

    AttributeIteratorIF AttributeCollectionIF.Iterator(){
        return new AttributeIterator();
    }
}

interface AttributeIteratorIF{
    bool hasNextAttribute();
    Attribute getNextAttribute();
    bool hasPreviousAttribute();
    Attribute getPreviousAttribute();
}

class AttributeIterator : AttributeIteratorIF{
    AttributeCollection collection;
    int position = 0;


    bool AttributeIteratorIF.hasNextAttribute(){
        return this.collection.attributes.Length > this.position+1;
    }
    Attribute AttributeIteratorIF.getNextAttribute(){
        AttributeIteratorIF iterator = this;//is there another way for this to work? i couldnt get it to work
        if (iterator.hasNextAttribute()){
            return this.collection.attributes[++this.position];
        }
        return null;
    }
    bool AttributeIteratorIF.hasPreviousAttribute(){
        return this.position-1 > 0;
    }
    Attribute AttributeIteratorIF.getPreviousAttribute(){
        AttributeIteratorIF iterator = this;
        if(iterator.hasPreviousAttribute()){
            return this.collection.attributes[--this.position];
        }
        return null;
    }
}