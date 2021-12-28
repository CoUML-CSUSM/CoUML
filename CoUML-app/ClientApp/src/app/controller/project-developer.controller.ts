import { Diagram } from "src/models/Diagram";
import { CoUmlHubService } from "../service/couml-hub.service";
import * as Automerge from 'automerge';

export class ProjectDeveloper{

	projectDiagram: Automerge.FreezeObject<Diagram>;
	recentPatch: Automerge.Patch;
	
	constructor( private s_CoUmlHub: CoUmlHubService)
	{
		this.s_CoUmlHub.openDiagram() //get diagram from server
			.then( (diagram) => {
				this.projectDiagram = Automerge.from(diagram);
				this.describe();
			} ); // create AMDiagram from diagram 
	}

	public makeChange(diagram: Automerge.FreezeObject<Diagram>)
	{
		let changes = Automerge.getChanges(this.projectDiagram, diagram);
		this.s_CoUmlHub.commit(changes);

		this.describe();
	}

	public applyChange(diagram: Automerge.BinaryChange[])
	{
		[this.projectDiagram, this.recentPatch] = Automerge.applyChanges(this.projectDiagram, diagram);
		/* log */ this.s_CoUmlHub.log.log(ProjectDeveloper.name, "applyChanges", JSON.stringify(this.recentPatch) );

		this.describe();

		//TODO: render on screen
	}

	public describe()
	{
		console.log(`ProjectDeveloper::projectDiagram ->`);
		console.log(this.projectDiagram, 2, undefined);
	}

}

/** * * * * * * * * * * * * * * * * * * * * * * *
 * example code from github
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