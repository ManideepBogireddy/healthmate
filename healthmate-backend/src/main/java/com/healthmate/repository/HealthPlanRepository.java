package com.healthmate.repository;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.healthmate.model.HealthPlan;

public interface HealthPlanRepository extends MongoRepository<HealthPlan, String> {
    Optional<HealthPlan> findByUserId(String userId);
}
