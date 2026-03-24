package com.healthmate.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healthmate.model.Trainer;
import com.healthmate.model.User;
import com.healthmate.exception.ResourceNotFoundException;
import com.healthmate.repository.TrainerRepository;
import com.healthmate.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class TrainerService {

    @Autowired
    private TrainerRepository trainerRepository;

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(TrainerService.class);

    public Trainer createTrainer(Trainer trainer) {
        if (trainerRepository.findByUserId(trainer.getUserId()).isPresent()) {
            throw new RuntimeException("Trainer profile already exists for this user");
        }
        Trainer savedTrainer = trainerRepository.save(trainer);
        logger.info("Trainer profile created for user {}", trainer.getUserId());
        return savedTrainer;
    }

    public List<Trainer> getAllTrainers() {
        return trainerRepository.findAll();
    }

    public Optional<Trainer> getTrainerById(String id) {
        return trainerRepository.findById(id);
    }

    public Trainer getTrainerByUserId(String userId) {
        return trainerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer profile not found"));
    }


    public List<Trainer> matchTrainers(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String goal = (user.getHealthGoal() != null) ? user.getHealthGoal().toLowerCase().replace("_", " ") : "";
        String userLocation = user.getLocation();

        List<Trainer> allTrainers = trainerRepository.findAll();

        return allTrainers.stream()
                .filter(t -> t.isCertified()) // Only certified trainers
                .filter(t -> {
                    // Strict State Filtering as requested: 
                    // If user has a state, show only trainers from that state.
                    String uS = user.getState();
                    if (uS != null && !uS.isEmpty()) {
                        return uS.equalsIgnoreCase(t.getState());
                    }
                    return true;
                })
                .sorted((t1, t2) -> {
                    // Hierarchical prioritization: City > State > Country > Goal Match
                    String uCountry = user.getCountry();
                    String uState = user.getState();
                    String uCity = user.getLocation(); 

                    // Location Ranks
                    int locRank1 = 0;
                    if (uCountry != null && uCountry.equalsIgnoreCase(t1.getCountry())) {
                        locRank1 = 1;
                        if (uState != null && uState.equalsIgnoreCase(t1.getState())) {
                            locRank1 = 2;
                            if (uCity != null && uCity.equalsIgnoreCase(t1.getCity())) {
                                locRank1 = 3;
                            }
                        }
                    }

                    int locRank2 = 0;
                    if (uCountry != null && uCountry.equalsIgnoreCase(t2.getCountry())) {
                        locRank2 = 1;
                        if (uState != null && uState.equalsIgnoreCase(t2.getState())) {
                            locRank2 = 2;
                            if (uCity != null && uCity.equalsIgnoreCase(t2.getCity())) {
                                locRank2 = 3;
                            }
                        }
                    }

                    // Goal Ranks (Secondary)
                    boolean goalMatch1 = t1.getCompatibleGoals().stream()
                            .anyMatch(g -> {
                                String nG = g.toLowerCase().replace("_", " ");
                                return goal.contains(nG) || nG.contains(goal);
                            });
                    boolean goalMatch2 = t2.getCompatibleGoals().stream()
                            .anyMatch(g -> {
                                String nG = g.toLowerCase().replace("_", " ");
                                return goal.contains(nG) || nG.contains(goal);
                            });

                    if (locRank1 != locRank2) {
                        return Integer.compare(locRank2, locRank1); // Higher location rank first
                    }
                    
                    return Boolean.compare(goalMatch2, goalMatch1); // If location same, goal match first
                })
                .collect(Collectors.toList());
    }

    public Trainer updateTrainer(Trainer trainer) {
        return trainerRepository.save(trainer);
    }
}
