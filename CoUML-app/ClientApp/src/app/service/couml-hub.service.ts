import { Injectable } from '@angular/core';
import  * as SignalR from '@microsoft/signalr';
import {MessageService} from 'primeng/api';
import { ProjectDeveloper } from '../controller/project-developer.controller';
import { ProjectManager } from '../controller/project-manager.controller';
import { environment } from '../../environments/environment';
import { Assembler, ChangeRecord, User, Diagram, DiagramDataSet } from 'src/models/DiagramModel';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
import { waitForAsync } from '@angular/core/testing';
import { TeamActivityComponent } from '../activity/team-activity.component'; 


@Injectable({ providedIn: 'root' })
export class CoUmlHubService{

	private _coUmlHubConnection: SignalR.HubConnection;
	
	private _url = environment.apiUrl + "/couml";

	public _projectDeveloper: ProjectDeveloper = null;
	public _projectManager: ProjectManager = null;
	public _teamActivity: TeamActivityComponent = null; 

	constructor(
		private _toastMessageService: MessageService
	){
		console.log("CoUmlHubService\n", this, "\nwith\n", arguments);
		this._coUmlHubConnection = new SignalR.HubConnectionBuilder()
			.withUrl(this._url)
			.build();
		this.startConnection();
	}

	/**
	 * 2 way comunication between hub and  developer
	 * @param subscriber 
	 */
	public subscribe(subscriber: any): void
	{
		switch(true)
		{
			case subscriber instanceof ProjectDeveloper: 
				this.projectDeveloper = subscriber; break;
			case subscriber instanceof ProjectManager:
				this.projectManager  = subscriber; break;
			case subscriber instanceof TeamActivityComponent:
				this.teamActivity  = subscriber; break;
		}
	}

	set projectDeveloper(pd: ProjectDeveloper)
	{
		this._projectDeveloper = pd;

		// listen for changes
		this._coUmlHubConnection.on("Dispatch", (changesDTO)=>{
			let changes: ChangeRecord[] = JSON.parse(changesDTO);
			changes.forEach((change)=>{
				change.value = Assembler.assembleUmlElement(change.value);
			});
			this._projectDeveloper.applyChanges(changes);
		});
	}

	set projectManager(pm: ProjectManager)
	{
		this._projectManager = pm;
		// listen for changes
		// this._coUmlHubConnection.on("function", (value)=>{ });
	}


	set teamActivity(cam: TeamActivityComponent)
	{
		this._teamActivity = cam;

		// listen for Team Cativity
		this._coUmlHubConnection.on("JoinedTeam", (value)=>{ 
			this._teamActivity.join(Assembler.assembleUmlElement(value));
		});

		this._coUmlHubConnection.on("LeftTeam", (value)=>{ 
			this._teamActivity.leave(Assembler.assembleUmlElement(value))
		});

		this._coUmlHubConnection.on("InitTeam", (value)=>{
			let teamMemebers: User[] = Assembler.assembleUmlElements(value);
			console.log("hub init team", value, teamMemebers);
			this._teamActivity.init(teamMemebers);
		});
	}

	private startConnection()
	{
		console.log(`CoUmlHubService::startConnection()`);

		this._coUmlHubConnection
				.start()
				.then(()=>{ 
					console.log(CoUmlHubService.name,"startConnection", `Connections started with URL: ${this._url}`);
					this._toastMessageService.add({
						severity: 'success',
						summary: 'Wellcome to CoUML!'
					});
				})
				.catch((err) => 
				{
					console.log(CoUmlHubService.name,"startConnection",'Error while starting connection: ' + err);
					console.log(err);
					this._toastMessageService.add({
						severity: 'error',
						summary: 'Unable to secure connection to CoUML',
						detail: err
					});
				});
		// listen for *test*
		this._coUmlHubConnection.on("issueUser", (userId: string)=>{
			console.log(`New User ID issued ${userId}`);
		});

	}


	/**
	 * diagram is fetched from server
	 * @param dId get Diagram from server
	 * @returns 
	 */
	public fetch(dId: string): Promise<string>
	{
		return this._coUmlHubConnection.invoke<string>('Fetch',dId); 
	}

	/**
	 * Changes are commited from client to server
	 * @param changes 
	 */
	public commit(changes: ChangeRecord[])
	{
		let changesDTO = JSON.stringify(changes)
		console.log(changesDTO);
		this._coUmlHubConnection.invoke("Push", changesDTO);
	}

	generateSourceCode(dId: string, language: number = 0): void {
		// TODO: language number should be enum | lang.Java = 0
		this._coUmlHubConnection.invoke("GenerateSourceCode", dId, language);
	}


	/**
	 * looksup the diagrams that a user has access to
	 * @param id the ID of the user
	 * @returns array of diagrams that the user has access to[]
	 */
	listMyDiagrams() {
		return this._coUmlHubConnection.invoke("ListMyDiagrams")
	}


	/// for test only!!!!
	public triggerBreakPoint()
	{
		this._coUmlHubConnection.invoke("TriggerBreakPoint");
	}


	public generate(dId:string): Promise<string>
	{
		return this._coUmlHubConnection.invoke("Generate",dId);
	}

	public loginUser(uId: string){
		let user = new User(uId);
		this._teamActivity?.login(user);
		this._coUmlHubConnection.invoke("LogIn",uId);
	}

	public invite(uId: string){
		this._coUmlHubConnection.invoke("Invite", uId);
	}

}
