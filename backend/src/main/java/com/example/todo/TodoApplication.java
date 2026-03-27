package com.example.todo;

import com.vaadin.flow.component.page.AppShellConfigurator;
import com.vaadin.flow.component.page.Push;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/** Main entry point for the Spring Boot application.
 *
 * <p>Must live in the root package {@code com.example.todo} so that
 * {@code @SpringBootApplication} component-scans all subpackages
 * (service, controller, vaadin, …).
 *
 * <p>Implements AppShellConfigurator to enable Vaadin's server push,
 * allowing the server to update the UI without client polling. */
@Push
@SpringBootApplication
public class TodoApplication implements AppShellConfigurator {

    public static void main(String[] args) {
        SpringApplication.run(TodoApplication.class, args);
    }
}
