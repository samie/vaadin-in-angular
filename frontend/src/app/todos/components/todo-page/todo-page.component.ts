import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { TodoActions } from '../../store/todo.actions';
import { selectError, selectFilter, selectLoading } from '../../store/todo.reducer';
import { Filter } from '../../models/todo.model';

import { TodoAddComponent } from '../todo-add/todo-add.component';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { TodoFooterComponent } from '../todo-footer/todo-footer.component';

/**
 * Responsibilities:
 *
 *   ANGULAR (NgRx)        VAADIN (server)
 *   ────────────────────  ───────────────────────────────────
 *   add todo (REST)       toggle todo (DB update via checkbox)
 *   set filter (signal)   delete todo (DB update via button)
 *   loading / error UI    query & render the grid rows
 *
 * After a successful add, NgRx increments syncRevision. TodoListComponent
 * encodes filter + syncRevision into a single attribute that drives the
 * Vaadin grid refresh — see TodoListComponent and TodoGridExporter for details.
 */
@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [TodoAddComponent, TodoListComponent, TodoFooterComponent],
  template: `
    <div class="todo-app">
      <h1>todos</h1>

      <app-todo-add (add)="onAdd($event)" />

      @if (loading()) {
        <p class="loading">Saving&hellip;</p>
      }

      @if (error()) {
        <p class="error-msg">{{ error() }}</p>
      }

      <app-todo-list [filter]="filter()" />

      <app-todo-footer
        [currentFilter]="filter()"
        (filterChange)="onFilterChange($event)"
      />
    </div>
  `,
})
export class TodoPageComponent {
  private readonly store = inject(Store);

  readonly filter = this.store.selectSignal(selectFilter);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly error = this.store.selectSignal(selectError);

  onAdd({ title, dueDate }: { title: string; dueDate: string | null }): void {
    this.store.dispatch(TodoActions.addTodo({ title, dueDate }));
  }

  onFilterChange(filter: Filter): void {
    // Pure client-state action — no HTTP, updates the signal immediately
    // The new filter value flows into <app-todo-list [filter]> → <todo-grid [attr.filter]>
    // → Vaadin onChange → TodoGrid.applyFilter() → DB query
    this.store.dispatch(TodoActions.setFilter({ filter }));
  }
}
