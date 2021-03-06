import { Injectable } from '@angular/core';
import { CoUmlHubService } from "../service/couml-hub.service";
import { MessageService } from 'primeng/api';
import { Diagram, Assembler, ChangeRecord, ActionType, PropertyType, Component, Class, AbstractClass, Interface, Enumeration, UmlElement, IUser, ICollection } from 'src/models/DiagramModel';
import { EditorComponent } from '../editor/editor.component';
import { TeamActivityComponent } from '../activity/team-activity.component';
import { EditorExportUtility } from '../editor/editor.utility';


@Injectable({ providedIn: 'root' })
export class ProjectDeveloper{


	_projectDiagram: Diagram = null;

	_diagramEditor: EditorComponent = null;
	_teamActivity: TeamActivityComponent

	private _outgoingChanges: ChangeRecord[] = [];
	private _incomingChanges: ChangeRecord[] = [];

	constructor(
		private _coUmlHub: CoUmlHubService,
		private _toastMessageService: MessageService
	){
		console.log("ProjectDeveloper\n", this, "\nwith\n", arguments);
		this._coUmlHub.subscribe(this);
	}

	subscribe(subscriber: any) 
	{
		switch(true)
		{
			case subscriber instanceof EditorComponent: 
				this._diagramEditor = subscriber; break;

			case subscriber instanceof TeamActivityComponent:
				this._teamActivity  = subscriber;
				this._coUmlHub.subscribe(subscriber);
				break;
		}
	}

	isDiagramSet()
	{
		return this._projectDiagram != null;
	}

	public open( dId: string)
	{
		
		this._coUmlHub.fetch( dId) //get diagram from server
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


	public applyChanges(changes: ChangeRecord[])
	{
		console.log(
			"Applying changes\n\n",
			changes
		);
		for(let change of changes)
			this._incomingChanges.unshift(change);
		this.merge();
	}

	logIn(email: string) {
		this._coUmlHub.logIn(email).then((user)=>{
			this._teamActivity?.logIn(Assembler.assembleUmlElement(JSON.parse(user)));
		});
	}

	logOut() {
		this._coUmlHub.logOut();
		this._teamActivity.logOut();
		this._diagramEditor.clearGraph();
		this._projectDiagram = null;
	}


	private merge()
	{	console.log("-------------- apply changes ---------------");
		// console.log(changes);
		// for(let change of changes)
		while(this._incomingChanges.length>0){
			let change = this._incomingChanges.pop();
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

		let affectedComponent= this._projectDiagram.at(change.id);

		switch(change.action){
			case ActionType.Shift:	affectedComponent.shift(change.value); break;
			case ActionType.Path:	affectedComponent.path(change.value); break;
			case ActionType.Style:	affectedComponent.style(change.value); break;
			case ActionType.Insert:	affectedComponent.insert(change.value); break;
			case ActionType.Remove:	affectedComponent.remove(change.value); break;
			case ActionType.Lock:	affectedComponent.lock(change.value); break;
			case ActionType.Release:	affectedComponent.release(change.value); break;
			case ActionType.Label:	affectedComponent.label(change.value); break;

			case ActionType.Change:

				switch(change.affectedProperty)
				{
					case PropertyType.IsStatic:
						affectedComponent.isStatic = change.value;
						break;
					default: affectedComponent.change(change); break;
				}
				break;
		}			

		console.log("result");
		console.log(this._projectDiagram);//i need to send this down to the c#

	}

	stageChange(change: ChangeRecord, updateSelf: boolean = false) {
		// apply change locally
		this.applyChange(change);
		this._outgoingChanges.push(change);

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

			this._coUmlHub.commit( this._outgoingChanges);

			this._outgoingChanges = [];
			//artificial delay that prevents the program from updating too offten, but submits any last added elements
			setTimeout(()=>{
				this.shouldDelay = false;
				if(0 < this._outgoingChanges.length)
					this.commitStagedChanges();
			}, this.delayPeriod);
		}
	}
	exportDiagramAsImage() {
		if(this.isDiagramSet())
			EditorExportUtility.createAnSVG(this._diagramEditor.graph);
	}

	private shouldDelay = false;
	private delayPeriod = 500; // 1 second


}
