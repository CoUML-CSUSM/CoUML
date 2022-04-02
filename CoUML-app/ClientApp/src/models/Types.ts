export namespace VisibilityType{
    export enum VisibilityType{
        Private	=	'-',
        Public	=	'+',
        Protected =	'#',
        Package	=	'~',
        LocalScope = ' '
    }

    export function get(x: string | number): VisibilityType
    {
        switch(x){
            case VisibilityType.Private:
            case VisibilityType.Private.charCodeAt(0):
                    return VisibilityType.Private;
                    
            case VisibilityType.Public:
            case VisibilityType.Public.charCodeAt(0):
                     return VisibilityType.Public;

            case VisibilityType.Protected:
            case VisibilityType.Protected.charCodeAt(0):
                  return VisibilityType.Protected;

            case VisibilityType.Package:
            case VisibilityType.Package.charCodeAt(0):
                    return VisibilityType.Package;

            case VisibilityType.LocalScope:
            case VisibilityType.LocalScope.charCodeAt(0):
            default:
                 return VisibilityType.LocalScope;
        }
    }
}
export class DataType
{
	dataType: string;
    constructor(type: string = "")
    {
        this.dataType = type;
    }
    public toUmlNotation(): string
    {
        return `: ${this.dataType}`;
    }
}

export enum RelationshipType
{
    Dependency, 
    Association,
    Aggregation,
    Composition,
    Generalization,
    Realization
}
