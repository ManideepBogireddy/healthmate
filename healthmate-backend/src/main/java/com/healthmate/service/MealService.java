package com.healthmate.service;

import com.healthmate.model.Meal;
import com.healthmate.repository.MealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MealService {
    @Autowired
    private MealRepository mealRepository;

    public Meal saveMeal(Meal meal) {
        return mealRepository.save(meal);
    }

    public List<Meal> getUserMeals(String userId) {
        return mealRepository.findByUserId(userId);
    }

    public void deleteMeal(String id) {
        mealRepository.deleteById(id);
    }
}
