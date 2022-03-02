import { AfterViewChecked, AfterViewInit, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';

import { CoUmlHubService } from '../service/couml-hub.service';



// /**
//  * https://github.com/typed-mxgraph/typed-mxgraph
//  */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})

export class HomeComponent {

  ip: string;
  top:string = "top: 100px;";

	constructor(
    private _coUmlHub: CoUmlHubService,
    private _renderer: Renderer2
    ) {

  }

}


