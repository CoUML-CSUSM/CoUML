import { Injectable } from '@angular/core';
import  * as SignalR from '@microsoft/signalr';
import {MessageService} from 'primeng/api';
import { ProjectDeveloper } from '../controller/project-developer.controller';
import { ProjectManager } from '../controller/project-manager.controller';
import { environment } from '../../environments/environment';
import { Assembler, ChangeRecord, User, Diagram, DiagramDataSet } from 'src/models/DiagramModel';
import { TeamActivityComponent } from '../activity/team-activity.component'; 
import { saveAs } from 'file-saver';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, of, pipe, zip } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators'


@Injectable({ providedIn: 'root' })
export class CoUmlHubService{

	
	private _coUmlHubConnection: SignalR.HubConnection;
	
	private _url = environment.apiUrl + "/couml";

	public _projectDeveloper: ProjectDeveloper = null;
	public _projectManager: ProjectManager = null;
	public _teamActivity: TeamActivityComponent = null; 

	constructor(
		private _toastMessageService: MessageService,
		private http: HttpClient
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
		// this._coUmlHubConnection.on("FUnction", (responce)=>{ 
			
		// 	console.log(fileName);
		// });
	}


	set teamActivity(cam: TeamActivityComponent)
	{
		this._teamActivity = cam;

		// listen for Team Cativity
		this._coUmlHubConnection.on("JoinedTeam", (value)=>{ 
			console.log("join", value)
			this._teamActivity.joinTeam(Assembler.assembleUmlElement( JSON.parse(value)));
		});

		this._coUmlHubConnection.on("LeftTeam", (value)=>{ 
			this._teamActivity.leaveTeam(Assembler.assembleUmlElement(JSON.parse(value)));
		});

		this._coUmlHubConnection.on("InitTeam", (value)=>{
			let teamMemebers: User[] = Assembler.assembleUmlElements(value);
			console.log("hub init team", value, teamMemebers);
			this._teamActivity.initTeam(teamMemebers);
		});
	}

	private startConnection()
	{
		console.log(`CoUmlHubService::startConnection()`);

		this._coUmlHubConnection
				.start()
				.then(()=>{ 
					console.log(CoUmlHubService.name,"startConnection", `Connections started with URL: ${this._url}`);
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

	generateSourceCode(language: number = 0): Promise<string> 
	{
		// TODO: language number should be enum | lang.Java = 0
		return this._coUmlHubConnection.invoke<string>("GenerateSourceCode", language);
	}

	downloadZip(filePath: string)
	{
		let downloadUrl = `${environment.apiUrl}/downloadZip?fileName=${filePath}`;

		return this.http.get(downloadUrl, { responseType: 'blob' }).subscribe(zipBlob=> saveAs(zipBlob,filePath));
	}

	generateJson() {
		return this._coUmlHubConnection.invoke<string>("GenerateJson");
	}
	
	downloadJson(filePath: string)
	{
		let downloadUrl = `${environment.apiUrl}/downloadJson?fileName=${filePath}`;

		return this.http.get(downloadUrl, { responseType: 'blob' }).subscribe(zipBlob=> saveAs(zipBlob,filePath));
	}

	uploadFile(jsonFile: File): Promise<string>
	{
		let uploadUrl = `${environment.apiUrl}/uploadJson`;
		const formData = new FormData();
		formData.append('file', jsonFile, jsonFile.name);

		return new Promise<string>((resolve, reject)=>{

			this.http.post(uploadUrl, formData, {reportProgress: true, observe: 'events'}).subscribe({
				next: (event)=>{
					if(event.type == HttpEventType.Response)
						this._coUmlHubConnection.invoke<string>("GenerateProjectFromJsonFile", event.body["dbPath"]).then(dId=>
								resolve(dId)
							);
					console.log("Upload File Event\n\n", event)

				}
			})
		})
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

	/**
	 * 
	 * @param dId the diagram "name"
	 * @returns the _id of the diagram in the DB
	 */
	public generate(dId:string): Promise<string>
	{
		return this._coUmlHubConnection.invoke("Generate",dId);
	}

	/**
	 * 
	 * @param diagramJson the JSON of a diagram
	 * @returns the _id of the diagram in the DB
	 */
	public generateProjectFromDiagram(diagramJson: string): Promise<string> {
		return this._coUmlHubConnection.invoke<string>("GenerateProjectFromDiagram", diagramJson);
	}


	public logIn(uId: string): Promise<string>{
		return this._coUmlHubConnection.invoke("LogIn",uId);
	}

	public logOut()
	{
		this._coUmlHubConnection.invoke("LogOut");
	}

	public invite(uId: string): Promise<boolean>
	{
		return  this._coUmlHubConnection.invoke<boolean>("Invite", uId);
	}

}
