import { Component, type OnInit } from '@angular/core';
import { EntityServices, EntityCollectionService } from '@ngrx/data';
import { selectEditedUser } from './../../../core/@ngrx/data/entity-store.module';

import { Store } from '@ngrx/store';
import { map, type Observable, type Subscription } from 'rxjs';
import { AutoUnsubscribe } from './../../../core/decorators';


import * as RouterActions from './../../../core/@ngrx/router/router.actions';
import { type UserModel } from './../../models/user.model';

@Component({
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
@AutoUnsubscribe('subscription')
export class UserListComponent implements OnInit {
  users$!: Observable<Array<UserModel>>;
  usersError$!: Observable<Error | string | null>;
  private subscription!: Subscription;
  private editedUser!: UserModel;
  private userService!: EntityCollectionService<UserModel>;

  constructor(
    private store: Store, entitytServices: EntityServices
  ) {
    // get service for the entity User
    this.userService = entitytServices.getEntityCollectionService('User');
  }

  ngOnInit(): void {
    // use built-in selector
    this.users$ = this.userService.entities$;
    // use built-in selector with transformation
    // error is in EntityAction
    this.usersError$ = this.userService.errors$.pipe(
      map(action => action.payload.error!)
    );
    this.subscription = this.store.select(selectEditedUser).subscribe({
      next: (user: UserModel | null) => {
        this.editedUser = { ...user } as UserModel;
        console.log(
          `Last time you edited user ${JSON.stringify(this.editedUser)}`
        );
      },
      error: err => console.log(err)
    });
  }

  onEditUser(user: UserModel): void {
    this.store.dispatch(RouterActions.go({
      path: ['/users/edit', user.id]
    }));
  }

  isEdited(user: UserModel): boolean {
    if (this.editedUser) {
      return user.id === this.editedUser.id;
    }
    return false;
  }

  onDeleteUser(user: UserModel): void {
    // use service to dispatch EntitytAction
    this.userService.delete(user.id!);
  }

  trackByFn(index: number, user: UserModel): number | null {
    return user.id;
  }
}
