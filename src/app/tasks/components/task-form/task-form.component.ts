import { Component, OnDestroy, type OnInit } from '@angular/core';

import { TaskModel } from './../../models/task.model';
import { Subject, takeUntil } from 'rxjs';
import { TasksFacade } from 'src/app/core/@ngrx/tasks/tasks.facade';
@Component({
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit, OnDestroy {
  task!: TaskModel;
  private componentDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private tasksFacade: TasksFacade
  ) { }
  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  ngOnInit(): void {
    this.task = new TaskModel();

    const observer: any = {
      next: (task: TaskModel) => {
        this.task = { ...task };
      },
      error(err: any) {
        console.log(err);
      },
      complete() {
        console.log('Stream is completed');
      }
    };
    this.tasksFacade.selectedTaskByUrl$
      .pipe(
        takeUntil(this.componentDestroyed$)
      )
      .subscribe(observer);
  }

  onSaveTask(): void {
    const task = { ...this.task } as TaskModel;

    const method = task.id ? 'updateTask' : 'createTask';
    this.tasksFacade[method]({ task });
  }

  onGoBack(): void {
    this.tasksFacade.goTo({ path: ['/home'] });
  }
}
