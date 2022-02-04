import { Injectable } from '@angular/core';
import { CoUmlHubService } from "../service/couml-hub.service";
import { Diagram, DiagramBuilder, ChangeRecord, ActionType, PropertyType, Component, Class, AbstractClass, Interface, Enumeration, IGettable } from 'src/models/DiagramModel';


@Injectable()
export class ProjectDeveloper{

	_projectDiagram: Diagram = null;

	constructor(private _coUmlHub: CoUmlHubService)	{}


	public open( id: string )
	{
		
		this._coUmlHub.fetch( id ) //get diagram from server
			.then( (d) => {
				this._coUmlHub.subscribe(this);
				console.log(d);
				this._projectDiagram = new DiagramBuilder().buildDiagram (d);
				console.log(this._projectDiagram);

				// setTimeout(()=> this.manualInsert(), 5000);
			} ); // create AMDiagram from diagram 
	}

	public close ()
	{
		//TODO: close the project and remove yourself from the group
	}

	public makeChange(changes: ChangeRecord[])
	{
		this._coUmlHub.commit(changes);

	}

	
	public applyChanges(changes: ChangeRecord[])
	{
		console.log("apply changes");
		for(let change of changes)
		{
			
			// setTimeout(()=> {

				this.applyChange(change);
			// }, 2500);
		}
		console.log("DONE!");
		console.log(this._projectDiagram);
	}

	private applyChange(change: ChangeRecord)
	{
		console.log("change");
		console.log(change);

		let action = ActionType[change.action].toLowerCase();
		let affectedProperty = PropertyType[change.affectedProperty].toLowerCase();
		let operation = "";

		let affectedComponent = this._projectDiagram.elements as IGettable;
		if(change.id)
			for(let i of change.id)
			{
				affectedComponent = affectedComponent.get(i) as IGettable;
			}

		console.log(affectedComponent);
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

		console.log("affectedComponent");
		console.log(affectedComponent);
		console.log(`${affectedComponent.constructor.name}.${operation}`);
		eval("affectedComponent." + operation);

		console.log("result");
		console.log(this._projectDiagram);
	}

	manualInsert(){
		let de = this._projectDiagram.elements.get("0b68a108-f685-4e44-9e6e-a325d8d439f3") as Component;
			console.log(`de instanceof Component ==> ${de instanceof Component}`)
			console.log(de);
			de.relations.insert("Testing!!!!");
		console.log(this._projectDiagram);
	}
}
