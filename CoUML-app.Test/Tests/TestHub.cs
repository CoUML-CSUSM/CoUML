using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using CoUML_app.Controllers.Hubs;
using CoUML_app.Models;

namespace CoUML_app.Test.Tests
{
    [TestClass]
    public class TestHub
    {
        // private Diagram d = new Diagram();

        public TestHub()
        {
            // this.defualt();
        }

        [TestMethod]
        public void defualt()
        {
            // // interface
            // Interface i = new Interface("IShape");
            // Operation io = new Operation();
            //     io.visibility = VisibilityType.Public;
            //     io.name = "draw";
            //     io.returnType = new DataType("void");
            // i.Operations.Insert(io);

            // // class
            // Class c  =  new Class("Hexigon");
            // Models.Attribute a = new Models.Attribute(); // include "Models." as part of the name because there is also a System.Attribute class. 
            // a.visibility = VisibilityType.Private;
            // a.type = new DataType("double");
            // c.Attributes.Insert(a);

            // // c impliments i
            // Relationship r = new Relationship();
            // r.type = RelationshipType.Realization;
            // r.fromComponent = c;
            // r.toComponent = i;

            // d.Elements.Insert(i);
            // d.Elements.Insert(c);
            // d.Elements.Insert(r);

        }
        
    }
}