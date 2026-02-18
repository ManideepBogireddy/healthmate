package com.healthmate.model;

import org.springframework.data.annotation.Id;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Document(collection = "daily_logs")
public class DailyLog {
    @Id
    private String id;

    private String userId;

    private LocalDate date;

    private double weight; // kg
    private int caloriesBurned;
    @JsonProperty("waterIntake")
    private Double waterIntake = 0.0; // liters
    @JsonProperty("sleepDuration")
    private Double sleepDuration = 0.0; // hours
    private String notes;
    @JsonProperty("dailyCalorieTarget")
    private int dailyCalorieTarget;
    @JsonProperty("dailyWaterTarget")
    private double dailyWaterTarget; // liters
    @JsonProperty("dailySleepTarget")
    private double dailySleepTarget; // hours

    public DailyLog() {
    }

    public DailyLog(String userId, LocalDate date, double weight, int caloriesBurned, Double waterIntake,
            Double sleepDuration, String notes, int dailyCalorieTarget, double dailyWaterTarget,
            double dailySleepTarget) {
        this.userId = userId;
        this.date = date;
        this.weight = weight;
        this.caloriesBurned = caloriesBurned;
        this.waterIntake = waterIntake;
        this.sleepDuration = sleepDuration;
        this.notes = notes;
        this.dailyCalorieTarget = dailyCalorieTarget;
        this.dailyWaterTarget = dailyWaterTarget;
        this.dailySleepTarget = dailySleepTarget;
    }

    // Overloaded constructor for backward compatibility
    public DailyLog(String userId, LocalDate date, double weight, int caloriesBurned, String notes,
            int dailyCalorieTarget, double dailyWaterTarget, double dailySleepTarget) {
        this.userId = userId;
        this.date = date;
        this.weight = weight;
        this.caloriesBurned = caloriesBurned;
        this.notes = notes;
        this.dailyCalorieTarget = dailyCalorieTarget;
        this.dailyWaterTarget = dailyWaterTarget;
        this.dailySleepTarget = dailySleepTarget;
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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public int getCaloriesBurned() {
        return caloriesBurned;
    }

    public void setCaloriesBurned(int caloriesBurned) {
        this.caloriesBurned = caloriesBurned;
    }

    public Double getWaterIntake() {
        return waterIntake;
    }

    public void setWaterIntake(Double waterIntake) {
        this.waterIntake = waterIntake;
    }

    public Double getSleepDuration() {
        return sleepDuration;
    }

    public void setSleepDuration(Double sleepDuration) {
        this.sleepDuration = sleepDuration;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public int getDailyCalorieTarget() {
        return dailyCalorieTarget;
    }

    public void setDailyCalorieTarget(int dailyCalorieTarget) {
        this.dailyCalorieTarget = dailyCalorieTarget;
    }

    public double getDailyWaterTarget() {
        return dailyWaterTarget;
    }

    public void setDailyWaterTarget(double dailyWaterTarget) {
        this.dailyWaterTarget = dailyWaterTarget;
    }

    public double getDailySleepTarget() {
        return dailySleepTarget;
    }

    public void setDailySleepTarget(double dailySleepTarget) {
        this.dailySleepTarget = dailySleepTarget;
    }
}
