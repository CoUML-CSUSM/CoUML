
export interface ChangeRecord
{
	id: string[];
	affectedProperty: PropertyType;
	action: ActionType;
	value: any
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

