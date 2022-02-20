import { Injectable } from '@angular/core';
import { CoUmlHubService } from "../service/couml-hub.service";
import * as Automerge from 'automerge';
import { Class, Diagram, Attribute, Interface, Operation, Relationship, RelationshipType, VisibilityType, DiagramBuilder } from 'src/models/DiagramModel';
import {  User, DiagramElement } from 'src/models/DiagramModel';


@Injectable()
export class ProjectManager{
    newDiagram: Diagram;

    constructor(private _coUmlHub: CoUmlHubService){}

    public generate(Did:string){

        console.log("Creating new diagram")
        this._coUmlHub.generate(Did);
        
        (d) => {;
            this.newDiagram = new DiagramBuilder().buildDiagram (d);
        };
            
    }
}