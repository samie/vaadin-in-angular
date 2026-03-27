package com.example.todo.vaadin;

import com.vaadin.flow.component.datepicker.DatePicker;
import com.vaadin.flow.component.WebComponentExporter;
import com.vaadin.flow.component.webcomponent.PropertyConfiguration;
import com.vaadin.flow.component.webcomponent.WebComponent;

import java.time.LocalDate;

/**
 * Registers Vaadin {@link DatePicker} as the browser custom element {@code <todo-date-picker>}.
 *
 * <p>Exposes a bidirectional {@code value} property (ISO-8601 date string, e.g. {@code "2026-03-30"}).
 * Angular reads the element's {@code value} property at form-submit time and includes it
 * in the {@code POST /api/todos} body. When Angular clears the property after submit,
 * the {@code onChange} callback resets the picker to null.
 */
public class TodoDatePickerExport extends WebComponentExporter<DatePicker> {

    private PropertyConfiguration<DatePicker, String> valueProperty;

    public TodoDatePickerExport() {
        super("todo-date-picker");
        valueProperty = addProperty("value", "")
                .onChange((picker, val) ->
                        picker.setValue(val != null && !val.isBlank()
                                ? LocalDate.parse(val) : null));
    }

    @Override
    protected void configureInstance(WebComponent<DatePicker> webComponent, DatePicker picker) {
        picker.setPlaceholder("Due date (optional)");
        picker.addValueChangeListener(event -> {
            LocalDate val = event.getValue();
            webComponent.setProperty(valueProperty, val != null ? val.toString() : "");
        });
    }
}
