import {Component} from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import { CoUmlHubService } from 'src/app/service/couml-hub.service';
import { FileReaderUtility } from 'src/app/service/file-reader.utility';
import { DiagramDataSet } from 'src/models/DiagramModel';

@Component({
templateUrl: './upload.component.html',
})
export class UploadComponent {


	constructor(
		public ref: DynamicDialogRef, 
		public config: DynamicDialogConfig,
		) { 
			console.log("UploadComponent\n", this, "\nwith\n", arguments);
		}

	onUpload(event)
	{
		this.ref.close(event.files?.pop());
	}
}