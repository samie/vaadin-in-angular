package com.example.todo.service;

import com.example.todo.dto.CreateTodoRequest;
import com.example.todo.dto.UpdateTodoRequest;
import com.example.todo.entity.Todo;
import com.example.todo.repository.TodoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class TodoService {

    private final TodoRepository repository;

    public TodoService(TodoRepository repository) {
        this.repository = repository;
    }

    public List<Todo> findAll() {
        return repository.findAll();
    }

    public Todo create(CreateTodoRequest request) {
        var todo = new Todo();
        todo.setTitle(request.title());
        if (request.dueDate() != null && !request.dueDate().isBlank()) {
            todo.setDueDate(LocalDate.parse(request.dueDate()));
        }
        return repository.save(todo);
    }

    @Transactional
    public Todo update(Long id, UpdateTodoRequest request) {
        var todo = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found: " + id));
        if (request.title() != null) todo.setTitle(request.title());
        if (request.completed() != null) todo.setCompleted(request.completed());
        return repository.save(todo);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
