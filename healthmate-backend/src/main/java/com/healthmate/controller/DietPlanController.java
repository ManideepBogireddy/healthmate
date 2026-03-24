package com.healthmate.controller;

import com.healthmate.model.DietPlan;
import com.healthmate.service.DietPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/diet-plans")
@CrossOrigin(origins = "*")
public class DietPlanController {
    @Autowired
    private DietPlanService dietPlanService;

    @PostMapping
    public DietPlan createDietPlan(@RequestBody DietPlan dietPlan) {
        return dietPlanService.createDietPlan(dietPlan);
    }

    @GetMapping("/trainer/{trainerId}")
    public List<DietPlan> getDietPlansByTrainer(@PathVariable String trainerId) {
        return dietPlanService.getDietPlansByTrainer(trainerId);
    }

    @DeleteMapping("/{id}")
    public void deleteDietPlan(@PathVariable String id) {
        dietPlanService.deleteDietPlan(id);
    }
}
