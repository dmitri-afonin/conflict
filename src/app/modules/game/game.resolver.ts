import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {combineLatest, filter, map, Observable, of} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Injectable({ providedIn: 'root' })
export class GameResolver implements Resolve<Observable<any>> {

  constructor(private afs: AngularFirestore, public auth: AngularFireAuth) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Observable<any>> {
    const gameId = route.params['gameId'];
    const userName = route.queryParams['username'];
    console.log({userName});
    let user: any;
    return of(combineLatest([
      this.afs.doc(`game/${gameId}`).valueChanges(),
      this.auth.user
    ]).pipe(
      filter(([game, u]: any) => {
        user = game.users.find((gu: any) => gu.id === u.uid);
        if (!user) {
          const hand = game.allAnswers.splice(0, 10);
          this.afs.doc(`game/${gameId}`).set({
            ...game,
            users: [...game.users, {name: userName ?? u.email ?? u.uid, id: u.uid, score: 0, leader: false, hand}]
          });
          return false;
        }
        return true;
      }),
      map(([game]: any) => {
        const isAllUsersFinished = this.getIsAllUsersFinished(game);
        const isUserFinished = this.getIsUserFinished(game, user.id);
        return {
          game,
          user,
          isAllUsersFinished,
          isUserFinished
        }
      })
    ));
  }

  getIsAllUsersFinished(g: any): boolean {
    if (g.question.options === 2) {
      return g.answers.filter((a: any) => a.text && a.text2).length === g.users.length - 1;
    }
    return g.answers.length === g.users.length - 1;
  }

  getIsUserFinished(g: any, id: string): boolean {
    const answer = g.answers.find((a: any) => a.id === id);
    if (!answer) {
      return false;
    }
    if (g.question.options === 2) {
      return !!answer.text2;
    }
    return true;
  }
}
