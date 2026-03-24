package com.healthmate.repository;

import com.healthmate.model.DietPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface DietPlanRepository extends MongoRepository<DietPlan, String> {
    List<DietPlan> findByTrainerId(String trainerId);
}
