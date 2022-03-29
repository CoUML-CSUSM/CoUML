import { AfterViewInit, Component as AngularComponent, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
 import { SocialAuthService, SocialUser } from "angularx-social-login";
 import {GoogleLoginProvider } from "angularx-social-login";

@AngularComponent({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements AfterViewInit {

   constructor(private authService: SocialAuthService) { }
  //constructor() { }
    ngAfterViewInit(): void {
        //throw new Error('Method not implemented.');
    }

  signInWithGoogle(): void {
    console.log("sign in test");
    let int = "hello";
    console.log(`${int}`);

    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
    .then((socialUser)=>{//store email here nd send it to databse
      console.log(socialUser.email);
    });

    //console.log(`${GoogleLoginProvider.PROVIDER_ID}`);
  }


  signOut(): void {
    console.log("sign out test");
    this.authService.signOut();
  }

  //
  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }
}