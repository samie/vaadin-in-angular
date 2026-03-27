import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-add',
  standalone: true,
  imports: [FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <form class="add-form" (ngSubmit)="submit()">
      <input
        [(ngModel)]="title"
        name="title"
        placeholder="What needs to be done?"
        autocomplete="off"
      />
      <todo-date-picker #dueDatePicker></todo-date-picker>
      <button type="submit" [disabled]="!title.trim()">Add</button>
    </form>
  `,
})
export class TodoAddComponent {
  title = '';

  @ViewChild('dueDatePicker') dueDatePickerEl!: ElementRef;

  @Output() add = new EventEmitter<{ title: string; dueDate: string | null }>();

  submit(): void {
    const trimmed = this.title.trim();
    if (trimmed) {
      const dueDate = (this.dueDatePickerEl.nativeElement.value as string) || null;
      this.add.emit({ title: trimmed, dueDate });
      this.title = '';
      this.dueDatePickerEl.nativeElement.value = '';
    }
  }
}
