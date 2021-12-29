import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalR";
import { Diagram } from 'src/models/Diagram';
import * as Automerge from 'automerge';


@Injectable({
	providedIn: "root"
})
export class CoUmlHubService{
	private coUmlHubConnection: signalR.HubConnection;
	private _url = 'https://localhost:5001/couml';

	constructor(public log: ConsoleLogger)
	{
		this.coUmlHubConnection = new signalR.HubConnectionBuilder()
				.withUrl(this._url)
				.build();
	}

	public startConnection()
	{
		console.log(`CoUmlHubService::startConnection()`);

		this.coUmlHubConnection
				.start()
				.then(()=> this.log.log(CoUmlHubService.name,"startConnection", `Connections started with URL: ${this._url}`))
				.catch((err) => this.log.log(CoUmlHubService.name,"startConnection",'Error while starting connection: ' + err));

		this.coUmlHubConnection.on("testInterfaceMethod", (responce)=>{
			console.log(`testing responce: ${responce}`);
		});
	}

	public openDiagram(): Promise<Diagram>
	{
		//function prototype::	public Daigram GetDiagram( string projectDiagramName){...}
		let diagram: Diagram;
		return this.coUmlHubConnection.invoke<Diagram>('GetDiagram','test')
	}

	public commit(changes: Automerge.BinaryChange[])
	{
		this.log.log(CoUmlHubService.name, "commit")
		this.coUmlHubConnection.invoke("Push", changes);
	}

}

export class ConsoleLogger{
	public log(className: string, functionName: string, message?){
		let format = "color: HotPink; font-size:1.25em;"
		console.log("%c%s::%s(...)\n\t%s",format, className, functionName);
		console.log(message, 2, undefined);
	}
}
