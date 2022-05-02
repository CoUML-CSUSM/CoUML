import {Component} from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import { CoUmlHubService } from 'src/app/service/couml-hub.service';
import { DiagramDataSet } from 'src/models/DiagramModel';

@Component({
templateUrl: './upload.component.html',
})
export class UploadComponent {

	uploadedDiagramJsons: any[] = [];

	constructor(
		// private _coUmlHub: CoUmlHubService,
		public ref: DynamicDialogRef, 
		public config: DynamicDialogConfig,
		) { 
			console.log("UploadComponent\n", this, "\nwith\n", arguments);
		}

	ngOnInit()
	{

	}

	onUpload(event) {
		for( let file of event.files){
			this.ref.close(file);
		    this.uploadedDiagramJsons.push(file);
		}
	}
    

	// select(diagramData: DiagramDataSet) {
	// 	this.ref.close(diagramData);
	// }
}