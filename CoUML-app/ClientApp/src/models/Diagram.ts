import * as User from './User';
import {v4 as uuidv4} from 'uuid';
import { Interface, Enumeration, AbstractClass, Class, Component, Relationship, GeneralCollection, ICollection, RelationalCollection, Dimension, Operation  } from './DiagramModel';

export class Diagram
{
	public elements: ICollection<DiagramElement> = new RelationalCollection([]);
}
export abstract class DiagramElement{
	editor: User.IUser = new User.NullUser();
	id: string = uuidv4();
	dimension: Dimension = new Dimension();
}

export class DiagramBuilder
{
	buildDiagram(diagram_DTO: string)
	{
		let d = JSON.parse(diagram_DTO) as Diagram;
		let diagram = new Diagram();
		for(let e in d.elements)
		{
			let elem:DiagramElement = JSON.parse(e);
			let diagramElementType = this.getType(elem);
			if(diagramElementType.length == 1 )
			{
				//is a compnent or sub component
				let element: DiagramElement;
				switch(diagramElementType[0])
				{
					case Interface.name:
						element = this.buildInterface(elem as Interface);
						break;
					case Enumeration.name:
						break;
					case AbstractClass.name:
						break;
					case Class.name:
						break;
					case Relationship.name:
						break;
				}

				diagram.elements.insert(element);
			}else if(diagramElementType.length > 1)
			{

			}
		}

	}

	buildInterface(x: Interface): Interface
	{
		let _interface: Interface = new Interface(x.name);
		_interface.dimension = this.buildDimension(x.dimension);
		_interface.editor = this.buildUser(x.editor);
		_interface.id = x.id;
		_interface.operations = this.buildOperations(x.operations);
		_interface.relations = this.buildRelations(x.relations);

		return _interface;
	}
	buildRelations(relations: ICollection<DiagramElement>): ICollection<DiagramElement> {
		throw new Error('Method not implemented.');
	}
	buildOperations(operations: ICollection<Operation>): ICollection<Operation> {
		throw new Error('Method not implemented.');
	}
	buildUser(editor: User.IUser): User.IUser {
		throw new Error('Method not implemented.');
	}

	buildDimension(x: Dimension): Dimension
	{
		return {
			x: x.x,
			y: x.y,
			width: x.width,
			height: x.height
		}
	}
	


	getType(e)
	{
		let rx = /\w+\.\w+\.(\w+)/g;
		return rx.exec(e.$type);
	}
} 
/*
{
  "elements": {
    "$type": "CoUML_app.Models.RelationalCollection, CoUML-app",
    "items": [
      {
        "$type": "CoUML_app.Models.Interface, CoUML-app",
        "operations": {
          "$type": "CoUML_app.Models.GeneralCollection`1[[CoUML_app.Models.Operation, CoUML-app]], CoUML-app",
          "items": [
            {
              "visibility": 43,
              "name": "draw",
              "parameters": null,
              "returnType": {
                "dataType": "void"
              },
              "propertyString": null
            }
          ],
          "size": 1
        },
        "name": "IShape",
        "user": {
          "$type": "CoUML_app.Models.NullUser, CoUML-app",
          "id": "N/A"
        },
        "id": "c96a4549-e0fa-45a0-92ce-2b22f53d031c",
        "dimension": {
          "$type": "CoUML_app.Models.Dimension, CoUML-app",
          "x": 100,
          "y": 100,
          "w": 40,
          "height": 60
        }
      },
      {
        "$type": "CoUML_app.Models.Class, CoUML-app",
        "operations": {
          "$type": "CoUML_app.Models.GeneralCollection`1[[CoUML_app.Models.Operation, CoUML-app]], CoUML-app",
          "items": [],
          "size": 0
        },
        "attributes": {
          "$type": "CoUML_app.Models.GeneralCollection`1[[CoUML_app.Models.Attribute, CoUML-app]], CoUML-app",
          "items": [
            {
              "visibility": 45,
              "name": "diagonal",
              "type": {
                "dataType": "double"
              },
              "multiplicity": {
                "min": 0,
                "max": 0
              },
              "defaultValue": null,
              "propertyString": null
            }
          ],
          "size": 1
        },
        "name": "Hexagon",
        "user": {
          "$type": "CoUML_app.Models.NullUser, CoUML-app",
          "id": "N/A"
        },
        "id": "4de437e3-0f7d-4811-8c2d-c0b472528e85",
        "dimension": {
          "$type": "CoUML_app.Models.Dimension, CoUML-app",
          "x": 100,
          "y": 100,
          "w": 40,
          "height": 60
        }
      },
      {
        "$type": "CoUML_app.Models.Relationship, CoUML-app",
        "attributes": {
          "$type": "CoUML_app.Models.GeneralCollection`1[[CoUML_app.Models.Attribute, CoUML-app]], CoUML-app",
          "items": [],
          "size": 0
        },
        "type": 5,
        "from": "4de437e3-0f7d-4811-8c2d-c0b472528e85",
        "to": "c96a4549-e0fa-45a0-92ce-2b22f53d031c",
        "user": {
          "$type": "CoUML_app.Models.NullUser, CoUML-app",
          "id": "N/A"
        },
        "id": "0709c130-4a80-4c3a-8b3d-552afaa9f132",
        "dimension": {
          "$type": "CoUML_app.Models.Dimension, CoUML-app",
          "x": 100,
          "y": 100,
          "w": 40,
          "height": 60
        }
      }
    ],
    "size": 3
  }
}
*/