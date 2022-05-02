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

	public generate(dId:string): Promise<string>
	{

		return this._coUmlHub.generate(dId);
	}

	public invite(uId:string): Promise<boolean>
	{
		return this._coUmlHub.invite(uId);
	}
	
	public upload(diagramJson: string): Promise<string>
	{
		
		console.log("ProjectManager. upload(diagramJson: string)\n\n", diagramJson);
		try {//TODO: check if text is valid diagram befor uploading
			if(JSON.parse(diagramJson)?.id)
				return this._coUmlHub.generateProjectFromDiagram(diagramJson);
		} catch (error) {
			console.error(error)
		}
		return Promise.reject("Invalid Diagram");
	}

}