import { AfterViewInit, Component as AngularComponent, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Class, Diagram, Component, Attribute, Interface, Operation, Relationship, RelationshipType, VisibilityType as VisibilityType } from 'src/models/DiagramModel';
import { ProjectManager } from '../controller/project-manager.controller';

@AngularComponent({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    providers: [ProjectManager]
  })
  export class MenuComponent{

    constructor(private _projectManager: ProjectManager){}

    public generate(){
        this._projectManager.generate("null");
    }

    //change it to this once you set the default Did to "null"
  //   public generate(Did:string){
  //     this._projectManager.generate(Did);
  // }
  }