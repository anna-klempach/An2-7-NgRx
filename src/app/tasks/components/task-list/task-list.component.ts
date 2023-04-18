import { Component, type OnInit } from '@angular/core';

import type { TaskModel } from './../../models/task.model';

import type { Observable } from 'rxjs';

import { TasksFacade } from './../../../core/@ngrx';
@Component({
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks$!: Observable<ReadonlyArray<TaskModel>>;
  tasksError$!: Observable<Error | string | null>;

  constructor(
    private tasksFacade: TasksFacade
  ) { }

  ngOnInit(): void {
    this.tasks$ = this.tasksFacade.tasks$;
    this.tasksError$ = this.tasksFacade.tasksError$;
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
