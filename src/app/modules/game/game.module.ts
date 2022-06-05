import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './game.component';
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";
import {Route, RouterModule} from "@angular/router";
import {GameResolver} from "./game.resolver";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

const children: Route[] = [
  {
    path: ':gameId',
    resolve: {
      game: GameResolver
    },
    component: GameComponent
  }
];


@NgModule({
  declarations: [
    GameComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    RouterModule.forChild(children),
    MatIconModule,
    MatButtonModule
  ]
})
export class GameModule { }
