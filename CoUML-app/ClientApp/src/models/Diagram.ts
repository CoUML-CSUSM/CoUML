import * as User from './User';
import * as Dimension from './Dimension';
import { ICollection, RelationalCollection } from './Collection';

export class Diagram
{
	public elements: ICollection<DiagramElement> = new RelationalCollection();
}
export abstract class DiagramElement{
	editor: User.IUser = new User.NullUser();
	signature: string = "";
	dimension: Dimension.IDimension = new Dimension.NullDimension();
}

