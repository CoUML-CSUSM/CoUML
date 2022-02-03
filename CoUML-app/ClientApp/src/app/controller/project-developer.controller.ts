import { Injectable } from '@angular/core';
import { CoUmlHubService } from "../service/couml-hub.service";
import { Diagram, DiagramBuilder, ChangeRecord, ActionType, PropertyType, Class, AbstractClass, Interface, Enumeration, IGettable } from 'src/models/DiagramModel';
import { Binary } from '@angular/compiler';

@Injectable()
export class ProjectDeveloper{

	_projectDiagram: Diagram;

	constructor(private _coUmlHub: CoUmlHubService)	{}


	public open( id: string )
	{
		
		this._coUmlHub.fetch( id ) //get diagram from server
			.then( (d) => {
				this._coUmlHub.subscribe(this);
				console.log(d);
				this._projectDiagram = new DiagramBuilder().buildDiagram (d);
				console.log(this._projectDiagram);
			} ); // create AMDiagram from diagram 
	}

	public close ()
	{
		//TODO: close the project and remove yourself from the group
	}

	public makeChange(changes: ChangeRecord[])
	{
		// this._CoUmlHub.commit(changes);

	}

	
	public applyChanges(changes: ChangeRecord[])
	{
		for(let change of changes)
		{
			this.applyChange(change);
		}
	}

	private applyChange(change: ChangeRecord)
	{
		let action = ActionType[change.action].toLowerCase();
		let affectedProperty = PropertyType[change.affectedProperty].toLowerCase();
		let operation = "";

		let affectedComponent = this._projectDiagram.elements as IGettable;
		for(let i of change.id)
		{
			affectedComponent = affectedComponent.get(i) as IGettable;
		}

		switch(change.action){
			case ActionType.Insert:
			case ActionType.Remove:
				operation = `${affectedProperty}.${action}(change.value)`;
				break;

			case ActionType.Lock:
			case ActionType.Release:
			case ActionType.Change:
				operation = `${affectedProperty} = change.value`;
				break;
		}

		eval(`affectedComponent.${operation}`);
	}
}
