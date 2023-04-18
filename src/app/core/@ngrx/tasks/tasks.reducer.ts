import { createReducer, on } from '@ngrx/store';
import { adapter, initialTasksState } from './tasks.state';
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
    return adapter.setAll(tasks, { ...state, loading: false, loaded: true });
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
    return adapter.addOne(task, state);
  }),
  on(TasksActions.updateTaskSuccess, (state, { task }) => {
    return adapter.updateOne({ id: task.id!, changes: task }, state);
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
    return adapter.removeOne(task.id!, state);
  })
);
