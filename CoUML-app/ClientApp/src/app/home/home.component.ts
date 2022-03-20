import { AfterViewChecked, AfterViewInit, Component as AngularComponent, ElementRef, Renderer2, ViewChild} from '@angular/core';
import { ProjectDeveloper } from '../controller/project-developer.controller';
import { ProjectManager } from '../controller/project-manager.controller';

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
    private _projectDeveloper: ProjectDeveloper
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
    //somethign to cler the diagram here or something
    //this._projectDeveloper.open(dId);
  }
  
  public test(){
    console.log("test");
  }
}


