package com.healthmate.service;

import org.springframework.stereotype.Service;
import java.util.Locale;

@Service
public class ChatService {

    public String getResponse(String message) {
        if (message == null || message.trim().isEmpty()) {
            return "I didn't catch that. Could you please repeat?";
        }

        String input = message.toLowerCase(Locale.ROOT);

        // Blocking unrelated topics (Politics, History, Programming, etc.)
        if (isUnrelated(input)) {
            return "I'm sorry, but I only assist with HealthMate application features and health tracking guidance. How can I help you navigate the app today?";
        }

        // 1. Dashboard
        if (input.contains("progress") || input.contains("stats") || input.contains("summary")
                || input.contains("overview")) {
            return "You can see your daily health summary and progress overview on the **Dashboard**. It displays your calories, workout progress, water intake, and steps in one place.";
        }

        // 2. Profile Page
        if (input.contains("update profile") || input.contains("personal info") || input.contains("change weight")
                || input.contains("change height") || input.contains("activity level")
                || input.contains("health goal")) {
            return "To update your personal information or health goals, open the **Profile** page and click 'Update Profile'. This helps us calculate your personalized calorie targets and BMI.";
        }

        // 3. Goal Center & Nutrition Targets

        // Protein specific intent
        if (input.contains("protein") && (input.contains("how much") || input.contains("requirement")
                || input.contains("intake") || input.contains("target"))) {
            return "You can see your daily protein target in the Goal Center. The Protein Target is calculated based on your profile information, activity level, and health goal.";
        }

        // Calories specific intent
        if (input.contains("calorie") && (input.contains("how many") || input.contains("how much")
                || input.contains("daily") || input.contains("goal") || input.contains("need"))) {
            return "You can see your recommended daily calories in the **Goal Center** under 'Daily Calories'.";
        }

        // Distance and Steps specific intent
        if (input.contains("km") || input.contains("walk") || input.contains("distance") || input.contains("step")) {
            if (input.contains("goal") || input.contains("how many") || input.contains("target")
                    || input.contains("need")) {
                return "You can view your daily step and activity goals in the **Goal Center**. Your personalized exercise plan also provides recommendations based on your profile.";
            }
            return "You can track your daily steps and distance walked in the **Vitals Hub**. Use the 'Save Daily Vitals' button to record your progress!";
        }

        if (input.contains("how many calories") || input.contains("how much protein") || input.contains("protein")
                || input.contains("carb") || input.contains("fat") || input.contains("target")
                || input.contains("requirement") || input.contains("goal")) {
            return "You can see your personalized nutrition targets in the **Goal Center** of HealthMate.\n\n" +
                    "The Goal Center displays your recommended daily values including:\n" +
                    "• Daily Calories\n" +
                    "• Protein Target\n" +
                    "• Carbs Target\n" +
                    "• Fats Target\n\n" +
                    "These targets are calculated based on your profile information, activity level, and health goal.\n\n"
                    +
                    "Open the **Goal Center** from the sidebar to see your daily nutrition targets.";
        }

        // 4. Workout Tracker
        if ((input.contains("workout") || input.contains("exercise"))
                && (input.contains("track") || input.contains("log") || input.contains("add"))) {
            return "You can log workouts in the Workout Tracker page using the 'Log New Workout' section.";
        }

        if (input.contains("workout") || input.contains("exercise")
                || input.contains("log") && input.contains("workout") || input.contains("cardio")
                || input.contains("strength")) {
            return "You can record your exercises in the **Workout Tracker**. Use the 'Log New Workout' section to enter the exercise type, duration, and calories burned.";
        }

        // 5. Meal Studio
        if ((input.contains("meal") || input.contains("food"))
                && (input.contains("track") || input.contains("add") || input.contains("log"))) {
            return "You can track meals in the Meal Studio page using the 'Log a Meal' section.";
        }

        if (input.contains("meal") || input.contains("food") || input.contains("eat") || input.contains("breakfast")
                || input.contains("lunch") || input.contains("snack") || input.contains("dinner")
                || input.contains("track food")) {
            return "You can track your nutrition and log meals in the **Meal Studio** page. It also offers smart meal suggestions and a daily calorie intake chart.";
        }

        // 7. Blog Studio
        if (input.contains("blog") || input.contains("story") || input.contains("stories") || input.contains("post")
                || input.contains("write") || input.contains("article") || input.contains("community")) {
            return "The **Blog Studio** is where you can read and share health journeys, tips, and inspiration. You can 'Write a story', 'Like' posts, and 'Comment' to engage with the community.";
        }

        // 8. Trainer Match
        if (input.contains("trainer") || input.contains("coach") || input.contains("expert") || input.contains("find")
                || input.contains("match") || input.contains("recommendation")) {
            return "Need professional guidance? Use the **Find Trainer** page to get personalized trainer recommendations based on your health goals and location. You can view trainer profiles, their specialties, and certifications.";
        }

        // 9. Vitals Hub & 10. BMI Calculator
        if (input.contains("bmi") || input.contains("calculate") || input.contains("water") || input.contains("sleep")
                || input.contains("vitals") || input.contains("steps")
                || input.contains("weight") && !input.contains("update")) {
            if (input.contains("bmi")) {
                return "Your BMI can be calculated in the **Vitals Hub** using your height and weight. Look for the BMI Calculator section inside the Vitals Hub.";
            }
            return "You can track daily metrics like weight, water intake, and sleep duration in the **Vitals Hub**. Use the 'Save Daily Vitals' button to record your latest data.";
        }

        // Default Helpful Response
        return "Hello! I am **HealthMate AI**, your helpful assistant. I can guide you through the **Dashboard**, **Goal Center**, **Workout Tracker**, **Meal Studio**, **Blog Studio**, **Find Trainer**, and **Vitals Hub**.\n\n"
                +
                "What would you like help with today?";
    }

    private boolean isUnrelated(String input) {
        String[] unrelatedKeywords = {
                "politics", "history", "programming", "code", "weather", "news",
                "who is", "what is the capital", "recipe for", "java", "python", "javascript"
        };
        for (String keyword : unrelatedKeywords) {
            if (input.contains(keyword)) {
                return true;
            }
        }
        return false;
    }
}
