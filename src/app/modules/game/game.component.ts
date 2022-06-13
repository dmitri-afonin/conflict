import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ActivatedRoute, Router} from "@angular/router";
import {switchMap, tap} from "rxjs";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  game: any = null;
  gameUser: any = null;
  isAllUsersFinished = false;
  options: any = [];
  isUserFinished = false;
  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.data.pipe(
      switchMap((s) => s['game']),
      tap((g: any) => {
        this.game = g.game;
        this.gameUser = g.user;
        this.isAllUsersFinished = g.isAllUsersFinished;
        this.isUserFinished = g.isUserFinished;
        this.options = Array(this.game.question.options).fill(0);
        this.game.users.forEach((u: any) => {
          if (u.score === this.game.movesToWin) {
            alert(`${u.name} win!`);
            this.afs.collection('game').doc(this.game.id).delete();
            this.router.navigate(['/']);
          }
        });
      })
    ).subscribe();
  }

  chooseCard(i: number): void {
    if (this.gameUser.leader) {
      return;
    }
    const answers = this.game.answers;
    let myAnswer = this.game.answers.find((a: any) => a.id === this.gameUser.id);
    if (!myAnswer) {
      myAnswer = {id: this.gameUser.id};
      answers.push(myAnswer);
    }
    for (let j = 1; j <= this.options.length; j++) {
      if (!myAnswer[`text${j}`]) {
        const newCard = this.game.allAnswers.splice(0, 1);
        myAnswer[`text${j}`] = this.gameUser.hand.splice(i, 1, ...newCard);
        break;
      }
    }
    this.afs.collection('game').doc(this.game.id).set({
      ...this.game,
      answers: this.shuffle(answers)
    });
  }

  chooseAnswer(answer: any): void {
    if (!this.gameUser.leader || !this.isAllUsersFinished) {
      return;
    }
    const users = this.game.users.map((u: any) => {
      if (u.id === this.gameUser.id) {
        return {...u, leader: false};
      }
      if (u.id === answer.id) {
        return {...u, score: u.score + 1, leader: true};
      }
      return u;
    });
    const question = this.game.questions.pop();
    this.afs.collection('game').doc(this.game.id).set({
      ...this.game,
      question,
      users,
      answers: []
    });
  }

  deleteUser(user: any): void {
    const users = this.game.users.filter((u: any) => u.id !== user.id);
    if (user.leader) {
      users[0].leader = true;
    }
    this.afs.collection('game').doc(this.game.id).set({
      users,
    }, {merge: true});
  }

  shuffle(array: any[]) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }
}
