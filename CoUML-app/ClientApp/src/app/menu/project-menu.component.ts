import { AfterViewInit, Component as AngularComponent, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Class, Diagram, Component, Attribute, Interface, Operation, Relationship, RelationshipType, VisibilityType as VisibilityType } from 'src/models/DiagramModel';
import { ProjectManager } from '../controller/project-manager.controller';
import { CoUmlHubService } from '../service/couml-hub.service';
import { PrimeNGConfig } from "primeng/api";
import { ProjectDeveloper } from '../controller/project-developer.controller';

import { SocialAuthService, SocialUser } from "angularx-social-login";
import {GoogleLoginProvider } from "angularx-social-login";

//client id
//174000524733-gq2vagupknm77i794hll3kbs3iupm6fu.apps.googleusercontent.com

//client secret
//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

@AngularComponent({
    selector: 'app-menu',
    templateUrl: './project-menu.component.html',
    providers: [ProjectManager, ProjectDeveloper]
  })
  export class ProjectMenuComponent{

    _menuItems: MenuItem[];
    @Output() open: EventEmitter<boolean> = new EventEmitter();


    constructor(
      private _projectManager: ProjectManager,
      private _coUmlHub: CoUmlHubService,
      private primengConfig: PrimeNGConfig,
      private authService: SocialAuthService//login stuff
      ){
      this._menuItems = [
        {
          label: "File",
          items: [
            {
              label: "New...",
              command: () => this.showNewDiagramDialog(),
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
        },
        {
          label: "User",
          items: [
            {
              label: "Login...",
              command: () => this.signInWithGoogle(),
            },
            {
              label: "Signout",
              command: () => this.signOut(),
            }
          ]
        }
      ];

    }

    // public generate(){
    //     this._projectManager.generate("null");
    // }
    
    //pop up
    ngOnInit() {
      this.primengConfig.ripple = true;
    }
    
    showNewDiagramDialog() {
      this.open.emit(true);
    }

    //login stuff
    signInWithGoogle(): void {
      console.log("sign in test");
      let int = "hello";
      console.log(`${int}`);
  
      this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((socialUser)=>{//store email here nd send it to databse
        console.log(socialUser.email);
      });
  
      //console.log(`${GoogleLoginProvider.PROVIDER_ID}`);
    }
  
  
    signOut(): void {
      console.log("sign out test");
      this.authService.signOut();
    }
  
    //
    refreshToken(): void {
      this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
    }
  }