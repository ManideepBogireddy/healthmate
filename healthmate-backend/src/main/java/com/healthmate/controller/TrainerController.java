package com.healthmate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.healthmate.model.Trainer;
import com.healthmate.service.TrainerService;
import com.healthmate.service.UserDetailsImpl;
import com.healthmate.exception.ResourceNotFoundException;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/trainer")
public class TrainerController {

    @Autowired
    private TrainerService trainerService;

    @GetMapping("/match")
    @PreAuthorize("hasRole('USER') or hasRole('TRAINER') or hasRole('ADMIN')")
    public List<Trainer> matchTrainers(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return trainerService.matchTrainers(userDetails.getId());
    }

    @PostMapping("/profile")
    @PreAuthorize("hasRole('TRAINER') or hasRole('ADMIN')")
    public Trainer createTrainerProfile(@Valid @RequestBody Trainer trainer,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        trainer.setUserId(userDetails.getId());
        return trainerService.createTrainer(trainer);
    }

    @GetMapping("/all")
    public List<Trainer> getAllTrainers() {
        return trainerService.getAllTrainers();
    }

    @GetMapping("/{id}")
    public Trainer getTrainerById(@PathVariable String id) {
        return trainerService.getTrainerById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found"));
    }
}
