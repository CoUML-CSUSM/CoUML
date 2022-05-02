import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { CoUmlHubService } from './service/couml-hub.service';


import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {CheckboxModule} from 'primeng/checkbox';

@NgModule({
    imports: [
        AppModule,
        ServerModule, 
        ModuleMapLoaderModule,
    ],
    declarations: [
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class AppServerModule { }
