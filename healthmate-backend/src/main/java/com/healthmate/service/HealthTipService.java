package com.healthmate.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class HealthTipService {

    private final Map<String, Tip> dailyTips = new HashMap<>();

    public HealthTipService() {
        dailyTips.put("MONDAY", new Tip("Weight Training",
                "Focus on heavy compound movements today (Squats, Deadlifts). Remember to get at least 8 hours of sleep tonight for optimal muscle recovery and growth.",
                "🏋️‍♂️", "#8b5cf6"));
        dailyTips.put("TUESDAY", new Tip("Cardio Blast",
                "Prioritize complex carbohydrates like oats or brown rice today. Your body needs to replenish glycogen stores after intense cardio sessions.",
                "🏃‍♂️", "#10b981"));
        dailyTips.put("WEDNESDAY", new Tip("Yoga & Mindfulness",
                "Focus on 'clean eating' today. Avoid processed sugars to reduce inflammation and improve your mental clarity for meditation.",
                "🧘‍♂️", "#0ea5e9"));
        dailyTips.put("THURSDAY", new Tip("Active Recovery",
                "Low-intensity movement is key today. Try some light stretching or mobility work to keep blood flowing without overtaxing your nervous system.",
                "🔄", "#f59e0b"));
        dailyTips.put("FRIDAY", new Tip("HIIT / Strength",
                "Ensure high protein intake across all meals today (2g per kg of body weight) to support tissue repair following a week of training.",
                "⚡", "#ec4899"));
        dailyTips.put("SATURDAY", new Tip("Nature & Movement",
                "Take your workout outdoors! Sunlight exposure helps regulate your circadian rhythm and boosts Vitamin D for bone health.",
                "🌳", "#22c55e"));
        dailyTips.put("SUNDAY", new Tip("Reset & Plan",
                "Preparation is 80% of the battle. Use today to meal prep for the upcoming week and set your fitness intentions for tomorrow.",
                "📋", "#6366f1"));
    }

    public Tip getTipForToday() {
        String day = LocalDate.now().getDayOfWeek().name();
        return dailyTips.getOrDefault(day, dailyTips.get("MONDAY"));
    }

    public static class Tip {
        private String title;
        private String tip;
        private String icon;
        private String color;

        public Tip(String title, String tip, String icon, String color) {
            this.title = title;
            this.tip = tip;
            this.icon = icon;
            this.color = color;
        }

        public String getTitle() {
            return title;
        }

        public String getTip() {
            return tip;
        }

        public String getIcon() {
            return icon;
        }

        public String getColor() {
            return color;
        }
    }
}
