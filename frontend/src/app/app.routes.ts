import { Routes } from '@angular/router';
import { TodoPageComponent } from './todos/components/todo-page/todo-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'todos', pathMatch: 'full' },
  { path: 'todos', component: TodoPageComponent },
];
