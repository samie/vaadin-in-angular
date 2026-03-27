package com.example.todo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Allow the Angular dev server (port 4200) to reach resources on port 8080.
     *
     * /api/**              — REST calls from Angular's HttpClient
     * /web-component/**    — Vaadin's generated <todo-grid> bundle (script tag in index.html)
     * /VAADIN/**           — Vaadin client assets referenced inside the bundle
     *
     * In production everything is on the same origin so these mappings are harmless.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PATCH", "DELETE");

        registry.addMapping("/web-component/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET");

        registry.addMapping("/VAADIN/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET");
    }
}
