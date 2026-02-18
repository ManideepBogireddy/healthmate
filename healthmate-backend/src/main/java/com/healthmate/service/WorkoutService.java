package com.healthmate.service;

import com.healthmate.model.Workout;
import com.healthmate.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class WorkoutService {

    @Autowired
    private WorkoutRepository workoutRepository;

    public Workout saveWorkout(Workout workout) {
        return workoutRepository.save(workout);
    }

    public List<Workout> getWorkoutsByUserId(String userId) {
        return workoutRepository.findByUserId(userId);
    }

    public void deleteWorkout(String id) {
        workoutRepository.deleteById(id);
    }
}