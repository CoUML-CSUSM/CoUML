import { AfterViewInit, Component as AngularComponent, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Class, Diagram, Component, Attribute, Interface, Operation, Relationship, RelationshipType, VisibilityType as VisibilityType } from 'src/models/DiagramModel';
import { ProjectManager } from '../controller/project-manager.controller';
import { CoUmlHubService } from '../service/couml-hub.service';
import { PrimeNGConfig } from "primeng/api";
import { ProjectDeveloper } from '../controller/project-developer.controller';

@AngularComponent({
    selector: 'app-menu',
    templateUrl: './project-menu.component.html',
    providers: [ProjectManager, ProjectDeveloper]
  })
  export class ProjectMenuComponent{

    _menuItems: MenuItem[];
    @Output() open: EventEmitter<boolean> = new EventEmitter();

    // _newDiagramDialog_isVisible = false;

    // input_diagramName:string

    constructor(
      private _projectManager: ProjectManager,
      private _coUmlHub: CoUmlHubService,
      private primengConfig: PrimeNGConfig
      ){
      this._menuItems = [
        {
          label: "File",
          items: [
            {
              label: "New...",
              command: () => this.gfg(),
            },
            {
              label: "Trigger Breakpoint",
              command: ()=> this._coUmlHub.triggerBreakPoint(),
            },
            {
              label: "Fetch Test",
              command: () => this._coUmlHub._projectDeveloper.open("test"),
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
    
    //pop up
    ngOnInit() {
      this.primengConfig.ripple = true;
    }
    
    geeks: boolean;
    
    gfg() {
      this.geeks = true;
      this.open.emit(this.geeks);
    }
  }