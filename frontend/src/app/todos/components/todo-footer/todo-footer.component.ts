import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Filter } from '../../models/todo.model';

@Component({
  selector: 'app-todo-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <!-- Count is now managed by the Vaadin Grid on the server -->
      <span>Filter</span>

      <div class="filters">
        @for (f of filters; track f) {
          <button
            [class.active]="f === currentFilter"
            (click)="filterChange.emit(f)"
          >{{ f }}</button>
        }
      </div>
    </footer>
  `,
})
export class TodoFooterComponent {
  @Input() currentFilter: Filter = 'all';

  @Output() filterChange = new EventEmitter<Filter>();

  readonly filters: Filter[] = ['all', 'active', 'completed'];
}
