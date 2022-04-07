import { AfterViewInit, Component as AngularComponent, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Class, Diagram, Component, Attribute, Interface, Operation, Relationship, RelationshipType, VisibilityType as VisibilityType, User, DiagramDataSet } from 'src/models/DiagramModel';
import { ProjectManager } from '../controller/project-manager.controller';
import { CoUmlHubService } from '../service/couml-hub.service';
import { PrimeNGConfig } from "primeng/api";
import { ProjectDeveloper } from '../controller/project-developer.controller';

import { SocialAuthService, SocialUser } from "angularx-social-login";
import {GoogleLoginProvider } from "angularx-social-login";
import { DialogService } from 'primeng/dynamicdialog';
import { DiagramTableComponent } from './open/diagram-table.component';

//client id
//174000524733-gq2vagupknm77i794hll3kbs3iupm6fu.apps.googleusercontent.com

//client secret
//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

@AngularComponent({
    selector: 'app-menu',
    templateUrl: './project-menu.component.html',
    // providers: [ProjectManager, ProjectDeveloper]
    providers: [ProjectManager, ProjectDeveloper, DialogService]
  })
  export class ProjectMenuComponent{

    _menuItems: MenuItem[];
    @Output() open: EventEmitter<boolean> = new EventEmitter();


    constructor(
      private _projectManager: ProjectManager,
      private _coUmlHub: CoUmlHubService,
      private primengConfig: PrimeNGConfig,
      private authService: SocialAuthService,//login stuff,
      private dialogService: DialogService,//open dialog box
      ){
      this._menuItems = [
        {
          label: "File",
          id: "menuFile",
          items: [
            {
              label: "New...",
              id: "menuFileNew",
              command: () => this.showNewDiagramDialog(),
            },
            {
              label: "Open...",
              id: "menuFileOpen",
              command: ()=> this.showOpenDiagram()
            },
            {
              label: "Trigger Breakpoint",
              id: "menuFileTriggerBreakpoint",
              command: ()=> this._coUmlHub.triggerBreakPoint(),
            },
            {
              label: "Fetch Test",
              command: () => this._coUmlHub._projectDeveloper.open("test",this._coUmlHub._projectDeveloper._editor),
            }
          ]
        },
        {
          label: "Edit",
          id: "menuEdit",
          items: []
        },
        {
          label: "User",
          id: "menuUser",
          items: [
            {
              label: "Login...",
              id: "menuUserLogin",
              command: () => this.signInWithGoogle(),
            },
            {
              label: "Sign Out",
              id: "menuUserSignOut",
              command: () => this.signOut(),
            }
          ]
        }
      ];

    }

    
    //pop up
    ngOnInit() {
      this.primengConfig.ripple = true;
    }
    
    showNewDiagramDialog() {
      this.open.emit(true);
    }

    //login stuff
    signInWithGoogle(): void {
      console.log("sign in");
  
      this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((socialUser)=>{//store email here nd send it to databse
        console.log(socialUser.email);
        this._coUmlHub._projectDeveloper.setEditor(new User(socialUser.email));
        this._coUmlHub.register(socialUser.email);
        //this._coUmlHub.generate("111");
      });
  
      //console.log(`${GoogleLoginProvider.PROVIDER_ID}`);
    }
  
  
    signOut(): void {
      console.log("sign out");
      this.authService.signOut();
    }
  
    //
    refreshToken(): void {
      this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
    }

    /**
     * opens a dialog to let the user select from diagrams they hae access to.
     */
    showOpenDiagram()
    {
      //if user is logged in
      if(this._coUmlHub._projectDeveloper._editor?.id)
      {
        const openDiagramDialog = this.dialogService.open(DiagramTableComponent, {
          data: {
            id: this._coUmlHub._projectDeveloper._editor.id // id of user ToDO: Central user service? maybe move to different central provider class?
          },
            header: 'Choose a Diagram',
            width: '70%'
        });
    
        // string of the _id is returned to indicate the user's selection
        openDiagramDialog.onClose.subscribe((diagram: DiagramDataSet) => {
            if (diagram) {
                console.log(diagram);
            }
        });
      }
    }
  }