package com.healthmate.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404).body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAllExceptions(Exception ex) {
        String className = ex.getClass().getName();
        String message = ex.getMessage();

        // Check for common validation exceptions by name to avoid compilation issues
        if (className.contains("MethodArgumentNotValidException") ||
                className.contains("HandlerMethodValidationException") ||
                className.contains("BindException")) {
            return ResponseEntity.status(400).body("Validation Error: " + message);
        }

        return ResponseEntity.status(500).body("Internal Server Error [" + className + "]: " + message);
    }
}
