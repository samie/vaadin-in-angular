import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Actions, ofType } from '@ngrx/effects';
import { scan } from 'rxjs';
import { TodoActions } from '../../store/todo.actions';
import { Filter } from '../../models/todo.model';

/**
 * Wraps the <todo-grid> Vaadin web component.
 *
 * syncRevision is read directly from the NgRx store and piggybacked onto the
 * filter attribute ("all|0", "active|3") so that any REST mutation reliably
 * triggers the Vaadin onChange callback regardless of timing.
 * See TodoGridExport.java for the full rationale and the server-side parsing.
 *
 * To apply this pattern to another Vaadin component: inject Store, select
 * selectSyncRevision, and bind [attr.<prop>]="<state> + '|' + syncRevision()".
 */
@Component({
  selector: 'app-todo-list',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <todo-grid
      [attr.filter]="filter + '|' + syncRevision()"
      style="display: block;"
    ></todo-grid>
  `,
})
export class TodoListComponent {
  @Input() filter: Filter = 'all';

  private readonly actions = inject(Actions);
  protected readonly syncRevision = toSignal(
    this.actions.pipe(
      ofType(TodoActions.addTodoSuccess),
      scan(count => count + 1, 0),
    ),
    { initialValue: 0 },
  );
}
