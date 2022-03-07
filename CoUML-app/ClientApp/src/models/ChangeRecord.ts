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
	}
}

export enum ActionType
{
	Insert, // value must be < DiagramElement | ComponenetProperty >
	Remove, // value must be < string | id>
	Change, // value must be approprate datatypes of ChangePropertyType
	Lock,	
	Release,
	Shift 
}

export enum PropertyType
{
	//collections
	Elements,			//0
	Operations,			//1
	Attributes,			//2
	// Relations,			//3
	Enums,				//4

	//class attributes
	Name,				//5
	Type,				//6
	Target,				//7
	Source,				//8
	Visibility,			//9
	IsStatic,			//10
	PropertyString,		//11
	Parameters,			//12
	Multiplicity,		//13
	DefaultValue,		//14
	Dimension,			//15
	Editor,				//16
	Label
}

