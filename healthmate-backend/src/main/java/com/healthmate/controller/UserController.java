package com.healthmate.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthmate.model.HealthPlan;
import com.healthmate.model.User;
import com.healthmate.repository.UserRepository;
import com.healthmate.service.HealthService;
import com.healthmate.service.UserDetailsImpl;
import com.healthmate.dto.MessageResponse;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    HealthService healthService;

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        String userId = getCurrentUserId();
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        // Avoid sending password in response: simple way is to null it or use DTO.
        // For quickness, hiding password manually or we could have used a UserDTO.
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/update-metrics")
    public ResponseEntity<?> updateMetrics(@RequestBody User updatedMetrics) {
        String userId = getCurrentUserId();
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Update fields
        user.setWeight(updatedMetrics.getWeight());
        user.setHeight(updatedMetrics.getHeight());
        user.setAge(updatedMetrics.getAge());
        user.setActivityLevel(updatedMetrics.getActivityLevel());
        user.setHealthGoal(updatedMetrics.getHealthGoal());

        userRepository.save(user);

        // Regenerate plan since metrics changed
        healthService.regeneratePlan(userId);

        return ResponseEntity.ok(new MessageResponse("Metrics updated and plan regenerated!"));
    }

    @GetMapping("/plan")
    public ResponseEntity<HealthPlan> getHealthPlan() {
        String userId = getCurrentUserId();
        HealthPlan plan = healthService.generateOrGetPlan(userId);
        return ResponseEntity.ok(plan);
    }

    @PostMapping("/regenerate-plan")
    public ResponseEntity<?> regenerateHealthPlan() {
        String userId = getCurrentUserId();
        HealthPlan plan = healthService.regeneratePlan(userId);
        return ResponseEntity.ok(plan);
    }

    @GetMapping("/bmi-status")
    public ResponseEntity<?> getBmiStatus() {
        String userId = getCurrentUserId();
        HealthPlan plan = healthService.generateOrGetPlan(userId);
        return ResponseEntity.ok().body(new BmiResponse(plan.getCalculatedBmi(), plan.getBmiCategory()));
    }

    public static class BmiResponse {
        private double bmi;
        private String category;

        public BmiResponse(double bmi, String category) {
            this.bmi = bmi;
            this.category = category;
        }

        public double getBmi() {
            return bmi;
        }

        public String getCategory() {
            return category;
        }
    }
}
