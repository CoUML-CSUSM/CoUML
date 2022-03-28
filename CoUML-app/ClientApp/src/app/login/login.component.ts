import { AfterViewInit, Component as AngularComponent, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { SocialAuthService } from "angularx-social-login";
import {GoogleLoginProvider } from "angularx-social-login";

@AngularComponent({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements AfterViewInit {

  constructor(private authService: SocialAuthService) { }
    ngAfterViewInit(): void {
        //throw new Error('Method not implemented.');
    }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
/*

  signOut(): void {
    this.authService.signOut();
  }

  //
  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }
*/
}