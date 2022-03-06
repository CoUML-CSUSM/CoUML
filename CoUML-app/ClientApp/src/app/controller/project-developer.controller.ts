import { Injectable } from '@angular/core';
import { CoUmlHubService } from "../service/couml-hub.service";
import { Diagram, Assembler, ChangeRecord, ActionType, PropertyType, Component, Class, AbstractClass, Interface, Enumeration, SerializedElement, IUser, ICollection } from 'src/models/DiagramModel';
import { EditorComponent } from '../editor/editor.component';


@Injectable()
export class ProjectDeveloper{

	_projectDiagram: Diagram = null;

	_diagramEditor: EditorComponent = null;
	_editor: IUser

	_changes: ChangeRecord[] = [];

	constructor(private _coUmlHub: CoUmlHubService)	{}

	subscribe(diagramEditor: EditorComponent) {
		this._diagramEditor = diagramEditor;
	}

	setEditor(user: IUser) {
		this._editor = user;
		console.log("editor set to");
		console.log(this._editor);
	}

	public open( id: string )
	{
		
		this._coUmlHub.fetch( id ) //get diagram from server
			.then( (d) => {
				this._coUmlHub.subscribe(this);
				console.log(d);
				this._projectDiagram = Assembler.assembleDiagram(d);
				console.log(this._projectDiagram);
				this._diagramEditor.draw();
			} ); 
	}

	public close ()
	{
		//TODO: close the project and remove yourself from the group
	}
	
	public applyChanges(changes: ChangeRecord[])
	{

		console.log("-------------- apply changes ---------------");
		console.log(changes);
		for(let change of changes)
		{
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
		console.log("applyChange");
		console.log(change);

		let action = ActionType[change.action].toLowerCase();
		let affectedProperty = PropertyType[change.affectedProperty].toLowerCase();
			
		let operation = "";

		let affectedComponent= this._projectDiagram.at(change.id);
		// if(change.id)
		// 	for(let id of change.id) 
		// 		affectedComponent = affectedComponent.get(id);

		console.log("----affectedComponent-----");
		console.log(affectedComponent);

		switch(change.action){
			case ActionType.Shift:
			case ActionType.Insert:
			case ActionType.Remove:
				operation = `${change.id? affectedProperty + ".": ''}${action}(change.value)`;
				break;

			case ActionType.Lock:
			case ActionType.Release:
			case ActionType.Change:
				operation = `${affectedProperty} = change.value`;
				break;
		}			

		eval("affectedComponent." + operation);

		console.log("result");
		console.log(this._projectDiagram);//i need to send this down to the c#
		this._coUmlHub.send(this._projectDiagram.id,this._projectDiagram);

	}

	stageChange(change: ChangeRecord) {
		// apply change locally
		this.applyChange(change);
		this._changes.push(change);

		//apply globally
		this.commitStagedChanges();
	}

	private async commitStagedChanges()
	{
		if(!this.shouldDelay)
		{
			this.shouldDelay = true;
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
