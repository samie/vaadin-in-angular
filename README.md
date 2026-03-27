# Angular + Vaadin Interoperability Demo

This project is intentionally optimized for Angular developers trying 
Vaadin web components in a modern Angular app.

- Angular keeps app state with NgRx (`addTodo`, `setFilter`, loading/error state).
- Vaadin provides exported web components used in Angular templates:
  - `<todo-grid>` for server-backed grid rendering and actions.
  - `<todo-date-picker>` for date input.
- Server-side grid controls:
  - toggle completion (checkbox)
  - delete todo (button)

## Important Files

- Angular integration: `frontend/src/app/todos/components/todo-list/todo-list.component.ts`
- DatePicker bridge: `frontend/src/app/todos/components/todo-add/todo-add.component.ts`
- DatePicker styling example: `frontend/src/styles.css`
- Grid exporter/property sync: `backend/src/main/java/com/example/todo/vaadin/TodoGridExport.java`
- DatePicker exporter: `backend/src/main/java/com/example/todo/vaadin/TodoDatePickerExport.java`
- Server-side grid controls: `backend/src/main/java/com/example/todo/vaadin/TodoGrid.java`

## How the Vaadin attribute sync works

`todo-grid` receives one attribute from Angular: `filter`.

- Angular sends `"<filter>|<syncRevision>"` (example: `"active|3"`) in `TodoListComponent`.
- `syncRevision` increments after successful add actions so the attribute value always changes.
- In `TodoGridExport`, `addProperty("filter", "all").onChange(...)` strips the `|<syncRevision>` part and passes only the filter (`all`, `active`, `completed`) to `TodoGrid.refresh(...)`.


## Development Workflow

Start the backend:
```bash
mvn -pl backend spring-boot:run
```

Start the development frontend:
```bash
cd /Users/se/IdeaProjects/angularapp/frontend
npm install
npm start
```

Then open `http://localhost:4200`.

Notes:
- Angular dev server proxies `/api`, `/web-component`, and `/VAADIN` to Spring Boot (`frontend/proxy.conf.js`).
- `frontend/src/main.ts` injects `/web-component/todo-grid.js` at runtime.

