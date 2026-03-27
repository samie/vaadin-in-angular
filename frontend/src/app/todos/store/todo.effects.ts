import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { TodoActions } from './todo.actions';
import { TodoApiService } from '../../core/services/todo-api.service';

/**
 * Only the add effect remains — toggle and delete are handled on the server
 * inside TodoGrid.java and never touch this file.
 */
@Injectable()
export class TodoEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(TodoApiService);

  /** exhaustMap: prevents duplicate POSTs if the user clicks "Add" twice quickly. */
  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.addTodo),
      exhaustMap(({ title, dueDate }) =>
        this.api.create(title, dueDate).pipe(
          map(() => TodoActions.addTodoSuccess()),
          catchError(error => of(TodoActions.addTodoFailure({ error: error.message }))),
        ),
      ),
    ),
  );
}
