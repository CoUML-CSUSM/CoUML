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
  providers: [ProjectManager, ProjectDeveloper],
})


export class HomeComponent {

  ip: string;
  geeks: boolean = false;
  value1: string;


	constructor(
    private _coUmlHub: CoUmlHubService,
    private _renderer: Renderer2,
    private _projectManager: ProjectManager,
    private _projectDeveloper: ProjectDeveloper,
     //private _projectDiagram: Diagram, //idk
    // private _diagramEditor: EditorComponent//idk
    ) {

  }

  onOpen(
    event
  )
  {
    this.geeks = event;
  }

  public create(dId:string){
    console.log("home");
    console.log(dId);
    this._projectManager.generate(dId);
    console.log("generated");
    //this._coUmlHub.fetch(dId);
    //somethign to cler the diagram here or something
    console.log("opeining");
    this._projectDeveloper.open(dId);
    
    // this._coUmlHub.fetch( dId ) //get diagram from server
		// 	.then( (d) => {
		// 		//this._coUmlHub.subscribe(this);
		// 		console.log(d);
		// 		this._projectDiagram = Assembler.assembleDiagram(d);
		// 		console.log(this._projectDiagram);
		// 		this._diagramEditor.draw();
		// 	} ); 
     console.log("opened");
  }
  
  public test(){
    console.log("test");
  }
}


