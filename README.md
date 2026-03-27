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

Use this if your team normally works with Angular CLI and local Node/npm.

```bash
# terminal 1 - backend
cd /Users/se/IdeaProjects/angularapp/backend
mvn spring-boot:run
```

```bash
# terminal 2 - frontend
cd /Users/se/IdeaProjects/angularapp/frontend
npm install
npm start
```

Then open `http://localhost:4200`.

Notes:
- Angular dev server proxies `/api`, `/web-component`, and `/VAADIN` to Spring Boot (`frontend/proxy.conf.js`).
- `frontend/src/main.ts` injects `/web-component/todo-grid.js` at runtime.

## Clean build artifacts

Use one of these two levels depending on how much you want to reset.

### 1) Routine clean (safe default)

Removes Maven `target/` outputs only.

```bash
cd /Users/se/IdeaProjects/angularapp
./mvnw clean
```

### 2) Deep clean (remove downloaded/generated dev artifacts)

Removes ignored build/download artifacts across both modules, including:
- `**/target`
- `**/node_modules`
- Angular cache/output (`**/.angular`, `**/dist`)
- local H2 files under `data/`

```bash
cd /Users/se/IdeaProjects/angularapp
git clean -fdX
```

If you want to keep local DB files, use this instead:

```bash
cd /Users/se/IdeaProjects/angularapp
git clean -fdX -e data/
```

After a deep clean, bootstrap again with either workflow:

```bash
# Angular-native loop
cd /Users/se/IdeaProjects/angularapp/frontend
npm install
npm start
```

```bash
# Backend
cd /Users/se/IdeaProjects/angularapp/backend
mvn spring-boot:run
```

```bash
# Maven-managed frontend build (no system Node/npm required for build)
cd /Users/se/IdeaProjects/angularapp
mvn -Pprod package
```
