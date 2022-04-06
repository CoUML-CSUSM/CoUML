import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { BrowserAnimationsModule } from "@angular/platform-browser/animations"


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { EditorComponent } from './editor/editor.component';
import { ProjectMenuComponent } from './menu/project-menu.component';


import { CoUmlHubService } from './service/couml-hub.service';

/*PrimeNG Imported modules */
import { ButtonModule } from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {CheckboxModule} from 'primeng/checkbox';
import {MenubarModule} from 'primeng/menubar';

import {TabViewModule} from 'primeng/tabview';
import {DialogModule} from 'primeng/dialog';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';

// social login
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider
} from 'angularx-social-login';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EditorComponent,
    ProjectMenuComponent,


  ],

  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      // { path: 'counter', component: CounterComponent },
      // { path: 'fetch-data', component: FetchDataComponent },
    ]),


    /* primeng */
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    MenubarModule,
    TabViewModule,
    DialogModule,

    MessagesModule,
    MessageModule,


    //login
    SocialLoginModule,

    BrowserAnimationsModule
  ],
  providers: [

    CoUmlHubService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true, //keeps the user signed in
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('174000524733-gq2vagupknm77i794hll3kbs3iupm6fu.apps.googleusercontent.com') // your client id
          },
        ],
      } as SocialAuthServiceConfig,
    },

  ],
  bootstrap: [AppComponent],

  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
