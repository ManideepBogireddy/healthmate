package com.healthmate.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "diet_plans")
public class DietPlan {
    @Id
    private String id;
    private String trainerId;
    private String goal; // weight loss, muscle gain, general fitness
    private String description;
    private List<String> mealSuggestions = new ArrayList<>();

    public DietPlan() {}

    public DietPlan(String trainerId, String goal, String description, List<String> mealSuggestions) {
        this.trainerId = trainerId;
        this.goal = goal;
        this.description = description;
        this.mealSuggestions = mealSuggestions;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTrainerId() {
        return trainerId;
    }

    public void setTrainerId(String trainerId) {
        this.trainerId = trainerId;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getMealSuggestions() {
        return mealSuggestions;
    }

    public void setMealSuggestions(List<String> mealSuggestions) {
        this.mealSuggestions = mealSuggestions;
    }
}
