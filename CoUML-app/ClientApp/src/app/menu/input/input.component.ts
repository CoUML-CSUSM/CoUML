import {Component} from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import { CoUmlHubService } from 'src/app/service/couml-hub.service';
import { DiagramDataSet } from 'src/models/DiagramModel';

@Component({
templateUrl: './input.component.html',
})
export class InputComponent {

	input: string;

	constructor(
		public ref: DynamicDialogRef, 
		public config: DynamicDialogConfig,
		) { 
			console.log("InputComponent\n", this, "\nwith\n", arguments);
		}

	ngOnInit() {
	}

	submit(input: string) {
		this.ref.close(input);
	}
}