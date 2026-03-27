import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../../todos/models/todo.model';

/**
 * Thin HTTP wrapper — knows nothing about NgRx.
 * Effects call this service; components never call it directly.
 */
@Injectable({ providedIn: 'root' })
export class TodoApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/todos';

  create(title: string, dueDate: string | null): Observable<Todo> {
    return this.http.post<Todo>(this.baseUrl, { title, dueDate });
  }
}
