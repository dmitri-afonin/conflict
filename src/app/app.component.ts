import {Component} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from 'firebase/compat/app';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user: any = null;
  constructor(
    public auth: AngularFireAuth,
    public router: Router
  ) {
    this.auth.user.subscribe(s => {
      this.user = s;
    });
  }
  home(): void {
    this.router.navigate(['/']);
  }

  loginGuest(): void {
    this.auth.signInAnonymously();
  }

  loginGoogle(): void {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout(): void {
    this.auth.signOut();
  }

}
