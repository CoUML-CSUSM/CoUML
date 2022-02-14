namespace CoUML_app.Models
{
    public struct ChangeRecord
    {
        string[] id {get; set;}
        PropertyType affectedProperty {get; set;}
        ActionType action {get; set;}
        object value {get; set;}
    }

    public enum ActionType
    {
        Insert, // value must be < DiagramElement | ComponenetProperty >
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
        Relations,
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