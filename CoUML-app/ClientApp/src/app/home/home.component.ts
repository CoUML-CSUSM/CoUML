import { AfterViewChecked, AfterViewInit, Component as AngularComponent, ElementRef, Renderer2, ViewChild} from '@angular/core';
import { ProjectManager } from '../controller/project-manager.controller';
import { CoUmlHubService } from '../service/couml-hub.service';


@AngularComponent({
	selector: 'app-home',
	templateUrl: './home.component.html',
})
export class HomeComponent {

	ip: string;
	showNewDiagramDialog: boolean = false;

	showInviteDialog: boolean = false;

	value1: string;
	value2: string;

	constructor(
		private _projectManager: ProjectManager,
		private _renderer: Renderer2
	) {
		console.log("HomeComponent\n", this, "\nwith\n", arguments);
	 }

	onOpen(event)
	{
		this.showNewDiagramDialog = event;
	}

	onInvite(event)
	{
		this.showInviteDialog = event;
	}

	public create(dId:string){

		this._projectManager.generate(dId);
		this.showNewDiagramDialog = false;
	}
	
	public test(){
		console.log("test");
	}

	public invite(uId:string){
		this._projectManager.invite(uId);
		this.showInviteDialog = false;
	}
}


