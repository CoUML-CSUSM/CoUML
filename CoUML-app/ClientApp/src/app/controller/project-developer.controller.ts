import { Injectable } from '@angular/core';
import { CoUmlHubService } from "../service/couml-hub.service";
import { Diagram, Assembler, ChangeRecord, ActionType, PropertyType, Component, Class, AbstractClass, Interface, Enumeration, UmlElement, IUser, ICollection } from 'src/models/DiagramModel';
import { EditorComponent } from '../editor/editor.component';


@Injectable()
export class ProjectDeveloper{

	_projectDiagram: Diagram = null;

	_diagramEditor: EditorComponent = null;
	_editor: IUser

	_changes: ChangeRecord[] = [];

	constructor(private _coUmlHub: CoUmlHubService)	{
		this._coUmlHub.subscribe(this);
	}

	subscribe(diagramEditor: EditorComponent) {
		this._diagramEditor = diagramEditor;
	}

	setEditor(user: IUser) {
		this._editor = user;
		console.log("editor set to");
		console.log(this._editor);
	}
	isDiagramSet()
	{
		return this._projectDiagram != null;
	}

	public open( id: string )
	{
		
		this._coUmlHub.fetch( id ) //get diagram from server
			.then( (d) => {
				console.log(d);
				this._projectDiagram = Assembler.assembleDiagram(d);

				console.log(this._projectDiagram);
				this._diagramEditor.draw(this._projectDiagram);
			} ); 
	}

	public close ()
	{
		this._projectDiagram = null;
		this._diagramEditor.clearGraph();
	}
	private _awaitingChanges: ChangeRecord[] = [];
	public applyChanges(changes: ChangeRecord[])
	{
		for(let change of changes)
			this._awaitingChanges.unshift(change);
		this.merge();
	}
	private merge()
	{	console.log("-------------- apply changes ---------------");
		// console.log(changes);
		// for(let change of changes)
		while(this._awaitingChanges.length>0){
			let change = this._awaitingChanges.pop();
			setTimeout(()=>{
				this.applyChange(change);
				this._diagramEditor.processChange(change);
			}, 100)
		}
		console.log("-------------- Done! ---------------");
		console.log(this._projectDiagram);

	}

	private applyChange(change: ChangeRecord)
	{
		console.log(`developer---------Change applying-------
		${ActionType[change.action]} . ${PropertyType[change.affectedProperty]}
		${change.id}
		value-> ${change.value}`);

		// let action = ActionType[change.action].toLowerCase();
		// let affectedProperty = PropertyType[change.affectedProperty].toLowerCase();
			
		// let operation = "";

		let affectedComponent= this._projectDiagram.at(change.id);

		switch(change.action){
			case ActionType.Shift:	affectedComponent.shift(change.value); break;
			case ActionType.Insert:	affectedComponent.insert(change.value); break;
			case ActionType.Remove:	affectedComponent.remove(change.value); break;
			case ActionType.Lock:	affectedComponent.lock(change.value); break;
			case ActionType.Release:	affectedComponent.release(change.value); break;
			case ActionType.Label:	affectedComponent.label(change.value); break;
				// operation = `${action}(change.value)`;
				// // operation = `${affectedProperty}.${action}(change.value)`;
				// break;

			case ActionType.Change:
				// operation = `${affectedProperty} = change.value`;
				// break;
				affectedComponent.change(change); break;
		}			

		// eval("affectedComponent." + operation);

		console.log("result");
		console.log(this._projectDiagram);//i need to send this down to the c#
		this._coUmlHub.send(this._projectDiagram.id,this._projectDiagram);

	}

	stageChange(change: ChangeRecord, updateSelf: boolean = false) {
		// apply change locally
		this.applyChange(change);
		this._changes.push(change);

		//apply globally
		this.commitStagedChanges();

		if(updateSelf)
			this._diagramEditor.processChange(change);
	}

	private async commitStagedChanges()
	{
		if(!this.shouldDelay)
		{
			this.shouldDelay = true;
			console.log(`committing changes`)
			this._changes.forEach(change=>console.log(change.toString()));

			this._coUmlHub.commit(this._changes);
			this._changes = [];
			//artificial delay that prevents the program from updating too offten, but submits any last added elements
			setTimeout(()=>{
				this.shouldDelay = false;
				if(0 < this._changes.length)
					this.commitStagedChanges();
			}, this.delayPeriod);
		}
	}

	private shouldDelay = false;
	private delayPeriod = 500; // 1 second


}
