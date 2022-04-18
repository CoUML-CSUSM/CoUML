
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
	toString()
	{
		return `CHANGE RECORDED: 
		at ${this.id}
		${ActionType[this.action]} to ${PropertyType[this.affectedProperty]}
		${this.value}
		`
	}
}


export enum ActionType
{
	Insert = 0, // value must be < DiagramElement | ComponenetProperty >
	Remove = 1, // value must be < string | id>
	Change = 2, // value must be approprate datatypes of ChangePropertyType
	Label = 3,
	Lock = 4,	
	Release = 5,
	Shift = 6,
	Style = 7
}

export enum PropertyType
{
	//collections
	Elements = 0,
	Operations = 1,
	Attribute = 2,
	Enums = 3,

	//class attributes
	Name = 4,
	Type = 5,
	Target = 6,
	Source = 7,
	Visibility = 8,
	IsStatic = 9,
	PropertyString = 10,
	Parameters = 11,
	Multiplicity = 12,
	DefaultValue = 13,
	Dimension = 14,
	Editor = 15,
	Label = 16
}

