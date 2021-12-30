import { Injectable } from '@angular/core';
import { Diagram } from "src/models/Diagram";
import { CoUmlHubService } from "../service/couml-hub.service";
import * as Automerge from 'automerge';

@Injectable()
export class ProjectDeveloper{

	projectDiagram: Automerge.FreezeObject<Diagram>;
	recentPatch: Automerge.Patch;
	
	constructor(private _CoUmlHub: CoUmlHubService)	{}

	public open( id: string)
	{
		this._CoUmlHub.fetch( id ) //get diagram from server
			.then( (diagram) => {
				this._CoUmlHub.subscribe(this);
				this.projectDiagram = Automerge.from(diagram);
				this.describe();
			} ); // create AMDiagram from diagram 
	}

	public close ()
	{
		//TODO: close the project and remove yourself from the group
	}

	public makeChange(diagram: Automerge.FreezeObject<Diagram>)
	{
		let changes = Automerge.getChanges(this.projectDiagram, diagram);
		this._CoUmlHub.commit(changes);

		this.describe();
	}

	public applyChange(diagram: Automerge.BinaryChange[])
	{
		[this.projectDiagram, this.recentPatch] = Automerge.applyChanges(this.projectDiagram, diagram);

		/* log */ this._CoUmlHub.log.log(ProjectDeveloper.name, "applyChanges", JSON.stringify(this.recentPatch) );

		this.describe();

		//TODO: render on screen
	}

	public describe():string
	{
		console.log(`ProjectDeveloper::projectDiagram ->`);
		console.log(this.projectDiagram);
		return JSON.stringify(this.projectDiagram,undefined,2);
	}

}

/** * * * * * * * * * * * * * * * * * * * * * * *
 * example code from github https://github.com/automerge/automerge
 ** * * * * * * * * * * * * * * * * * * * * * * *

 // On one node
let newDoc = Automerge.change(currentDoc, doc => {
  // make arbitrary change to the document
})
let changes = Automerge.getChanges(currentDoc, newDoc)

// broadcast changes as a byte array
network.broadcast(changes)

// On another node, receive the byte array
let changes = network.receive()
let [newDoc, patch] = Automerge.applyChanges(currentDoc, changes)
// `patch` is a description of the changes that were applied (a kind of diff)


 */