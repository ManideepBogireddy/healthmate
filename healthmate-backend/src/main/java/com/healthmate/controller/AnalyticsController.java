package com.healthmate.controller;

import java.time.LocalDate;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
// import com.healthmate.model.User; // Removed unused import
import com.healthmate.repository.DailyLogRepository;
import com.healthmate.repository.UserRepository;
import com.healthmate.service.UserDetailsImpl;
import com.healthmate.dto.MessageResponse;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    private static final Logger logger = LoggerFactory.getLogger(AnalyticsController.class);

    @Autowired
    DailyLogRepository dailyLogRepository;

    @Autowired
    UserRepository userRepository; // To update current weight if needed

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }

    @GetMapping("/status")
    public ResponseEntity<String> getStatus() {
        return ResponseEntity.ok("Analytics Controller Active - Version 2.2 (Logging/JsonProperty Fix)");
    }

    @PostMapping("/log")
    public ResponseEntity<?> logDailyStats(@RequestBody DailyLog logRequest) {
        String userId = getCurrentUserId();
        LocalDate date = logRequest.getDate() != null ? logRequest.getDate() : LocalDate.now();

        logger.info("DEBUG: Logging stats for User: {} Date: {}", userId, date);
        logger.info("DEBUG: Incoming Water: {} Sleep: {}", logRequest.getWaterIntake(), logRequest.getSleepDuration());

        // Check if log exists for this date
        DailyLog log = dailyLogRepository.findByUserIdAndDate(userId, date)
                .orElse(new DailyLog(userId, date, logRequest.getWeight(), logRequest.getCaloriesBurned(),
                        logRequest.getWaterIntake(), logRequest.getSleepDuration(), logRequest.getNotes(), 0, 0.0,
                        0.0));

        // Update values
        log.setWeight(logRequest.getWeight());
        log.setCaloriesBurned(logRequest.getCaloriesBurned());
        log.setWaterIntake(logRequest.getWaterIntake());
        log.setSleepDuration(logRequest.getSleepDuration());
        log.setNotes(logRequest.getNotes());
        log.setDailyCalorieTarget(logRequest.getDailyCalorieTarget());
        log.setDailyWaterTarget(logRequest.getDailyWaterTarget());
        log.setDailySleepTarget(logRequest.getDailySleepTarget());

        logger.info("DEBUG: Saving log - Goal: C={}, W={}, S={}", log.getDailyCalorieTarget(),
                log.getDailyWaterTarget(),
                log.getDailySleepTarget());
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

    @GetMapping("/streak")
    public ResponseEntity<?> getStreak() {
        String userId = getCurrentUserId();
        List<DailyLog> logs = dailyLogRepository.findByUserIdOrderByDateAsc(userId);

        if (logs.isEmpty()) {
            return ResponseEntity.ok(0);
        }

        java.util.Set<LocalDate> loggedDates = logs.stream()
                .map(DailyLog::getDate)
                .collect(java.util.stream.Collectors.toSet());

        LocalDate today = LocalDate.now();
        LocalDate startPoint = null;

        if (loggedDates.contains(today)) {
            startPoint = today;
        } else if (loggedDates.contains(today.minusDays(1))) {
            startPoint = today.minusDays(1);
        }

        if (startPoint == null) {
            return ResponseEntity.ok(0);
        }

        int streak = 0;
        LocalDate current = startPoint;
        while (loggedDates.contains(current)) {
            streak++;
            current = current.minusDays(1);
        }

        return ResponseEntity.ok(streak);
    }
}
