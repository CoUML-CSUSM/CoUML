import { Injectable } from '@angular/core';
import { CoUmlHubService } from "../service/couml-hub.service";
import { Class, Diagram, Attribute, Interface, Operation, Relationship, RelationshipType, VisibilityType, Assembler } from 'src/models/DiagramModel';
import {  User, UmlElement } from 'src/models/DiagramModel';


@Injectable({ providedIn: 'root' })
export class ProjectManager{

	constructor(
		private _coUmlHub: CoUmlHubService
	){
		console.log("ProjectManager\n", this, "\nwith\n", arguments);
		this._coUmlHub.subscribe(this);
	}

	public generate(dId:string){

			console.log("manager");
			console.log(dId);
			console.log("Creating new diagram");
		this._coUmlHub.generate(dId).then((project) => 
			{
				if(project)
					this._coUmlHub._projectDeveloper.open(project);
				else
					console.log(`Project "${dId}" not created.`)
			});
	}

	public invite(uId:string){
		this._coUmlHub.invite(uId);
	}
	
	public upload(diagramJson: string): Promise<string>
	{
		throw new Error('Method not implemented.');
	}

}