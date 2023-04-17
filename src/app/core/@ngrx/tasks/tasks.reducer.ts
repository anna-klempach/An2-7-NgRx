import { createReducer, on } from '@ngrx/store';
import { initialTasksState } from './tasks.state';
import * as TasksActions from './tasks.actions';
import type { TaskModel } from './../../../tasks/models/task.model';
export const tasksReducer = createReducer(
  initialTasksState,
  on(TasksActions.getTasks, state => {
    return {
      ...state,
      loading: true
    };
  }),
  on(TasksActions.getTasksSuccess, (state, { tasks }) => {
    console.log('GET_TASKS_SUCCESS action being handled!');
    const data = [...tasks];
    return {
      ...state,
      data,
      loading: false,
      loaded: true
    };
  }),
  on(TasksActions.getTasksError, TasksActions.getTaskError, (state, { error }) => {
    return {
      ...state,
      loading: false,
      loaded: false,
      error
    };
  }),
  on(TasksActions.getTask, state => {
    return {
      ...state,
      loading: true,
      loaded: false
    };
  }),
  on(TasksActions.getTaskSuccess, (state, { task }) => {
    const selectedTask = { ...task };
    return {
      ...state,
      loading: false,
      loaded: true,
      selectedTask
    };
  }),
  on(TasksActions.createTask, state => {
    return { ...state };
  }),
  on(TasksActions.updateTaskSuccess, (state, { task }) => {
    const data = [...state.data];
    const index = data.findIndex(t => t.id === task.id);
    data[index] = { ...task };
    return {
      ...state,
      data
    };
  }),
  on(TasksActions.updateTaskError, (state, { error }) => {
    return {
      ...state,
      error
    };
  }),
  on(TasksActions.completeTask, (state, { task }) => {
    const id = task.id;
    const data = state.data.map(t => {
      if (t.id === id) {
        return { ...task, done: true } as TaskModel;
      }
      return t;
    });
    return {
      ...state,
      data
    };
  })
  ,
  on(TasksActions.deleteTask, state => {
    console.log('DELETE_TASK action being handled!');
    return { ...state };
  })
);
