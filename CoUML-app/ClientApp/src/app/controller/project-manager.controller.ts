import { Injectable } from '@angular/core';
import { CoUmlHubService } from "../service/couml-hub.service";
import * as Automerge from 'automerge';
import { Class, Diagram, Attribute, Interface, Operation, Relationship, RelationshipType, VisibilityType, DiagramBuilder } from 'src/models/DiagramModel';
import {  User, DiagramElement } from 'src/models/DiagramModel';


@Injectable()
export class ProjectManager{
    newDiagram: Diagram;

    //test stuff delete later
    testUser: User;
    testElement: Relationship;

    constructor(private _coUmlHub: CoUmlHubService){}

    public generate(){
        console.log('mtest');

        //test stuff delete later
        this.testUser = new User("hi");
        this.testElement = new Relationship();
        this.testElement.editor = this.testUser;


        this.newDiagram = new Diagram();

        //delete later
        this.newDiagram.elements[0] = this.testElement;

        console.log(this.newDiagram.elements[0].editor);
        this._coUmlHub.generate();

        (d) => {
            //this._coUmlHub.subscribe(this);
            //console.log(d);
            this.newDiagram = new DiagramBuilder().buildDiagram (d);}
        /*
        //delete later
        this._coUmlHub.fetch( "" ) //get diagram from server
			.then( (d) => {
				//this._coUmlHub.subscribe(this);
				//console.log(d);
				this.newDiagram = new DiagramBuilder().buildDiagram (d);
				//this.am_diagram = Automerge.from(this.newDiagram);
				//console.log(this.newDiagram);
				//console.log(`Automerge Diagram\n${this.describe()}`);
			} ); // create AMDiagram from diagram 
            */
            
    }
}