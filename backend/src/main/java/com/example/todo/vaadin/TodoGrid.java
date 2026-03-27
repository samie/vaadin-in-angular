package com.example.todo.vaadin;

import com.example.todo.dto.UpdateTodoRequest;
import com.example.todo.entity.Todo;
import com.example.todo.service.TodoService;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.checkbox.Checkbox;
import com.vaadin.flow.component.grid.Grid;

import java.util.Comparator;
import java.util.List;

/**
 * Server-side Vaadin component embedded into the Angular app as a web component.
 * All data access and mutations happen on the JVM side, and Vaadin pushes
 * updates to the browser automatically.
 *
 * Refresh after add is driven by Angular: on addTodoSuccess the NgRx store
 * increments a version counter. TodoListComponent encodes both filter and version
 * into the single "filter" attribute ("all|1", "active|2", …). TodoGridExport
 * strips the syncRevision suffix before forwarding the clean filter value here.
 *
 * This is exposed as a web component by TodoGridExporter.
 */
public class TodoGrid extends Grid<Todo> {

    private TodoService service;
    private String currentFilter = "all";
    private Column<Todo> titleColumn;

    public TodoGrid() {
        super(Todo.class, false);
        setSizeFull();
        configureColumns();
    }

    public void setService(TodoService service) {
        this.service = service;
        setAllRowsVisible(true);
        refresh();
    }

    private void configureColumns() {
        // Checkbox state change triggers a server-side DB update not REST call
        addComponentColumn(todo -> {
            Checkbox cb = new Checkbox(todo.isCompleted());
            cb.addValueChangeListener(e -> {
                service.update(todo.getId(), new UpdateTodoRequest(null, e.getValue()));
                refresh();
            });
            return cb;
        }).setHeader("Done").setWidth("80px").setFlexGrow(0)
          .setComparator(Comparator.comparing(Todo::isCompleted));

        titleColumn = addColumn(Todo::getTitle).setHeader("Task").setSortable(true);

        addColumn(todo -> todo.getDueDate() != null ? todo.getDueDate().toString() : "no date")
                .setHeader("Due Date")
                .setComparator(Comparator.comparing(Todo::getDueDate, Comparator.nullsLast(Comparator.naturalOrder())));

        // Delete button triggers a server-side DB delete not REST call
        addComponentColumn(todo -> {
            Button btn = new Button("✕");
            btn.addClickListener(e -> {
                service.delete(todo.getId());
                refresh();
            });
            return btn;
        }).setWidth("60px").setFlexGrow(0);
    }

    /**
     * Called by TodoGridExport when Angular changes the "filter" attribute.
     * Receives the clean filter value ("all", "active", or "completed") with the
     * syncRevision suffix already stripped by the exporter.
     */
    public void refresh(String filter) {
        this.currentFilter = (filter != null) ? filter : "all";
        refresh();
    }

    public void refresh() {
        if (service == null) return;
        List<Todo> todos = service.findAll();
        List<Todo> filtered = switch (currentFilter) {
            case "active"    -> todos.stream().filter(t -> !t.isCompleted()).toList();
            case "completed" -> todos.stream().filter(Todo::isCompleted).toList();
            default          -> todos;
        };
        setItems(filtered.stream().sorted(Comparator.comparing(Todo::getCreatedAt)).toList());
    }
}
