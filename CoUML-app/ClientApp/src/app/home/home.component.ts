import { AfterViewChecked, AfterViewInit, Component as AngularComponent, ElementRef, Renderer2, ViewChild} from '@angular/core';
import { Diagram } from 'src/models/Diagram';//idk
import { Assembler } from 'src/models/DiagramModel';//idk
import { ProjectDeveloper } from '../controller/project-developer.controller';
import { ProjectManager } from '../controller/project-manager.controller';
import { EditorComponent } from '../editor/editor.component';

import { CoUmlHubService } from '../service/couml-hub.service';



// /**
//  * https://github.com/typed-mxgraph/typed-mxgraph
//  */
// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
// })


@AngularComponent({
  selector: 'app-home',
  templateUrl: './home.component.html',
  // providers: [ProjectManager, ProjectDeveloper],
})
export class HomeComponent {

  ip: string;
  showNewDiagramDialog: boolean = false;
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
    this.showNewDiagramDialog = event;
  }

  public create(dId:string){

		console.log("test editor");
        console.log(this._coUmlHub._projectDeveloper._editor.id);
        console.log("test done");

    console.log("home");
    console.log(dId);
    this._coUmlHub._projectManager.generate(dId,this._coUmlHub._projectDeveloper._editor.id);
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


