import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { UsersEffects } from './users.effects';
import { StoreModule } from '@ngrx/store';
import { usersFeatureKey } from '../app.state';
import { usersReducer } from './users.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EffectsModule.forFeature([UsersEffects]),
    StoreModule.forFeature(usersFeatureKey, usersReducer),
  ]
})
export class UsersStoreModule { }
