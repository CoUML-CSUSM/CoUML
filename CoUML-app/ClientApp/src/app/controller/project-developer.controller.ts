import { Injectable } from '@angular/core';
import { CoUmlHubService } from "../service/couml-hub.service";
import { Diagram, DiagramBuilder } from 'src/models/DiagramModel';
import { Binary } from '@angular/compiler';

@Injectable()
export class ProjectDeveloper{

	projectDiagram: Diagram;

	constructor(private _coUmlHub: CoUmlHubService)	{}


	public open( id: string)
	{
		
		this._coUmlHub.fetch( id ) //get diagram from server
			.then( (d) => {
				this._coUmlHub.subscribe(this);
				console.log(d);
				this.projectDiagram = new DiagramBuilder().buildDiagram (d);
				console.log(this.projectDiagram);
			} ); // create AMDiagram from diagram 
	}

	public close ()
	{
		//TODO: close the project and remove yourself from the group
	}

	public makeChange(diagram: Diagram)
	{
		// this._CoUmlHub.commit(changes);

	}

	public applyChange(diagram)
	{

		// /* log */ this._coUmlHub.log.log(ProjectDeveloper.name, "applyChanges", JSON.stringify(this.recentPatch) );

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