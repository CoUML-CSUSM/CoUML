import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalR";

@Injectable({
	providedIn: "root"
})
export class CoUmlHubService{
	private coUmlHubConnection: signalR.HubConnection;
	private _url = 'https://localhost:5001/couml';

	constructor()
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
				.then(()=> console.log(`Connections started with URL: ${this._url}`))
				.catch((err) => console.log('Error while starting connection: ' + err));

		this.coUmlHubConnection.on("testInterfaceMethod", (responce)=>{
			console.log(`testing responce: ${responce}`);
		});
	}
}