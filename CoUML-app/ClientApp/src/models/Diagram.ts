import { DataType } from 'automerge';
import {v4 as uuidv4} from 'uuid';
import { Interface, Enumeration, AbstractClass, Class, Component, Relationship, GeneralCollection, ICollection, RelationalCollection, Dimension, Operation, User, IUser, NullUser  } from './DiagramModel';
import { Attribute } from './Subcomponent';

export class Diagram
{
	public elements: ICollection<DiagramElement> = new RelationalCollection([]);
}
export abstract class DiagramElement{
	editor: IUser = new NullUser();
	id: string = uuidv4();
	dimension: Dimension = new Dimension();
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