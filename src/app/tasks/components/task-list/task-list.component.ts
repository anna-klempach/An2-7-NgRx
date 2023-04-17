import { Component, type OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TaskPromiseService } from './../../services';
import type { TaskModel } from './../../models/task.model';
import { Store } from '@ngrx/store';
import type { Observable } from 'rxjs';
import { type TasksState, type AppState, tasksFeatureKey } from './../../../core/@ngrx';
import * as TasksActions from './../../../core/@ngrx/tasks/tasks.actions';
@Component({
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks!: Promise<Array<TaskModel>>;
  tasksState$!: Observable<TasksState>;

  constructor(
    private router: Router,
    private taskPromiseService: TaskPromiseService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    //this.tasks = this.taskPromiseService.getTasks();
    this.tasksState$ = this.store.select(tasksFeatureKey);
  }

  onCreateTask() {
    const link = ['/add'];
    this.router.navigate(link);
  }

  onCompleteTask(task: TaskModel): void {
    this.store.dispatch(TasksActions.completeTask({ task }));
  }

  onEditTask(task: TaskModel): void {
    const link = ['/edit', task.id];
    this.router.navigate(link);
  }

  onDeleteTask(task: TaskModel) {
    this.taskPromiseService
      .deleteTask(task)
      .then(() => (this.tasks = this.taskPromiseService.getTasks()))
      .catch(err => console.log(err));
  }

  private async updateTask(task: TaskModel) {
    const updatedTask = await this.taskPromiseService.updateTask({
      ...task,
      done: true
    });

    const tasks: TaskModel[] = await this.tasks;
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    tasks[index] = { ...updatedTask };
  }
}
