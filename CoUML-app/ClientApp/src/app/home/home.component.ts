import { AfterViewChecked, AfterViewInit, Component as AngularComponent, ElementRef, Renderer2, ViewChild} from '@angular/core';
import { CoUmlHubService } from '../service/couml-hub.service';


@AngularComponent({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  ip: string;
  showNewDiagramDialog: boolean = false;
  value1: string;

	constructor(
    private _coUmlHub: CoUmlHubService,
    private _renderer: Renderer2
  ) { }

  onOpen(event)
  {
    this.showNewDiagramDialog = event;
  }

  public create(dId:string){
    console.log("home");
    console.log(dId);
    this._coUmlHub._projectManager.generate(dId);
    console.log("generated");
    console.log("opeining");
    this._coUmlHub._projectDeveloper.open(dId);
     console.log("opened");
     this.showNewDiagramDialog = false;
  }
  
  public test(){
    console.log("test");
  }
}


