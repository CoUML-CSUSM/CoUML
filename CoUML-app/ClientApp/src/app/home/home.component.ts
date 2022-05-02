import { AfterViewChecked, AfterViewInit, Component as AngularComponent, ElementRef, Renderer2, ViewChild} from '@angular/core';
import { ProjectManager } from '../controller/project-manager.controller';
import { CoUmlHubService } from '../service/couml-hub.service';


@AngularComponent({
	selector: 'app-home',
	templateUrl: './home.component.html',
})
export class HomeComponent {


	constructor( ) {
		console.log("HomeComponent\n", this, "\nwith\n", arguments);
	 }
}


