import { AfterViewInit, Component as AngularComponent, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Class, Diagram, Component, Attribute, Interface, Operation, Relationship, RelationshipType, VisibilityType as VisibilityType } from 'src/models/DiagramModel';
import { ProjectManager } from '../controller/project-manager.controller';
import { CoUmlHubService } from '../service/couml-hub.service';

@AngularComponent({
    selector: 'app-menu',
    templateUrl: './project-menu.component.html',
    providers: [ProjectManager]
  })
  export class ProjectMenuComponent{

    _menuItems: MenuItem[];

    // _newDiagramDialog_isVisible = false;

    // input_diagramName:string

    constructor(
      private _projectManager: ProjectManager,
      private _coUmlHub: CoUmlHubService
      ){
      this._menuItems = [
        {
          label: "File",
          items: [
            {
              label: "New...",
              command: () => this.generate(),
              // command: ()=> this._newDiagramDialog_isVisible = true,
            },
            {
              label: "Trigger Breakpoint",
              command: ()=> this._coUmlHub.triggerBreakPoint(),
            }
          ]
        },
        {
          label: "Edit",
          items: []
        }
      ];

    }

    public generate(){
        this._projectManager.generate("null");
    }
  }