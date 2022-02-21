import { AfterViewChecked, AfterViewInit, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';

import { CoUmlHubService } from '../service/couml-hub.service';



// /**
//  * https://github.com/typed-mxgraph/typed-mxgraph
//  */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements AfterViewChecked {

  ip: string;
  top:string = "top: 100px;";

	constructor(
    private _coUmlHub: CoUmlHubService,
    private _renderer: Renderer2
    ) {

  }

  //Gets the height of the menu and sets the top to the hight
  // so that the edit board and the menu always meet.
  // the menu height changes based on the browser settings so static values do not help
  ngAfterViewChecked(): void {
    var height = `${this._menu.nativeElement.offsetHeight}px`;
    this._renderer.setStyle(this._workspace.nativeElement, "top", height);
  }

  @ViewChild('appmenu') _menu: ElementRef;
  @ViewChild('appworkspace') _workspace: ElementRef;
}


