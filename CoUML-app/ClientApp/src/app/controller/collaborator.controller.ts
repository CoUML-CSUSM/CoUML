import { Injectable } from '@angular/core';
import { CoUmlHubService } from "../service/couml-hub.service";
import { Class, Diagram, Attribute, Interface, Operation, Relationship, RelationshipType, VisibilityType, Assembler } from 'src/models/DiagramModel';
import {  User, UmlElement } from 'src/models/DiagramModel';


@Injectable()
export class Collaborator{

	constructor(private _coUmlHub: CoUmlHubService){
		this._coUmlHub.subscribe(this);
	}

	developers: User[] = [
		{ id: "Bender" },
		{ id: "Fry" },
		{ id: "Lela" },
	];


}