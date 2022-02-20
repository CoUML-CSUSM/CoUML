import { Component } from '@angular/core';

import { CoUmlHubService } from '../service/couml-hub.service';



// /**
//  * https://github.com/typed-mxgraph/typed-mxgraph
//  */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {


  ip: string;

	constructor(public _coUmlHub: CoUmlHubService) {}

  break()
  {
    this._coUmlHub.triggerBreakPoint();
  }


}


