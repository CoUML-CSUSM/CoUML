using CoUML_app.Models;
using System;
using System.IO;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;

namespace CoUML_app.Utility
{
    static class DevUtility{
        public static Diagram DiagramDefualt(string dId)
        {
            Diagram d = new Diagram(dId);


            // // interface
            // Interface i = new Interface{ name = "IShape"};
            // Operation io = new Operation
            // {   
            //     name = "draw",
            //     visibility = VisibilityType.Public,
            //     type = new DataType{ dataType = "void"}
            // };
            // i.operations.Insert(io);

            // io = new Operation
            // {   
            //     name = "scale",
            //     visibility = VisibilityType.Public,
            //     type = new DataType{ dataType = "void"}
            // };
            // io.parameters.Insert(
            //     new Models.Attribute {
            //         name = "percent",
            //         visibility = VisibilityType.Private,
            //         type = new DataType{ dataType = "double" }
            //     }
            // );
            // i.operations.Insert(io);

            // io = new Operation
            // {   
            //     name = "area",
            //     visibility = VisibilityType.Public,
            //     type = new DataType{ dataType = "double"}
            // };
            // i.operations.Insert(io);


            // // class
            // Class c1  =  new Class("Hexagon");
            // Models.Attribute a1 = new Models.Attribute
            // {
            //     name = "diagonal",
            //     visibility = VisibilityType.Private,
            //     type = new DataType{ dataType = "double" }
            // };

            // c1.dimension.y = 400;
            // c1.attribute.Insert(a1);

            // // c impliments i
            // Relationship r1 = new Relationship
            // {
            //     type = RelationshipType.Realization,
            //     sourceComponent = c1,
            //     targetComponent = i,
            // };
            // // c1.relations.Insert(r1.id);
            // // i.relations.Insert(r1.id);


            // // class2
            // Class c2  =  new Class("Trangle");

            // c2.dimension.y = 400;
            // c2.dimension.x = 400;

            // Relationship r2 = new Relationship
            // {
            //     type = RelationshipType.Realization,
            //     sourceComponent = c2,
            //     targetComponent = i,
            // };
            // // c2.relations.Insert(r2.id);
            // // i.relations.Insert(r2.id);

            // d.elements.Insert(i);
            // d.elements.Insert(c1);
            // d.elements.Insert(r1); 
            // d.elements.Insert(c2); 
            // d.elements.Insert(r2); 

            return d;
        }


        public static Diagram EmptyDiagram(){
            return new Diagram();
        }      


        public static string OpenSampleFile()
        {
            string path = Directory.GetFiles(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Samples/"))[0];
            return File.ReadAllText(path);

        }

    }
}