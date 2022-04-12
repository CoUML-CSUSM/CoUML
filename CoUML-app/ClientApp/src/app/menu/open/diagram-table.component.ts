import {Component} from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import { CoUmlHubService } from 'src/app/service/couml-hub.service';
import { DiagramDataSet } from 'src/models/DiagramModel';

@Component({
    templateUrl: './diagram-table.component.html',
})
export class DiagramTableComponent {

    _diagramDataSets: DiagramDataSet[] = [
        {
            id: "something...",
            _id: "Went wrong in promise?"
        }
    ];


    constructor(
        private _coUmlHub: CoUmlHubService,
        public ref: DynamicDialogRef, 
        public config: DynamicDialogConfig,
        ) { }

    ngOnInit() {
        //id: this.config.id
        this._coUmlHub.listMyDiagrams()
            .then((diagramList) => {
                this._diagramDataSets = JSON.parse (diagramList);
                console.log(diagramList);
                console.log(this._diagramDataSets);
            } );
    }

    select(diagramData: DiagramDataSet) {
        this.ref.close(diagramData);
    }
}