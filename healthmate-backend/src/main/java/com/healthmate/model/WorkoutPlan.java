package com.healthmate.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "workout_plans")
public class WorkoutPlan {
    @Id
    private String id;
    private String trainerId;
    private String programName;
    private String duration; // e.g., 4 weeks
    private List<String> exercises = new ArrayList<>();
    private String targetGoal;

    public WorkoutPlan() {}

    public WorkoutPlan(String trainerId, String programName, String duration, List<String> exercises, String targetGoal) {
        this.trainerId = trainerId;
        this.programName = programName;
        this.duration = duration;
        this.exercises = exercises;
        this.targetGoal = targetGoal;
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

    public String getProgramName() {
        return programName;
    }

    public void setProgramName(String programName) {
        this.programName = programName;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public List<String> getExercises() {
        return exercises;
    }

    public void setExercises(List<String> exercises) {
        this.exercises = exercises;
    }

    public String getTargetGoal() {
        return targetGoal;
    }

    public void setTargetGoal(String targetGoal) {
        this.targetGoal = targetGoal;
    }
}
