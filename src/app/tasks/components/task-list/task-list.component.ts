import { Component, type OnInit } from '@angular/core';

import type { TaskModel } from './../../models/task.model';

import type { Observable } from 'rxjs';

import { TasksFacade } from './../../../core/@ngrx';
import { HttpClient } from '@angular/common/http';
@Component({
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks$!: Observable<ReadonlyArray<TaskModel>>;
  tasksError$!: Observable<Error | string | null>;
  images$!: Observable<any>

  constructor(
    private tasksFacade: TasksFacade,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.tasks$ = this.tasksFacade.tasks$;
    this.tasksError$ = this.tasksFacade.tasksError$;
    this.images$ = this.http.get('https://picsum.photos/v2/list');
  }

  onCreateTask() {
    this.tasksFacade.goTo({ path: ['/add'] });
  }

  onCompleteTask(task: TaskModel): void {
    const taskToComplete: TaskModel = { ...task, done: true };
    this.tasksFacade.updateTask({ task: taskToComplete });
  }

  onEditTask(task: TaskModel): void {
    this.tasksFacade.goTo({ path: ['/edit', task.id] });
  }

  onDeleteTask(task: TaskModel) {
    this.tasksFacade.deleteTask({ task: { ...task } });
  }
}
