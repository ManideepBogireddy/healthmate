package com.healthmate.controller;

import java.time.LocalDate;
import java.util.List;

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

import com.healthmate.model.DailyLog;
import com.healthmate.model.User;
import com.healthmate.repository.DailyLogRepository;
import com.healthmate.repository.UserRepository;
import com.healthmate.service.UserDetailsImpl;
import com.healthmate.dto.MessageResponse;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    DailyLogRepository dailyLogRepository;

    @Autowired
    UserRepository userRepository; // To update current weight if needed

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }

    @PostMapping("/log")
    public ResponseEntity<?> logDailyStats(@RequestBody DailyLog logRequest) {
        String userId = getCurrentUserId();
        LocalDate today = LocalDate.now();

        // Check if log exists for today
        DailyLog log = dailyLogRepository.findByUserIdAndDate(userId, today)
                .orElse(new DailyLog(userId, today, logRequest.getWeight(), logRequest.getCaloriesBurned(),
                        logRequest.getNotes()));

        // Update values
        log.setWeight(logRequest.getWeight());
        log.setCaloriesBurned(logRequest.getCaloriesBurned());
        log.setNotes(logRequest.getNotes());

        dailyLogRepository.save(log);

        // Optional: Update user's current weight in profile too
        userRepository.findById(userId).ifPresent(user -> {
            user.setWeight(logRequest.getWeight());
            userRepository.save(user);
        });

        return ResponseEntity.ok(new MessageResponse("Daily stats logged successfully!"));
    }

    @GetMapping("/history")
    public ResponseEntity<List<DailyLog>> getHistory() {
        String userId = getCurrentUserId();
        List<DailyLog> logs = dailyLogRepository.findByUserIdOrderByDateAsc(userId);
        return ResponseEntity.ok(logs);
    }
}
