import {v4 as Uuid} from 'uuid';
import { ICollection, RelationalCollection, Dimension, IUser, NullUser  } from './DiagramModel';

export class Diagram
{
	public elements: ICollection<DiagramElement> = new RelationalCollection([]);
}
export abstract class DiagramElement{
	editor: IUser = new NullUser();
	id: string = Uuid();
	dimension: Dimension = new Dimension();
}
