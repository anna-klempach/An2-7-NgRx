import { Component, type OnInit } from '@angular/core';

import type { TaskModel } from './../../models/task.model';
import { Store } from '@ngrx/store';
import type { Observable } from 'rxjs';
import { selectTasksData, selectTasksError } from './../../../core/@ngrx';

import * as RouterActions from './../../../core/@ngrx/router/router.actions';
import * as TasksActions from './../../../core/@ngrx/tasks/tasks.actions';
@Component({
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks$!: Observable<ReadonlyArray<TaskModel>>;
  tasksError$!: Observable<Error | string | null>;

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this.tasks$ = this.store.select(selectTasksData);
    this.tasksError$ = this.store.select(selectTasksError);
  }

  onCreateTask() {
    this.store.dispatch(RouterActions.go({
      path: ['/add']
    }));
  }

  onCompleteTask(task: TaskModel): void {
    const taskToComplete: TaskModel = { ...task, done: true };
    this.store.dispatch(TasksActions.completeTask({ task: taskToComplete }));
  }

  onEditTask(task: TaskModel): void {
    this.store.dispatch(RouterActions.go({ path: ['/edit', task.id] }))
  }

  onDeleteTask(task: TaskModel) {
    this.store.dispatch(TasksActions.deleteTask({ task }));
  }
}
