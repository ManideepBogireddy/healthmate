package com.healthmate.repository;

import com.healthmate.model.Meal;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MealRepository extends MongoRepository<Meal, String> {
    List<Meal> findByUserId(String userId);
}
