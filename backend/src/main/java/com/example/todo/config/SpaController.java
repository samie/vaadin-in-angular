package com.example.todo.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Forwards all non-API, non-static-resource requests to index.html so that
 * Angular's client-side router handles deep-link URLs (e.g. /todos).
 *
 * The pattern [^\.]* means "no file extension", which prevents interfering
 * with .js, .css, and other static assets served from the classpath.
 */
@Controller
public class SpaController {

    @GetMapping("/{path:[^\\.]*}")
    public String index() {
        return "forward:/index.html";
    }
}
