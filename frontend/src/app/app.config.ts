import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { todoFeature } from './todos/store/todo.reducer';
import { TodoEffects } from './todos/store/todo.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),

    // NgRx root store — empty initially, features add their own slices
    provideStore(),

    // Todo feature slice: registers { todos, filter, loading, error } in the store
    provideState(todoFeature),

    // Effects wire NgRx actions to HTTP calls (server state)
    provideEffects(TodoEffects),

    // Redux DevTools integration — disable logging in production
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
    }),
  ],
};
