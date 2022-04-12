using System;
using CoUML_app.Controllers.Hubs;
using CoUML_app.Models;


namespace CoUML_app.Models
{
	public class Template
	{

		public static Diagram DiagramDefualt(String dId)
		{
			Diagram d = new Diagram(dId);

			// interface
			Interface i = new Interface();
			i.name = "IShape";
			i.dimension.x = 300;

			Operation io = new Operation
			{   
				name = "draw",
				visibility = VisibilityType.Public,
				type = new DataType{ dataType = "void"}
			};
			i.operations.Insert(io);

			io = new Operation
			{   
				name = "scale",
				visibility = VisibilityType.Public,
				type = new DataType{ dataType = "void"}
			};
			io.parameters.Insert(
				new Models.Attribute {
					name = "percent",
					visibility = VisibilityType.Private,
					type = new DataType{ dataType = "double" },
					multiplicity = new Multiplicity()
				}
			);
			i.operations.Insert(io);

			io = new Operation
			{   
				name = "area",
				visibility = VisibilityType.Public,
				type = new DataType{ dataType = "double"}
			};
			i.operations.Insert(io);


			// class
			Class c1  =  new Class();
			c1.name = "Hexagon";
			Models.Attribute a1 = new Models.Attribute
			{
				name = "diagonal",
				visibility = VisibilityType.LocalScope,
				type = new DataType{ dataType = "double" },
				multiplicity = new Multiplicity()
			};

			c1.dimension.y = 400;
			c1.attribute.Insert(a1);

			// c impliments i
			Relationship r1 = new Relationship
			{
				type = RelationshipType.Realization,
				sourceComponent = c1,
				targetComponent = i,
			};
			// c1.relations.Insert(r1.id);
			// i.relations.Insert(r1.id);


			// class2
			Class c2  =  new Class();
			c2.name = "Trangle";
			c2.dimension.y = 400;
			c2.dimension.x = 400;

			Relationship r2 = new Relationship
			{
				type = RelationshipType.Realization,
				sourceComponent = c2,
				targetComponent = i,
			};
			// c2.relations.Insert(r2.id);
			// i.relations.Insert(r2.id);

			d.elements.Insert(i);
			d.elements.Insert(c1);
			d.elements.Insert(r1); 
			d.elements.Insert(c2); 
			d.elements.Insert(r2); 

			d.elements.Insert(new Class());

			return d;
		}
	}
}