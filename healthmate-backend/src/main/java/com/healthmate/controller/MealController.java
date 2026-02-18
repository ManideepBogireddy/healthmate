package com.healthmate.controller;

import com.healthmate.model.Meal;
import com.healthmate.service.MealService;
import com.healthmate.model.User;
import com.healthmate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/meals")
@CrossOrigin(origins = "http://localhost:5173")
public class MealController {

    @Autowired
    private MealService mealService;

    @Autowired
    private UserRepository userRepository;

    private String getAuthenticatedUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username).map(User::getId).orElse(null);
    }

    @PostMapping
    public ResponseEntity<Meal> logMeal(@RequestBody Meal meal) {
        String userId = getAuthenticatedUserId();
        if (userId == null)
            return ResponseEntity.status(401).build();
        meal.setUserId(userId);
        return ResponseEntity.ok(mealService.saveMeal(meal));
    }

    @GetMapping("/user")
    public ResponseEntity<List<Meal>> getUserMeals() {
        String userId = getAuthenticatedUserId();
        if (userId == null)
            return ResponseEntity.status(401).build();
        return ResponseEntity.ok(mealService.getUserMeals(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeal(@PathVariable String id) {
        mealService.deleteMeal(id);
        return ResponseEntity.ok().build();
    }
}
