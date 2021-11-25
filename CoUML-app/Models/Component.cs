using CoUML_app.Models;

namespace CoUML_app.Models
{
	abstract class Component : DiagramElement{
		string compName;
		ICollection<Relationship> relations;
	}

	class Enumeration : Component{
		ICollection<string> Enums;
	}
	class Interface : Component{
		ICollection<Operation> Operations;
	}

	class AbstractClass : Component{
		ICollection<Operation>  operations;
		ICollection<Attribute>  attributes;
	}

	class Class : Component{
		ICollection<Operation>  operations;
		ICollection<Attribute> attributes;
	}
}

