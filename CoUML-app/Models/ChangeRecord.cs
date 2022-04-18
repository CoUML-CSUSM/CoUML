namespace CoUML_app.Models
{
	public struct ChangeRecord
	{
		public string[] id {get; set;}
		public PropertyType affectedProperty {get; set;}
		public ActionType action {get;set;}
		public object value {get;set;}

	}

	public enum ActionType
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

	public enum PropertyType
	{
		//collections
		Elements = 0,
		Operations = 1,
		Attribute = 2,
		Enums = 3,

		//class attribute
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
		Lable = 16
	}

}