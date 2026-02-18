package com.healthmate.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "health_plans")
public class HealthPlan {
    @Id
    private String id;

    private String userId; // Link to user

    private double calculatedBmi;
    private String bmiCategory;

    private String dailyWaterIntake; // e.g. "3 Liters"
    private String sleepRecommendation; // e.g. "7-8 Hours"

    private List<String> dietPlan; // List of meals/suggestions
    private List<String> exercisePlan; // List of exercises

    private String goal; // e.g. "Weight Loss"
    private int dailyCalories; // e.g. 2000

    public HealthPlan() {
    }

    public HealthPlan(String userId, double calculatedBmi, String bmiCategory, String dailyWaterIntake,
            String sleepRecommendation, List<String> dietPlan, List<String> exercisePlan) {
        this.userId = userId;
        this.calculatedBmi = calculatedBmi;
        this.bmiCategory = bmiCategory;
        this.dailyWaterIntake = dailyWaterIntake;
        this.sleepRecommendation = sleepRecommendation;
        this.dietPlan = dietPlan;
        this.exercisePlan = exercisePlan;
    }

    public HealthPlan(String userId, double calculatedBmi, String bmiCategory, String dailyWaterIntake,
            String sleepRecommendation, List<String> dietPlan, List<String> exercisePlan, String goal,
            int dailyCalories) {
        this(userId, calculatedBmi, bmiCategory, dailyWaterIntake, sleepRecommendation, dietPlan, exercisePlan);
        this.goal = goal;
        this.dailyCalories = dailyCalories;
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
}
