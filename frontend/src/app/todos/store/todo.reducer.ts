import { createFeature, createReducer, on } from '@ngrx/store';
import { Filter } from '../models/todo.model';
import { TodoActions } from './todo.actions';

/**
 * What moved out of this state:
 *
 *   todos[]       — Vaadin Grid owns the data now; the server queries the DB on
 *                   every filter/refresh change. No client-side todo array needed.
 *
 *   toggleTodo    — server-side checkbox in TodoGrid.java
 *   deleteTodo    — server-side button in TodoGrid.java
 *
 * What stays in Angular state:
 *
 *   syncRevision  — Vaadin integration detail; local counter in TodoListComponent.
 *
 * What stays in Angular state:
 *
 *   filter        — CLIENT state; Angular still owns the filter selection and
 *                   passes it to <todo-grid> as an HTML attribute.
 *
 *   loading       — true while the POST /api/todos request is in-flight.
 *   error         — last add-failure message shown in the UI.
 */
export interface TodoState {
  filter: Filter;
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  filter: 'all',
  loading: false,
  error: null,
};

export const todoFeature = createFeature({
  name: 'todos',
  reducer: createReducer(
    initialState,

    on(TodoActions.addTodo, state => ({ ...state, loading: true, error: null })),
    on(TodoActions.addTodoSuccess, state => ({ ...state, loading: false })),
    on(TodoActions.addTodoFailure, (state, { error }) => ({ ...state, loading: false, error })),

    on(TodoActions.setFilter, (state, { filter }) => ({ ...state, filter })),
  ),
});

export const { selectFilter, selectLoading, selectError } = todoFeature;
