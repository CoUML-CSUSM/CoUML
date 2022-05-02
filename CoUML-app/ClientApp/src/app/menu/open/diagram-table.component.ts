import {Component} from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import { CoUmlHubService } from 'src/app/service/couml-hub.service';
import { DiagramDataSet } from 'src/models/DiagramModel';

@Component({
templateUrl: './diagram-table.component.html',
})
export class DiagramTableComponent {

	_diagramDataSets: DiagramDataSet[] = null;

	constructor(
		private _coUmlHub: CoUmlHubService,
		public ref: DynamicDialogRef, 
		public config: DynamicDialogConfig,
		) { 
			console.log("DiagramTableComponent\n", this, "\nwith\n", arguments);
		}

	ngOnInit() {
		//id: this.config.id
		this._coUmlHub.listMyDiagrams()
			.then((diagramList) => {
				this._diagramDataSets = diagramList? JSON.parse (diagramList) : null;
			} );
	}

	select(diagramData: DiagramDataSet) {
		this.ref.close(diagramData);
	}
}