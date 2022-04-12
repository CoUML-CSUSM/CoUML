import { Injectable } from '@angular/core';
import { CoUmlHubService } from "../service/couml-hub.service";
import { Class, Diagram, Attribute, Interface, Operation, Relationship, RelationshipType, VisibilityType, Assembler } from 'src/models/DiagramModel';
import {  User, UmlElement } from 'src/models/DiagramModel';


@Injectable()
export class ProjectManager{

	newDiagram: Diagram;

	constructor(private _coUmlHub: CoUmlHubService){
		this._coUmlHub.subscribe(this);
	}

	public generate(dId:string, uId:string){

			console.log("manager");
			console.log(dId);
			console.log("Creating new diagram");
		this._coUmlHub.generate(dId).then((project) => 
			{
				if(project)
					this._coUmlHub._projectDeveloper.open(dId);
				else
					console.log(`Project "${dId}" not created.`)
			});
	}
}