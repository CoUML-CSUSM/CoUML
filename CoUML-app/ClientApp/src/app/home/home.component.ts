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
  geeks: boolean = false;
  value1: string;

	constructor(
    private _coUmlHub: CoUmlHubService,
    private _renderer: Renderer2
    ) {

  }

  onOpen(
    event
  )
  {
    this.geeks = event;
  }

}


