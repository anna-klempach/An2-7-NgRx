import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { TasksStoreModule } from './tasks/tasks-store.module';
import { metaReducers } from './meta-reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from './../../../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterState } from '@ngrx/router-store';
import { routerReducers, CustomSerializer, RouterEffects } from './router';
import { UsersStoreModule } from './users/users-store.module';
import { EntityStoreModule } from './data/entity-store.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot(routerReducers, {
      metaReducers,
      // All checks will automatically be disabled in production builds
      runtimeChecks: {
        strictStateImmutability: true, // default value is true
        strictActionImmutability: true, // default value is true
        strictStateSerializability: true, // default value is false
        strictActionSerializability: false, // default value is false
        strictActionWithinNgZone: true, // default value is false
        strictActionTypeUniqueness: true // default value is false
      }
    }),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
      routerState: RouterState.Minimal,
      serializer: CustomSerializer // has a priority over routerState
    }),
    EffectsModule.forRoot([RouterEffects]),
    TasksStoreModule,
    // Instrumentation must be imported after importing StoreModule (config is optional)
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    UsersStoreModule,
    EntityStoreModule
  ]
})
export class RootStoreModule { }
