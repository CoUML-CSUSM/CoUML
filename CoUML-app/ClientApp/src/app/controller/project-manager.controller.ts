import { Injectable } from '@angular/core';
import { CoUmlHubService } from "../service/couml-hub.service";
import { Class, Diagram, Attribute, Interface, Operation, Relationship, RelationshipType, VisibilityType, Assembler } from 'src/models/DiagramModel';
import {  User, DiagramElement } from 'src/models/DiagramModel';


@Injectable()
export class ProjectManager{
    newDiagram: Diagram;

    constructor(private _coUmlHub: CoUmlHubService){}

    public generate(dId:string){

        console.log("Creating new diagram")
        this._coUmlHub.generate(dId);
        
        (d) => {
            this.newDiagram = Assembler.assembleDiagram(d);
        };
            
    }
}