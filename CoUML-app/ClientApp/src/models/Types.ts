export namespace VisibilityType{
    export enum VisibilityType{
        Private,
        Public,
        Protected,
        Package,
        LocalScope
    }

    export function get(x: string | number): VisibilityType
    {
        switch(x){
            case VisibilityType.Private: case '-':
                    return VisibilityType.Private;
                    
            case VisibilityType.Public: case '+':
                     return VisibilityType.Public;

            case VisibilityType.Protected: case '#':
                  return VisibilityType.Protected;

            case VisibilityType.Package: case '~':
                    return VisibilityType.Package;

            case VisibilityType.LocalScope: case ' ':
            default:
                 return VisibilityType.LocalScope;
        }
    }
    export function symbol(type: VisibilityType): string
    {
        switch(type)
        {
            case VisibilityType.Private	: return '-';
            case VisibilityType.Public	: return	'+';
            case VisibilityType.Protected	: return	'#';
            case VisibilityType.Package	: return	'~';
            case VisibilityType.LocalScope	: return ' ';
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
