import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatCardModule} from "@angular/material/card";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CoreModule} from "./core/core.module";
import {CommonModule} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    AppRoutingModule,
    MatCardModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatListModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
