# Angular + Vaadin Interoperability Demo

This project is intentionally optimized for Angular developers trying 
Vaadin web components in a modern Angular app.

- Angular keeps app state with NgRx (`addTodo`, `setFilter`, loading/error state).
- Vaadin provides exported web components used in Angular templates:
  - `<todo-grid>` for server-backed [Grid](https://vaadin.com/docs/latest/components/grid) rendering and actions.
  - `<todo-date-picker>` for Vaadin [Date Picker](https://vaadin.com/docs/latest/components/date-picker).
- Server-side grid controls:
  - toggle completion ([Checkbox](https://vaadin.com/docs/latest/components/checkbox))
  - delete todo ([Button](https://vaadin.com/docs/latest/components/button))

## Important Files

- Angular integration: `frontend/src/app/todos/components/todo-list/todo-list.component.ts`
- DatePicker bridge: `frontend/src/app/todos/components/todo-add/todo-add.component.ts`
- DatePicker styling example: `frontend/src/styles.css`
- Grid exporter/property sync: `backend/src/main/java/com/example/todo/vaadin/TodoGridExport.java`
- DatePicker exporter: `backend/src/main/java/com/example/todo/vaadin/TodoDatePickerExport.java`
- Server-side grid controls: `backend/src/main/java/com/example/todo/vaadin/TodoGrid.java`

Notes:
- Angular dev server proxies `/api` and `/vaadin` to Spring Boot (`frontend/proxy.conf.json`).
- `frontend/src/main.ts` injects `/web-component/todo-grid.js` at runtime.

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

Note: when using IDE, you can run the Spring Boot app from `backend/src/main/java/com/example/todo/TodoApplication.java`. 

## Packaging for deployment

```bash
mvn clean package -Pprod
```

This creates a production-ready JAR in `backend/target/` that serves the Angular frontend 
and Vaadin web components from Spring Boot. Run it with:

```bash
java -jar backend/target/angular-vaadin-demo-0.0.1-SNAPSHOT.jar
```

Then open `http://localhost:8080`.