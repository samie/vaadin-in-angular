package com.example.todo.vaadin;

import com.example.todo.service.TodoService;
import com.vaadin.flow.component.WebComponentExporter;
import com.vaadin.flow.component.webcomponent.WebComponent;
import com.vaadin.flow.server.VaadinServlet;
import jakarta.servlet.ServletContext;
import org.springframework.stereotype.Component;
import org.springframework.web.context.support.WebApplicationContextUtils;

/**
 * Registers {@link TodoGrid} as the browser custom element {@code <todo-grid>}.
 *
 * <p>The {@code filter} property is the sole communication channel from Angular.
 * Its value is a pipe-delimited string {@code "<filter>|<syncRevision>"}
 * (e.g. {@code "active|3"}). The syncRevision suffix is appended by Angular on
 * every successful REST mutation so that the attribute value always changes,
 * guaranteeing an {@code onChange} delivery even when the filter itself is
 * unchanged, working around Vaadin's property-sync layer filtering out duplicates.
 *
 * This class strips the sync suffix before forwarding the clean
 * filter value to {@link TodoGrid#refresh(String)}.
 *
 * <p>Spring beans are resolved manually via the servlet context because Vaadin's
 * classpath scanner instantiates exporters independently of Spring.
 */
public class TodoGridExport extends WebComponentExporter<TodoGrid> {
    
    public TodoGridExport() {
        super("todo-grid");

        // Filter property encodes both the active filter and a sync revision counter to
        // reliably trigger onChange for both user interactions and async updates.
        // The syncRevision suffix (e.g. "active|3") is stripped here before forwarding
        // the clean filter value to the grid.
        addProperty("filter", "all")
                .onChange((grid, value) -> grid.refresh(value != null ? value.split("\\|")[0] : "all"));
    }

    /**
     * Called by Vaadin to configure each new instance of the web component.
     *
     * <p>Vaadin's classpath scanner discovers WebComponentExporter subclasses and
     * instantiates them independently of Spring. Spring beans are therefore resolved
     * from the ApplicationContext via the servlet context here.
     *
     * @param webComponent
     * @param grid
     */
    @Override
    protected void configureInstance(WebComponent<TodoGrid> webComponent, TodoGrid grid) {

        // Resolve Spring-managed TodoService from the servlet context since this
        // exporter is instantiated by Vaadin, not Spring
        ServletContext sc = VaadinServlet.getCurrent().getServletContext();
        TodoService todoService = WebApplicationContextUtils
                .getRequiredWebApplicationContext(sc)
                .getBean(TodoService.class);
        
        grid.setService(todoService);
    }
}
