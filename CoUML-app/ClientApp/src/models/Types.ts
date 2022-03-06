export namespace VisibilityType{
    export enum VisibilityType{
        Private	=	'-',
        Public	=	'+',
        Protected =	'#',
        Package	=	'~',
        LocalScope = ' '
    }

    export function get(x: string): VisibilityType
    {
        switch(x.charAt(0)){
            case VisibilityType.Private:    return VisibilityType.Private;
            case VisibilityType.Public:     return VisibilityType.Public;
            case VisibilityType.Protected:  return VisibilityType.Protected;
            case VisibilityType.Package:    return VisibilityType.Package;
            default:
            case VisibilityType.LocalScope: return VisibilityType.LocalScope;
        }
    }
}
export class DataType
{
	dataType: string;
    constructor(type: string)
    {
        this.dataType = type;
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
