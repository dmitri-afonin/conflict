import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../../environments/environment";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFireAnalyticsModule} from "@angular/fire/compat/analytics";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ServiceWorkerModule} from "@angular/service-worker";



@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireAnalyticsModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
  ]
})
export class CoreModule { }
