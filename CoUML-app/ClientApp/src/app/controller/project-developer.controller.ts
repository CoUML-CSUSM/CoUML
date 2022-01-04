import { Injectable } from '@angular/core';
import { CoUmlHubService } from "../service/couml-hub.service";
import * as Automerge from 'automerge';
import { Class, Diagram, Attribute, Interface, Operation, Relationship, RelationshipType, VisibilityType as VisibilityType } from 'src/models/DiagramModel';

@Injectable()
export class ProjectDeveloper{

	am_diagram: Automerge.FreezeObject<Diagram>;
	projectDiagram: Diagram;
	recentPatch: Automerge.Patch;

	constructor(private _CoUmlHub: CoUmlHubService)	{}

		public openSample()
	{
		let d = new Diagram();
		let i: Interface= new Interface("IShape");
		let  io: Operation = new Operation();
			io.visibility = VisibilityType.Public;
			io.name = "draw";
			io.returnType = {dataType: "void"};
		i.operations.insert(io);

		// class
		let c: Class  =  new Class("Hexigon");
		let a: Attribute = new Attribute();
		a.visibility = VisibilityType.Private;
		a.type = {dataType: "double"};
		c.attributes.insert(a);

		// c impliments i
		let r: Relationship = new Relationship();
		r.type = RelationshipType.Realization;
		r.from = c;
		r.to = i;

		d.elements.insert(i);
		d.elements.insert(c);
		d.elements.insert(r);


		this.am_diagram = Automerge.from(d);
		// console.log(`sample\n${d}`);
		// console.log(`sample\n${JSON.stringify(d, undefined, 2)}`);
		// console.log(`Automerge Diagram created with sample\n${this.projectDiagram}`);
		console.log(`Diagram:\n${this.describe()}`);
	}

	public open( id: string)
	{
		
		this._CoUmlHub.fetch( id ) //get diagram from server
			.then( (d) => {
				this._CoUmlHub.subscribe(this);
				this.projectDiagram = JSON.parse(d);
				this.am_diagram = Automerge.from(this.projectDiagram);
				console.log(`Diagram \n${JSON.stringify(this.projectDiagram, undefined, 2)}`);
				console.log(`Automerge Diagram\n${this.describe()}`);
			} ); // create AMDiagram from diagram 
	}

	public close ()
	{
		//TODO: close the project and remove yourself from the group
	}

	public makeChange(diagram: Diagram)
	// public makeChange(diagram: Automerge.FreezeObject<Diagram>)
	{
		let changes = Automerge.getChanges(this.am_diagram, diagram);
		this._CoUmlHub.commit(changes);

		this.describe();
	}

	public applyChange(diagram: Automerge.BinaryChange[])
	{
		[this.am_diagram, this.recentPatch] = Automerge.applyChanges(this.am_diagram, diagram);

		/* log */ this._CoUmlHub.log.log(ProjectDeveloper.name, "applyChanges", JSON.stringify(this.recentPatch) );

		this.describe();

		//TODO: render on screen
	}

	public describe():string
	{
		return JSON.stringify(this.am_diagram, undefined, 2);
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