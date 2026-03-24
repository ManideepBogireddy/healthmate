package com.healthmate.controller;

import com.healthmate.model.WorkoutPlan;
import com.healthmate.service.WorkoutPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/workout-plans")
@CrossOrigin(origins = "*")
public class WorkoutPlanController {
    @Autowired
    private WorkoutPlanService workoutPlanService;

    @PostMapping
    public WorkoutPlan createWorkoutPlan(@RequestBody WorkoutPlan workoutPlan) {
        return workoutPlanService.createWorkoutPlan(workoutPlan);
    }

    @GetMapping("/trainer/{trainerId}")
    public List<WorkoutPlan> getWorkoutPlansByTrainer(@PathVariable String trainerId) {
        return workoutPlanService.getWorkoutPlansByTrainer(trainerId);
    }

    @DeleteMapping("/{id}")
    public void deleteWorkoutPlan(@PathVariable String id) {
        workoutPlanService.deleteWorkoutPlan(id);
    }
}
