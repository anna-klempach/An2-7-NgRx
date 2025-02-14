import { Injectable } from '@angular/core';
import * as RouterActions from './../router/router.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { type Action } from '@ngrx/store';
import { type Observable, of, switchMap, map, catchError, concatMap } from 'rxjs';
import { UserObservableService } from './../../../users/services';
import { type UserModel } from '../../../users/models/user.model';
import * as UsersActions from './users.actions';
@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private userObservableService: UserObservableService
  ) {
    console.log('[USERS EFFECTS]');
  }
  getUsers$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.getUsers),
      switchMap(action =>
        this.userObservableService.getUsers().pipe(
          map(users => UsersActions.getUsersSuccess({ users })),
          catchError(error => of(UsersActions.getUsersError({ error })))
        )
      )
    )
  );
  updateUser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      map(action => action.user),
      concatMap((user: UserModel) =>
        this.userObservableService.updateUser(user).pipe(
          map(updatedUser => {
            return UsersActions.updateUserSuccess({ user: updatedUser });
          }),
          catchError(error => of(UsersActions.updateUserError({ error })))
        )
      )
    )
  );
  createUser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUser),
      map(action => action.user),
      concatMap((user: UserModel) =>
        this.userObservableService.createUser(user).pipe(
          map(createdUser => {
            return UsersActions.createUserSuccess({ user: createdUser });
          }),
          catchError(error => of(UsersActions.createUserError({ error })))
        )
      )
    )
  );
  deleteUser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      map(action => action.user),
      concatMap((user: UserModel) =>
        this.userObservableService.deleteUser(user).pipe(
          // Note: json-server doesn't return deleted user
          // so we use user
          map(() => UsersActions.deleteUserSuccess({ user })),
          catchError(error => of(UsersActions.deleteUserError({ error })))
        )
      )
    )
  );

  createUserSuccess$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUserSuccess),
      map(action => {
        const path = ['/users'];
        return RouterActions.go({ path });
      })
    )
  );
  updateUserSuccess$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUserSuccess),
      map(action => {
        const { user: { id: userID } } = action;
        const path = ['/users', { editedUserID: userID }];
        return RouterActions.go({ path });
      })
    )
  );

}
