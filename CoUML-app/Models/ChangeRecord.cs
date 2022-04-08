namespace CoUML_app.Models
{
    public struct ChangeRecord
    {
        public string[] id {get;}
        public PropertyType affectedProperty {get;}
        public ActionType action {get;}
        public object value {get;}
    }

    public enum ActionType
    {
        Insert, // value must be < UmlElement | ComponenetProperty >
        Remove, // value must be < string | id>
        Change, // value must be approprate datatypes of ChangePropertyType
        Lock,	
        Release
    }

    public enum PropertyType
    {
        //collections
        Elements,
        Operations,
        Attributes,
        // Relations,
        Enums,

        //class attributes
        Name,
        Type,
        Target,
        Source,
        Visibility,
        IsStatic,
        PropertyString,
        Parameters,
        Multiplicity,
        DefaultValue,
        Dimension,
        Editor
    }
}