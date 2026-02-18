package com.healthmate.controller;

import com.healthmate.model.Workout;
import com.healthmate.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;

    private String getCurrentUserId() {
        org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        com.healthmate.service.UserDetailsImpl userDetails = (com.healthmate.service.UserDetailsImpl) authentication
                .getPrincipal();
        return userDetails.getId();
    }

    @PostMapping("/add")
    public ResponseEntity<Workout> addWorkout(@RequestBody Workout workout) {
        workout.setUserId(getCurrentUserId());
        Workout savedWorkout = workoutService.saveWorkout(workout);
        return ResponseEntity.ok(savedWorkout);
    }

    @GetMapping("/user") // Removed {userId} - get from token
    public ResponseEntity<List<Workout>> getUserWorkouts() {
        List<Workout> workouts = workoutService.getWorkoutsByUserId(getCurrentUserId());
        return ResponseEntity.ok(workouts);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorkout(@PathVariable String id) {
        workoutService.deleteWorkout(id);
        return ResponseEntity.ok("Workout deleted successfully");
    }
}