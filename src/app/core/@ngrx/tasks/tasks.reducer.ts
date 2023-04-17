import { createReducer, on } from '@ngrx/store';
import { initialTasksState } from './tasks.state';
import * as TasksActions from './tasks.actions';
export const tasksReducer = createReducer(
  initialTasksState,
  on(TasksActions.getTasks, (state) => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(TasksActions.getTasksSuccess, (state, { tasks }) => {
    const data = [...tasks];
    return {
      ...state,
      data,
      loading: false,
      loaded: true,
    };
  }),
  on(TasksActions.getTasksError, (state, { error }) => {
    return {
      ...state,
      loading: false,
      loaded: false,
      error,
    };
  }),
  on(TasksActions.createTaskSuccess, (state, { task }) => {
    const data = [{ ...task }, ...state.data];
    return {
      ...state,
      data,
    };
  }),
  on(TasksActions.updateTaskSuccess, (state, { task }) => {
    const data = [...state.data];
    const index = data.findIndex((t) => t.id === task.id);
    data[index] = { ...task };
    return {
      ...state,
      data,
    };
  }),
  on(
    TasksActions.updateTaskError,
    TasksActions.createTaskError,
    TasksActions.deleteTaskError,
    (state, { error }) => {
      return {
        ...state,
        error,
      };
    }
  ),
  on(TasksActions.deleteTaskSuccess, (state, { task }) => {
    const data = state.data.filter((t) => t.id !== task.id);
    return {
      ...state,
      data,
    };
  })
);
