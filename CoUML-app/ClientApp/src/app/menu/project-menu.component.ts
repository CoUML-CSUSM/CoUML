import {  AfterViewInit, Component as AngularComponent, EventEmitter,  Output, Renderer2 } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Class, Diagram, Component, Attribute, Interface, Operation, Relationship, RelationshipType, VisibilityType, User, DiagramDataSet } from 'src/models/DiagramModel';
import { ProjectManager } from '../controller/project-manager.controller';
import { CoUmlHubService } from '../service/couml-hub.service';
import { PrimeNGConfig } from "primeng/api";
import { ProjectDeveloper } from '../controller/project-developer.controller';

import { SocialAuthService, SocialUser } from "angularx-social-login";
import {GoogleLoginProvider } from "angularx-social-login";
import { DialogService } from 'primeng/dynamicdialog';
import { DiagramTableComponent } from './open/diagram-table.component';
import { TeamActivityComponent } from '../activity/team-activity.component';
import { InputComponent } from './input/input.component';
import { UploadComponent } from './upload/upload.component';
import { FileUtility } from '../service/file.utility';

	//client id
	//174000524733-gq2vagupknm77i794hll3kbs3iupm6fu.apps.googleusercontent.com

	//client secret
	//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

@AngularComponent({
	selector: 'app-menu',
	templateUrl: './project-menu.component.html',
	styles:[
		`:host ::ng-deep .p-menubar-end{
			display: contents !important ;
		}
		`
	],
	providers: [DialogService]
})
export class ProjectMenuComponent implements AfterViewInit{

	_menuItems: MenuItem[];

	get projectName()
	{
		return this._projectDeveloper?._projectDiagram?.id ?? "< no diagram>";
	}

	constructor(
		private _projectDeveloper: ProjectDeveloper,
		private primengConfig: PrimeNGConfig,
		private authService: SocialAuthService,//login stuff,
		private dialogService: DialogService,//open dialog box
		private _projectManager: ProjectManager,
		private _renderer: Renderer2,
		private _toastMessageService: MessageService
		){
			console.log("ProjectMenuComponent\n", this, "\nwith\n", arguments);
		}

	ngAfterViewInit(){
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
				command: ()=> this.showOpenDiagramDialog(),
			},
			{
				separator:true
			},
			{
				label: "Import",
				items: [
				{
					label: "Diagram as JSON",
					command: () => this.showUploadDialog(),
				}
				]
			},
			{
				label: "Export",
				items: [
				{
					label: "As Java",
					command: () => this.showSourceCodeGenerationDialog(), 
				},
				{
					label: "As Image",
					command: ()=> this.showImageGenerationDialog(),
				},
				{
					label: "As JSON",
					command: ()=> this.showJsonGenerationDialog(),
				}
				]
			},

		]
		},
		// {
		// 	label: "Edit",
		// 	id: "menuEdit",
		// 	items: []
		// },
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
				},
				{
					label: "Invite User...",
					id: "menuUserSignInvite",
					command: () => this.showInviteDialog(),
				}
			]
		}
		];

	}
	showJsonGenerationDialog(): void {
		if(this._projectDeveloper.isDiagramSet())
			this._projectManager.generateJson();
	}

	showImageGenerationDialog(): void {
		this._projectDeveloper.exportDiagramAsImage();
	}

	showSourceCodeGenerationDialog(): void {
		if(this._projectDeveloper.isDiagramSet())
		{
			this._toastMessageService.add({
				severity: 'info',
				summary: `Generating source code for ${this._projectDeveloper._projectDiagram?.id}. Please be pacient, this may take several minutes.`,
			});
			this._projectManager.generateSourceCode().then(done=>{
				this._toastMessageService.add({
					severity: "info",
					summary: "File ready for download.",
				})

			}).catch(reject=>
				this._toastMessageService.add({
					severity: 'error',
					summary: `Cannot generate source code package`
				})

			);
		}else{
			this._toastMessageService.add({
				severity: 'error',
				summary: `Cannot generate source code package`
			});
		}
	}

	
	//pop up
	ngOnInit() {
		this.primengConfig.ripple = true;
	}
	

	//login stuff
	signInWithGoogle(): void
	{
		console.log("sign in");
	
		this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
			.then((socialUser)=>{//store email here nd send it to databse
				this._projectDeveloper.logIn(socialUser.email);
			});
	}
	
	signOut(): void 
	{
		console.log("sign out");
		this.authService.signOut();
		this._projectDeveloper.logOut();
	}
	
	//
	refreshToken(): void {
		this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
	}

	/**
	 * opens a dialog to let the user select from diagrams they hae access to.
	 */
	showOpenDiagramDialog(): void
	{
		if(this._projectDeveloper._teamActivity.isLoggedIn())
		{
			const openDiagramDialog = this.dialogService.open(DiagramTableComponent, {
				header: 'Choose a Diagram',
				width: '70%'
			});
		
			// string of the _id is returned to indicate the user's selection
			openDiagramDialog.onClose.subscribe((diagram: DiagramDataSet) => {
				if (diagram) {//diagram is the dataset of the chosen diagram
				console.log(diagram);
				this._projectDeveloper.open(diagram._id);
				}
			});
		}
	}

	public showInviteDialog()
	{

		if(this._projectDeveloper._teamActivity.isLoggedIn())
		{
			const openDiagramDialog = this.dialogService.open(InputComponent, {
				header: 'Invite Team Memeber',
			});
		
			// string of the _id is returned to indicate the user's selection
			openDiagramDialog.onClose.subscribe((userId: string) => {
				if (userId) {//diagram is the dataset of the chosen diagram
				console.log(userId);
					this._projectManager.invite(userId).then(invited=>{
							if(invited)
								this._toastMessageService.add({
									severity: 'info',
									summary: `${userId} has been invited to collaberate on ${this._projectDeveloper._projectDiagram.id}`,
								});
							else
								this._toastMessageService.add({
									severity: 'error',
									summary: `${userId}`
								});
						});

				}
			});
		}
	}

	public showUploadDialog()
	{
		if(this._projectDeveloper._teamActivity.isLoggedIn())
		{
			const uploadDiagramDialog = this.dialogService.open(UploadComponent, {
				header: 'Upload Diagram JSON',
			});
		
			// string of the _id is returned to indicate the user's selection
			uploadDiagramDialog.onClose.subscribe((jsonFile: File) => {
				if (jsonFile) {
					FileUtility.read(jsonFile).then((diagramJson: string)=>{
						this._projectManager.upload(diagramJson).then((dId)=>{
							this._projectDeveloper.open(dId)
						}).catch(rejection=>{
							this._toastMessageService.add({
								severity: 'error',
								summary: rejection
							});
						});
					});
				}
			});
		}
	}

	public showNewDiagramDialog()
	{
		if(this._projectDeveloper._teamActivity.isLoggedIn())
		{
			const openDiagramDialog = this.dialogService.open(InputComponent, {
				header: 'New Diagram',
			});
		
			// string of the _id is returned to indicate the user's selection
			openDiagramDialog.onClose.subscribe((diagramId: string) => {
				if (diagramId) {//diagram is the dataset of the chosen diagram
				console.log(diagramId);
					this._projectManager.generate(diagramId).then((dId) => 
					{
						if(dId)
							this._projectDeveloper.open(dId);
						else
							console.log(`Project "${dId}" not created.`)
					});
				}
			});
		}
	}
}