import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CoUmlHubService } from '../service/couml-hub.service';


/**
 * https://github.com/typed-mxgraph/typed-mxgraph
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {


	constructor(public coUmlConnection: CoUmlHubService) {}

	public connectPButton(){
		console.log(`HomeComponent::connectPButton(e)`);
		this.coUmlConnection.startConnection();
	}
	
}

