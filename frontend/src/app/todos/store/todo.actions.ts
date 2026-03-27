import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Filter } from '../models/todo.model';

/**
 * After moving to Vaadin Flow for the grid, Angular only manages:
 *
 *   addTodo   — still goes through NgRx → Effect → REST → DB
 *   setFilter — pure client state, passed as an attribute to <todo-grid>
 *
 * Toggle and delete were removed from NgRx entirely.
 * They now live as server-side event handlers inside TodoGrid.java.
 */
export const TodoActions = createActionGroup({
  source: 'Todo',
  events: {
    'Add Todo': props<{ title: string; dueDate: string | null }>(),
    'Add Todo Success': emptyProps(),
    'Add Todo Failure': props<{ error: string }>(),

    // Pure client state — no Effect, no HTTP
    'Set Filter': props<{ filter: Filter }>(),
  },
});
