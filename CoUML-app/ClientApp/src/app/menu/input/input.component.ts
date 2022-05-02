import {Component} from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';


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