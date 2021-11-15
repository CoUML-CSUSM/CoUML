import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { CoUmlHubService } from './service/couml-hub.service';
import {ButtonModule} from 'primeng/button';

@NgModule({
    imports: [
        AppModule,
        ServerModule, 
        ModuleMapLoaderModule,


        /**
         * PrimeNG imported components
         */
        ButtonModule

    ],
    declarations: [



    ],
    providers: [
        /**
         * CoUML Components
         */
         CoUmlHubService,
         
    ],
    bootstrap: [AppComponent]
})
export class AppServerModule { }
