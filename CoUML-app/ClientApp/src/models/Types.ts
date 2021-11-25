export enum VisabilityType{
    Private	=	"-",
    Public	=	"+",
    Protected =	"#",
    Package	=	"~",
    LocalScope = ""
}

export interface DataType
{
	dataType: string;
}

export enum RelationshipType
{
    Dependency,
    Association,
    Aggregation,
    Composistion,
    Generalization
}
