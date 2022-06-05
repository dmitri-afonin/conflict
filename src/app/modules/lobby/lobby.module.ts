import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LobbyComponent } from './lobby.component';
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {RouterModule} from "@angular/router";



@NgModule({
  declarations: [
    LobbyComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatListModule,
    MatButtonModule,
    RouterModule.forChild([{path: '', component: LobbyComponent}])
  ]
})
export class LobbyModule { }
