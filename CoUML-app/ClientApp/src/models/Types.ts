export namespace VisibilityType{
    export enum VisibilityType{
		Private = 0,
		Public = 1,
		Protected = 2,
		Package = 3,
		LocalScope = 4
    }

    export function get(x: string | number): VisibilityType
    {
       
        let t: VisibilityType;
        switch(x){
            case VisibilityType.Private: case '-': case "Private":
                t = VisibilityType.Private;
                break;
                    
            case VisibilityType.Public: case '+': case "Public":
                t = VisibilityType.Public;
                break;

            case VisibilityType.Protected: case '#': case "Protected":
                t = VisibilityType.Protected;
                break;

            case VisibilityType.Package: case '~': case "Package":
                t = VisibilityType.Package;
                break;

            case VisibilityType.LocalScope: case ' ': case "LocalScope":
            default:
                t = VisibilityType.LocalScope;
                break;
        }
        console.log(`to enum "${x}" to ${t} ${symbol(t)}`);
        return t;
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
            default: return '*'
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
