import {Component} from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import { CoUmlHubService } from 'src/app/service/couml-hub.service';

@Component({
    templateUrl: './diagram-table.component.html',
})
export class DiagramTableComponent {

    diagrams;


    constructor(
        private _coUmlHub: CoUmlHubService,
        public ref: DynamicDialogRef, 
        public config: DynamicDialogConfig,
        ) { }

    ngOnInit() {
        //id: this.config.id
        this._coUmlHub.listMyDiagrams(this.config.data.id).then(diagramList => this.diagrams = diagramList);
    }

    fetchDiagram(_id: string) {
        this.ref.close(_id);
    }
}