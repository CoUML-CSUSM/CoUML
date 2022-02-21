import { Component, ElementRef, ViewChild} from '@angular/core';

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

  // @ViewChild('appmenu')
  // _menu: ElementRef;

  // get top (){
  //   let top =  "top: " + (this._menu?.nativeElement?.offsetHeight | "72" as any) + "px;";
  //   console.log(top);
  //   return top;
  // }
}


