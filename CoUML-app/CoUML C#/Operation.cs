/*
using VisabilityType;
using Datatype;
*/

class Operation{
    VisabilityType visability;
    string name;
    OperationCollection parameters;
    Datatype returnType;
    string propertyString = null;
}

interface OperationCollectionIF{
    OperationIteratorIF Iterator();
}

class OperationCollection : OperationCollectionIF{
    public Operation[] Operations;//needs to be a dynamic array

    OperationIteratorIF OperationCollectionIF.Iterator(){
        return new OperationIterator();
    }
}

interface OperationIteratorIF{
    bool hasNextOperation();
    Operation getNextOperation();
    bool hasPreviousOperation();
    Operation getPreviousOperation();
}

class OperationIterator : OperationIteratorIF{
    OperationCollection collection;
    int position = 0;

    bool OperationIteratorIF.hasNextOperation(){
        return this.collection.Operations.Length > this.position+1;
    }
    Operation OperationIteratorIF.getNextOperation(){
        OperationIteratorIF iterator = this;
        if (iterator.hasNextOperation()){
            return this.collection.Operations[++this.position];
        }
        return null;
    }
    bool OperationIteratorIF.hasPreviousOperation(){
        return this.position-1 > 0;
    }
    Operation OperationIteratorIF.getPreviousOperation(){
        OperationIteratorIF iterator = this;
        if(iterator.hasPreviousOperation()){
            return this.collection.Operations[--this.position];
        }
        return null;
    }
}