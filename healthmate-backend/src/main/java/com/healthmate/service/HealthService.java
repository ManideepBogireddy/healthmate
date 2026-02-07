package com.healthmate.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healthmate.model.HealthPlan;
import com.healthmate.model.User;
import com.healthmate.repository.HealthPlanRepository;
import com.healthmate.repository.UserRepository;

@Service
public class HealthService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    HealthPlanRepository healthPlanRepository;

    public HealthPlan generateOrGetPlan(String userId) {
        Optional<HealthPlan> existingPlan = healthPlanRepository.findByUserId(userId);
        if (existingPlan.isPresent()) {
            // In a real app, we might want to regenerate if user stats changed.
            // For now, return existing or regenerate if logic demands.
            // Let's always regenerate specifically for this MVP demo to ensure updates
            // reflect immediately?
            // Or just return existing. Let's return existing to save resources, but add a
            // method to regenerate.
            return existingPlan.get();
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return createPlan(user);
    }

    public HealthPlan regeneratePlan(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        healthPlanRepository.findByUserId(userId).ifPresent(p -> healthPlanRepository.delete(p));
        return createPlan(user);
    }

    private HealthPlan createPlan(User user) {
        double heightM = user.getHeight() / 100.0;
        double bmi = user.getWeight() / (heightM * heightM);
        String category = getBmiCategory(bmi);

        String healthGoal = user.getHealthGoal().toLowerCase();
        String activity = user.getActivityLevel().toLowerCase();

        // Simple Rule Engine
        List<String> diet = new ArrayList<>();
        List<String> exercise = new ArrayList<>();
        String water = "2.5 Liters";
        String sleep = "7-8 Hours";

        // Diet Logic
        if (healthGoal.contains("loss")) {
            diet.add("Breakfast: Oatmeal with Berries");
            diet.add("Lunch: Grilled Chicken Salad");
            diet.add("Dinner: Steamed Vegetables with Fish");
            diet.add("Snack: Green Tea + Almonds");
            diet.add("Calorie Deficit: Maintain 500 kcal deficit");
        } else if (healthGoal.contains("muscle")) {
            diet.add("Breakfast: Eggs + Whole Wheat Toast");
            diet.add("Lunch: Brown Rice + Lean Beef/Chicken");
            diet.add("Dinner: Quinoa + Salmon");
            diet.add("Snack: Protein Shake / Greek Yogurt");
            diet.add("High Protein Intake: 2g per kg of body weight");
        } else {
            diet.add("Balanced Diet: 50% Carbs, 30% Protein, 20% Fats");
            diet.add("Focus on Whole Foods");
            diet.add("Limit Sugar intake");
        }

        // Exercise Logic
        if (activity.equals("low")) {
            exercise.add("Daily 30 min brisk walk");
            exercise.add("Light Yoga / Stretching");
        } else if (activity.equals("medium")) {
            exercise.add("Cardio (Running/Cycling) 3x a week");
            exercise.add("Bodyweight Strength Training 2x a week");
        } else {
            exercise.add("HIIT Workouts 3x a week");
            exercise.add("Heavy Weight Training 4x a week");
        }

        // Custom adjustments based on BMI
        if (category.equals("Obese")) {
            exercise.clear();
            exercise.add("Low Impact Cardio (Swimming/Walking) - Start Slow");
            exercise.add("Consult a doctor before intense training");
        }

        HealthPlan plan = new HealthPlan(user.getId(), bmi, category, water, sleep, diet, exercise);
        return healthPlanRepository.save(plan);
    }

    private String getBmiCategory(double bmi) {
        if (bmi < 18.5)
            return "Underweight";
        if (bmi < 24.9)
            return "Normal";
        if (bmi < 29.9)
            return "Overweight";
        return "Obese";
    }
}
