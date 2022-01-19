import { Injectable } from '@angular/core';
// import * as signalR from "@microsoft/signalR";
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
// import { Diagram } from 'src/models/DiagramModel';
import * as Automerge from 'automerge';
import { ProjectDeveloper } from '../controller/project-developer.controller';


@Injectable()
export class CoUmlHubService{
	private _coUmlHubConnection: HubConnection;
	private _url = 'https://localhost:5001/couml';

	public log: ConsoleLogger;
	private _projectDeveloper: ProjectDeveloper = null;

	constructor()
	{
		this.log = new ConsoleLogger();
		this._coUmlHubConnection = new HubConnectionBuilder()
				.withUrl(this._url)
				.build();
		this.startConnection();
	}

	public subscribe(projectDeveloper: ProjectDeveloper): void
	{
		if(!this._projectDeveloper)
			this._projectDeveloper = projectDeveloper;
	}

	public startConnection()
	{
		console.log(`CoUmlHubService::startConnection()`);

		this._coUmlHubConnection
				.start()
				.then(()=> this.log.log(CoUmlHubService.name,"startConnection", `Connections started with URL: ${this._url}`))
				.catch((err) => this.log.log(CoUmlHubService.name,"startConnection",'Error while starting connection: ' + err));

		// listen for *test*
		this._coUmlHubConnection.on("testInterfaceMethod", (response: string)=>{
			console.log(`testing responce: ${response}`);
		});

		// listen for changes
		this._coUmlHubConnection.on("Dispatch", (changes)=>{
			this.dispatch(changes);
		});
	}

	/**
	 * 
	 * @param dId get Diagram from server
	 * @returns 
	 */
	public fetch(dId: string ): Promise<string>
	{
		// calling function : public string Fetch(string dId)
		return this._coUmlHubConnection.invoke<string>('Fetch','test'); // test diagram
		// return this._coUmlHubConnection.invoke<Diagram>('Fetch',dId); 
		// return new Promise<string>(()=>"test");
	}

	public commit(changes: Automerge.BinaryChange[])
	{
		this.log.log(CoUmlHubService.name, "commit")
		this._coUmlHubConnection.invoke("Push", 'test', changes);
	}

	public dispatch(changes: Automerge.BinaryChange[])
	{
		if(this._projectDeveloper)
			this._projectDeveloper.applyChange(changes);
	}


	public triggerBreakPoint()
	{
		this._coUmlHubConnection.invoke("TriggerBreakPoint");
	}


}

export class ConsoleLogger{
	public log(className: string, functionName: string, message?){
		let format = "color: HotPink; font-size:1.25em;"
		console.log("%c%s::%s(...)\n\t%s",format, className, functionName);
		console.log(message, 2, undefined);
	}
}


/*

for (int i = 0; i< n;i++){...}

forEach( (i:int) => {...} );
*/