import { NgModule } from '@angular/core';
import { type MetaDefinition } from '@angular/platform-browser';
import { type Routes, RouterModule } from '@angular/router';
import { TasksStatePreloadingGuard, TaskExistsGuard } from './guards';

import { TaskListComponent, TaskFormComponent } from './components';

const metaTags: Array<MetaDefinition> = [
  {
    name: 'description',
    content: 'Task Manager Application. This is SPA'
  },
  {
    name: 'keywords',
    content: 'Angular tutorial, SPA, Routing'
  }
];

const routes: Routes = [
  {
    path: 'home',
    component: TaskListComponent,
    canActivate: [TasksStatePreloadingGuard],
    data: {
      title: 'Task Manager',
      meta: metaTags
    }
  },
  {
    path: 'add',
    component: TaskFormComponent
  },
  {
    path: 'edit/:taskID',
    component: TaskFormComponent,
    canActivate: [TaskExistsGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
