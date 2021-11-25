/*
using RootObject;
using RelationshipCollection;
using User;
using OperationCollection;
using AttributeCollection;
*/


abstract class Component : RootObject{
    User editor;
    string compName;
    RelationshipCollection relations;
}

class Interface : Component{
    OperationCollection operations;
}

class AbstractClass : Component{
    OperationCollection operations;
    AttributeCollection attributes;
}

class Class : Component{
    OperationCollection operations;
    AttributeCollection attributes;
}