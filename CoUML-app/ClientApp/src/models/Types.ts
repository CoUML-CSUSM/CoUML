export enum VisibilityType{
    Private	=	'-',
    Public	=	'+',
    Protected =	'#',
    Package	=	'~',
    LocalScope = ''
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
    Composistion,
    Generalization,
    Realization
}
