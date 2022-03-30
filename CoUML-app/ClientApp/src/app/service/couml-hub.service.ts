import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ProjectDeveloper } from '../controller/project-developer.controller';
import { ProjectManager } from '../controller/project-manager.controller';
import { environment } from '../../environments/environment';
import { Assembler, ChangeRecord, User, Diagram } from 'src/models/DiagramModel';


@Injectable()
export class CoUmlHubService{
	private _coUmlHubConnection: HubConnection;
	
	private _url = environment.apiUrl + "/couml";

	public _projectDeveloper: ProjectDeveloper = null;
	public _projectManager: ProjectManager = null;

	constructor(){
		this._coUmlHubConnection = new HubConnectionBuilder()
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
			//console.log(`New User ID issued ${userId}`);
		});

		// listen for changes
		this._coUmlHubConnection.on("Dispatch", (changesDTO)=>{
			let changes = JSON.parse(changesDTO);
			console.log(changes);
			this.dispatch(changes);
		});
	}

	/**
	 * diagram is fetched from server
	 * @param dId get Diagram from server
	 * @returns 
	 */
	public fetch(dId: string ): Promise<string>
	{

		// calling function : public string Fetch(string dId)
		//return this._coUmlHubConnection.invoke<string>('Fetch','test'); // test diagram

		//move this line and change new user to email adress
		//this._projectDeveloper.setEditor(new User(this._coUmlHubConnection.connectionId));
		return this._coUmlHubConnection.invoke<string>('Fetch',dId); 
	}

	/**
	 * Changes are commited from client to server
	 * @param changes 
	 */
	public commit(changes: ChangeRecord[])
	{
		let changesDTO = JSON.stringify(changes)
		this._coUmlHubConnection.invoke("Push", 'test', changesDTO);
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
			});
			this._projectDeveloper.applyChanges(changes);

		}
	}


	/// for test only!!!!
	public triggerBreakPoint()
	{
		this._coUmlHubConnection.invoke("TriggerBreakPoint");
	}


	public generate(Did:string)
	{
		console.log("hub");
    	console.log(Did);
		this._coUmlHubConnection.invoke("Generate",Did);
	}

	//sends document text over to c#
	public send(Did:string, projectDiagram: Diagram){
		let changeDiagram = JSON.stringify(projectDiagram)
		this._coUmlHubConnection.invoke("Send",Did,changeDiagram);
	}

}
