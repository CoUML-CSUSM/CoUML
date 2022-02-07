import { DiagramElement } from "./Diagram";
import { ComponentProperty } from "./Subcomponent";

export class ChangeRecord
{
	id: string[];
	affectedProperty: PropertyType;
	action: ActionType;
	value: any
	constructor( ids: string[], property: PropertyType, action: ActionType, value: any)
	{
		this. id = ids;
		this.affectedProperty = property;
		this.action = action;
		this.value = value;
		// if(this.value instanceof DiagramElement || this.value instanceof ComponentProperty)
		// 	this.value["$type"] = "CoUML_app.Models." + value.constructor.name +", CoUML_app";
	}
}

export enum ActionType
{
	Insert, // value must be < DiagramElement | ComponenetProperty >
	Remove, // value must be < string | id>
	Change, // value must be approprate datatypes of ChangePropertyType
	Lock,	
	Release 
}

export enum PropertyType
{
	//collections
	Elements,
	Operations,
	Attributes,
	Relations,
	Enums,

	//class attributes
	Name,
	Type,
	To,
	From,
	Visibility,
	IsStatic,
	PropertyString,
	Parameters,
	Multiplicity,
	DefaultValue,
	Dimension,
	Editor
}

