package com.healthmate.repository;

import com.healthmate.model.WorkoutPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface WorkoutPlanRepository extends MongoRepository<WorkoutPlan, String> {
    List<WorkoutPlan> findByTrainerId(String trainerId);
}
