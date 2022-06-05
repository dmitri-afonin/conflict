import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {
  username = '';
  gameName = '';
  user: any = null;
  questions: any = [];
  answers: any = [];
  games: any = [];

  constructor(
    private afs: AngularFirestore,
    public auth: AngularFireAuth,
    private http: HttpClient,
    private router: Router,
  ) {

  }
  join(game: any):void {
    const hand = game.allAnswers.splice(0, 10);
    this.afs.collection('game').doc(game.id).set({
      ...game,
      users: [...game.users, {name: this.username, id: this.user.uid, score: 0, leader: false, hand}]
    }).then(() => {
      this.router.navigate(['game', game.id]);
    });
  }

  createGame() {
    const col = this.afs.collection('game');

    const id = this.afs.createId();
    const questions = this.shuffle(this.questions);
    const allAnswers = this.shuffle(this.answers);
    const question = questions.pop();
    const hand = allAnswers.splice(0, 10);
    col.doc(id).set({
      id,
      questions,
      answers: [],
      allAnswers,
      question,
      name: this.gameName,
      users: [{name: this.username, id: this.user.uid, score: 0, leader: true, hand}]
    }).then(() => {
      this.router.navigate(['game', id]);
    });
  }

  ngOnInit(): void {
    this.auth.user.subscribe(s => {
      this.user = s;
      this.username = s?.email ?? `Гость №${s?.uid.substr(-5)}`
    });

    this.http.get('/questions.json').subscribe(questions => {
      this.questions = questions;
    });
    this.http.get('/answers.json').subscribe(answers => {
      this.answers = answers;
    });
    this.afs.collection('game').valueChanges().subscribe(s => {
      this.games = s;
    });
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
