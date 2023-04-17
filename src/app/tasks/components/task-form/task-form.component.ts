import { Component, OnDestroy, type OnInit } from '@angular/core';
import { ActivatedRoute, Router, type ParamMap } from '@angular/router';

import { TaskModel } from './../../models/task.model';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { selectSelectedTask, selectTasksState, type TasksState } from './../../../core/@ngrx';
import * as TasksActions from './../../../core/@ngrx/tasks/tasks.actions';

@Component({
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit, OnDestroy {
  task!: TaskModel;
  private componentDestroyed$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store
  ) { }
  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  ngOnInit(): void {
    this.task = new TaskModel();

    let observer: any = {
      next: (task: TaskModel) => {
        if (task) {
          this.task = { ...task };
        } else {
          this.task = new TaskModel();
        }

      },
      error(err: any) {
        console.log(err);
      },
      complete() {
        console.log('Stream is completed');
      }
    };
    this.store.select(selectSelectedTask)
      .pipe(
        takeUntil(this.componentDestroyed$)
      )
      .subscribe(observer);
    observer = {
      ...observer,
      next: (params: ParamMap) => {
        const id = params.get('taskID');
        if (id) {
          this.store.dispatch(TasksActions.getTask({ taskID: +id }));
        }
      }
    };
    this.route.paramMap.subscribe(observer);
  }

  onSaveTask(): void {
    const task = { ...this.task } as TaskModel;

    if (task.id) {
      this.store.dispatch(TasksActions.updateTask({ task }));
    } else {
      this.store.dispatch(TasksActions.createTask({ task }));
    }
  }

  onGoBack(): void {
    this.router.navigate(['/home']);
  }
}
