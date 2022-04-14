import { Injectable } from '@angular/core';
import  * as SignalR from '@microsoft/signalr';
import { ProjectDeveloper } from '../controller/project-developer.controller';
import { ProjectManager } from '../controller/project-manager.controller';
import { environment } from '../../environments/environment';
import { Assembler, ChangeRecord, User, Diagram, DiagramDataSet } from 'src/models/DiagramModel';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
import { waitForAsync } from '@angular/core/testing';


@Injectable()
export class CoUmlHubService{

	private _coUmlHubConnection: SignalR.HubConnection;
	
	private _url = environment.apiUrl + "/couml";

	public _projectDeveloper: ProjectDeveloper = null;
	public _projectManager: ProjectManager = null;

	constructor(){
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
		if(subscriber instanceof ProjectDeveloper){

			this._projectDeveloper = subscriber;
		}
		else if(subscriber instanceof ProjectManager)
			this._projectManager  = subscriber;
		
		
	}


	private startConnection()
	{
		console.log(`CoUmlHubService::startConnection()`);

		this._coUmlHubConnection
				.start()
				.then(()=> console.log(CoUmlHubService.name,"startConnection", `Connections started with URL: ${this._url}`))
				.catch((err) => console.log(CoUmlHubService.name,"startConnection",'Error while starting connection: ' + err));

		// listen for *test*
		this._coUmlHubConnection.on("issueUser", (userId: string)=>{
			console.log(`New User ID issued ${userId}`);
		});

		// listen for changes
		this._coUmlHubConnection.on("Dispatch", (changesDTO)=>{
			console.log(`
			hub.dispathch(changes)
				${changesDTO}
				`);
			let changes: ChangeRecord[] = JSON.parse(changesDTO);
			this.dispatch(changes);
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

	/**
	 * changes are despatched from the server to a client
	 * @param changes changes to be applied to this client
	 */
	public dispatch(changes: ChangeRecord[])
	{
		
		if(this._projectDeveloper){
			changes.forEach((change)=>{
				change.value = Assembler.assembleUmlElement(change.value);
				console.log("assembled change");
				console.log(change);
			});
			this._projectDeveloper.applyChanges(changes);
		}
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
			console.log("hub");
			console.log(dId);
		return this._coUmlHubConnection.invoke("Generate",dId);
	}

	public register(uId: string){
		this._coUmlHubConnection.invoke("LogIn",uId);
	}

	public invite(uId: string){
		this._coUmlHubConnection.invoke("Invite", uId);
	}

}
