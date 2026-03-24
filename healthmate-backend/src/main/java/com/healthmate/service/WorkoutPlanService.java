package com.healthmate.service;

import com.healthmate.model.WorkoutPlan;
import com.healthmate.repository.WorkoutPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class WorkoutPlanService {
    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    public WorkoutPlan createWorkoutPlan(WorkoutPlan workoutPlan) {
        return workoutPlanRepository.save(workoutPlan);
    }

    public List<WorkoutPlan> getWorkoutPlansByTrainer(String trainerId) {
        return workoutPlanRepository.findByTrainerId(trainerId);
    }

    public void deleteWorkoutPlan(String id) {
        workoutPlanRepository.deleteById(id);
    }
}
