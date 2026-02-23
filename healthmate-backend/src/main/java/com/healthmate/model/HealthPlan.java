package com.healthmate.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.time.LocalDate;

@Document(collection = "health_plans")
public class HealthPlan {
    @Id
    private String id;

    private String userId; // Link to user
    private LocalDate lastUpdated;

    private double calculatedBmi;
    private String bmiCategory;

    private String dailyWaterIntake; // e.g. "3 Liters"
    private String sleepRecommendation; // e.g. "7-8 Hours"

    private List<String> dietPlan; // List of meals/suggestions
    private List<String> exercisePlan; // List of exercises

    private String goal; // e.g. "Weight Loss"
    private int dailyCalories; // e.g. 2000
    private int proteinGrams;
    private int carbsGrams;
    private int fatsGrams;

    private List<MealSuggestion> mealSuggestions;

    public static class MealSuggestion {
        private String mealType; // Breakfast, Lunch, etc.
        private int calories;
        private int protein;
        private int carbs;
        private int fats;
        private String suggestion; // e.g., "Oatmeal with Almonds"

        public MealSuggestion() {
        }

        public MealSuggestion(String mealType, int calories, int protein, int carbs, int fats, String suggestion) {
            this.mealType = mealType;
            this.calories = calories;
            this.protein = protein;
            this.carbs = carbs;
            this.fats = fats;
            this.suggestion = suggestion;
        }

        // Getters and Setters
        public String getMealType() {
            return mealType;
        }

        public void setMealType(String mealType) {
            this.mealType = mealType;
        }

        public int getCalories() {
            return calories;
        }

        public void setCalories(int calories) {
            this.calories = calories;
        }

        public int getProtein() {
            return protein;
        }

        public void setProtein(int protein) {
            this.protein = protein;
        }

        public int getCarbs() {
            return carbs;
        }

        public void setCarbs(int carbs) {
            this.carbs = carbs;
        }

        public int getFats() {
            return fats;
        }

        public void setFats(int fats) {
            this.fats = fats;
        }

        public String getSuggestion() {
            return suggestion;
        }

        public void setSuggestion(String suggestion) {
            this.suggestion = suggestion;
        }
    }

    public HealthPlan() {
    }

    public HealthPlan(String userId, double calculatedBmi, String bmiCategory, String dailyWaterIntake,
            String sleepRecommendation, List<String> dietPlan, List<String> exercisePlan) {
        this.userId = userId;
        this.lastUpdated = LocalDate.now();
        this.calculatedBmi = calculatedBmi;
        this.bmiCategory = bmiCategory;
        this.dailyWaterIntake = dailyWaterIntake;
        this.sleepRecommendation = sleepRecommendation;
        this.dietPlan = dietPlan;
        this.exercisePlan = exercisePlan;
    }

    public HealthPlan(String userId, double calculatedBmi, String bmiCategory, String dailyWaterIntake,
            String sleepRecommendation, List<String> dietPlan, List<String> exercisePlan, String goal,
            int dailyCalories, int proteinGrams, int carbsGrams, int fatsGrams, List<MealSuggestion> mealSuggestions) {
        this.userId = userId;
        this.lastUpdated = LocalDate.now();
        this.calculatedBmi = calculatedBmi;
        this.bmiCategory = bmiCategory;
        this.dailyWaterIntake = dailyWaterIntake;
        this.sleepRecommendation = sleepRecommendation;
        this.dietPlan = dietPlan;
        this.exercisePlan = exercisePlan;
        this.goal = goal;
        this.dailyCalories = dailyCalories;
        this.proteinGrams = proteinGrams;
        this.carbsGrams = carbsGrams;
        this.fatsGrams = fatsGrams;
        this.mealSuggestions = mealSuggestions;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public LocalDate getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDate lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public double getCalculatedBmi() {
        return calculatedBmi;
    }

    public void setCalculatedBmi(double calculatedBmi) {
        this.calculatedBmi = calculatedBmi;
    }

    public String getBmiCategory() {
        return bmiCategory;
    }

    public void setBmiCategory(String bmiCategory) {
        this.bmiCategory = bmiCategory;
    }

    public String getDailyWaterIntake() {
        return dailyWaterIntake;
    }

    public void setDailyWaterIntake(String dailyWaterIntake) {
        this.dailyWaterIntake = dailyWaterIntake;
    }

    public String getSleepRecommendation() {
        return sleepRecommendation;
    }

    public void setSleepRecommendation(String sleepRecommendation) {
        this.sleepRecommendation = sleepRecommendation;
    }

    public List<String> getDietPlan() {
        return dietPlan;
    }

    public void setDietPlan(List<String> dietPlan) {
        this.dietPlan = dietPlan;
    }

    public List<String> getExercisePlan() {
        return exercisePlan;
    }

    public void setExercisePlan(List<String> exercisePlan) {
        this.exercisePlan = exercisePlan;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public int getDailyCalories() {
        return dailyCalories;
    }

    public void setDailyCalories(int dailyCalories) {
        this.dailyCalories = dailyCalories;
    }

    public int getProteinGrams() {
        return proteinGrams;
    }

    public void setProteinGrams(int proteinGrams) {
        this.proteinGrams = proteinGrams;
    }

    public int getCarbsGrams() {
        return carbsGrams;
    }

    public void setCarbsGrams(int carbsGrams) {
        this.carbsGrams = carbsGrams;
    }

    public int getFatsGrams() {
        return fatsGrams;
    }

    public void setFatsGrams(int fatsGrams) {
        this.fatsGrams = fatsGrams;
    }

    public List<MealSuggestion> getMealSuggestions() {
        return mealSuggestions;
    }

    public void setMealSuggestions(List<MealSuggestion> mealSuggestions) {
        this.mealSuggestions = mealSuggestions;
    }
}
