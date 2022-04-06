import {Component} from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';

@Component({
    templateUrl: './carslistdemo.html',
})
export class DiagramTableComponent {

	diagrams = [
        {
            id: "hello world",
            _id: "916d8889-f46e-46f4-98e7-9793f294957b"
        }, 
        {
            id: "hello void",
            _id: "dbf6b814-185c-4e9e-a963-776e5c549f89"
        },
        {
            id: "hello antivoid",
            _id: "9d53558b-2c0f-4d48-9ba7-7eb7d705e0ba"
        },
        {
            id: "goodby world",
            _id: "548618a3-b598-4f3f-9b5d-96d54696c161"
        } ];


    constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

    ngOnInit() {
        //id: this.config.id
        // this.carService.getCarsSmall(id).then(cars => this.cars = cars);
    }

    fetchDiagram(_id: string) {
        this.ref.close(_id);
    }
}