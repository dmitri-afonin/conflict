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
        game.users = game.users.map((u: any) => ({...u, isFinished: this.getIsUserFinished(game, u.id)}))
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
    const fullAnswers = g.answers.filter((a: any) => a[`text${g.question.options}`]);
    return fullAnswers.length === g.users.length - 1;
  }

  getIsUserFinished(g: any, id: string): boolean {
    const answer = g.answers.find((a: any) => a.id === id);
    return !!answer?.[`text${g.question.options}`];
  }
}
