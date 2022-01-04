import * as User from './User';
import * as Dimension from './Dimension';
import { GeneralCollection, ICollection, RelationalCollection } from './Collection';
import {v4 as uuidv4} from 'uuid';

export class Diagram
{
	public elements: ICollection<DiagramElement> = new RelationalCollection([]);
}
export abstract class DiagramElement{
	editor: User.IUser = new User.NullUser();
	id: string = uuidv4();
	dimension: Dimension.IDimension = new Dimension.Dimension();
}

