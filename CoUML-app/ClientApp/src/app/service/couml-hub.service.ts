import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ProjectDeveloper } from '../controller/project-developer.controller';
import { ProjectManager } from '../controller/project-manager.controller';
import { environment } from '../../environments/environment';
import { Assembler, ChangeRecord, User, Diagram, DiagramDataSet } from 'src/models/DiagramModel';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
import { waitForAsync } from '@angular/core/testing';


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
		let changesDTO = JSON.stringify(changes);
		console.log(`hub.commit(changes)
		${changesDTO}
		`)
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
				console.log("assembled change");
				console.log(change);
			});
			this._projectDeveloper.applyChanges(changes);
		}
	}


	/**
	 * looksup the diagrams that a user has access to
	 * @param id the ID of the user
	 * @returns array of diagrams that the user has access to[]
	 */
     listMyDiagrams(id: any) {

		//returns array of mongodb diagram ids
		console.log("list diagrams");
		console.log(id);
		//get diagram array from cs database
		// let diagrams = this._coUmlHubConnection.invoke("listMyDiagrams",id);
		// let die;
		// let pain = new Promise<DiagramDataSet[]>((resolve)=>{
		// 	resolve([
		// 		{//test one
		// 			id: "name",
		// 			_id: this.getId(id)
		// 		},
		// 		{
		// 			id: "Haikus are",
		// 			_id: "916d8889-f46e-46f4-98e7-9793f29495hw"
		// 		}, 
		// 		{
		// 			id: "easy, but",
		// 			_id: "dbf6b814-185c-4e9e-a963-776e5c549fhv"
		// 		},
		// 		{
		// 			id: "sometimes they",
		// 			_id: "9d53558b-2c0f-4d48-9ba7-7eb7d705e0ha"
		// 		},
		// 		{
		// 			id: "don't make sence",
		// 			_id: "548618a3-b598-4f3f-9b5d-96d54696c1gw"
		// 		}, 
		// 		{
		// 			id: "refrigerator",
		// 			_id: "dbf6b814-185c-4e9e-a963-776e5c549fhv"
		// 		},
		// 		{
		// 			id: "hello antivoid",
		// 			_id: "9d53558b-2c0f-4d48-9ba7-7eb7d705e0ha"
		// 		},
		// 		{
		// 			id: "goodby world",
		// 			_id: "548618a3-b598-4f3f-9b5d-96d54696c1gw"
		// 		} ]);
		// })
		return this._coUmlHubConnection.invoke("listMyDiagrams",id)
		
		// .then((d) => 
		// {
		// 	console.log("promise test");
		// 	console.log(d);
		// 	console.log(JSON.parse(d));
		// 	diagrams = JSON.parse(d);
		// 	die = Assembler.assembleDiagramList(d);
		// 	pain[0] = die;

		// 	// console.log(d[0]);

		// 	// console.log("list of diagrams from the databse");
		// 	// console.log(diagrams);
		// 	// //
			
		// 	// //get names for each mongodb diagram id
		// 	// console.log("get name of diagram");
		// 	// this._coUmlHubConnection.invoke("getName",d[0]).then((d2) => {
		// 	// 	console.log(d2);
		// 	// 	//console.log(d[1]);
		// 	// });	
	
		
		// });

		// die = this._coUmlHubConnection.invoke("listMyDiagrams",id).then(value => {});
		// console.log("post assemble test");
		// console.log(die);
		// return pain;
		// // return this._coUmlHubConnection.invoke("listMyDiagrams",id)((resolve)=>{
		// // 	resolve()
		// // })

		// // TODO: create a function in C# that fulfulls this request
		// //TODO: c# method that returns list of diagrams

		// // TEMPORARRY!!!! returns a sample promise
		// // return new Promise<DiagramDataSet[]>((resolve)=>{
		// // 	resolve([
		// // 		{//test one
		// // 			id: "name",
		// // 			_id: this.getId(id)
		// // 		},
		// // 		{
		// // 			id: "Haikus are",
		// // 			_id: "916d8889-f46e-46f4-98e7-9793f29495hw"
		// // 		}, 
		// // 		{
		// // 			id: "easy, but",
		// // 			_id: "dbf6b814-185c-4e9e-a963-776e5c549fhv"
		// // 		},
		// // 		{
		// // 			id: "sometimes they",
		// // 			_id: "9d53558b-2c0f-4d48-9ba7-7eb7d705e0ha"
		// // 		},
		// // 		{
		// // 			id: "don't make sence",
		// // 			_id: "548618a3-b598-4f3f-9b5d-96d54696c1gw"
		// // 		}, 
		// // 		{
		// // 			id: "refrigerator",
		// // 			_id: "dbf6b814-185c-4e9e-a963-776e5c549fhv"
		// // 		},
		// // 		{
		// // 			id: "hello antivoid",
		// // 			_id: "9d53558b-2c0f-4d48-9ba7-7eb7d705e0ha"
		// // 		},
		// // 		{
		// // 			id: "goodby world",
		// // 			_id: "548618a3-b598-4f3f-9b5d-96d54696c1gw"
		// // 		} ]);
		// // })
    }

	public getId(id:any) {
		var diagrams = this._coUmlHubConnection.invoke("listMyDiagrams",id).then((d) => {
			console.log("method test");
			console.log(d[0]);
			return d[0];

		});
		return null;
	}

	/// for test only!!!!
	public triggerBreakPoint()
	{
		this._coUmlHubConnection.invoke("TriggerBreakPoint");
	}


	public generate(dId:string,uId:string)
	{
		console.log("hub");
    	console.log(dId);
		this._coUmlHubConnection.invoke("Generate",dId,uId);
	}

	//sends document text over to c#
	public send(Did:string, projectDiagram: Diagram){
		let changeDiagram = JSON.stringify(projectDiagram)
		this._coUmlHubConnection.invoke("Send",Did,changeDiagram);
	}

	public register(uId: string){
		this._coUmlHubConnection.invoke("register",uId);
	}

}
