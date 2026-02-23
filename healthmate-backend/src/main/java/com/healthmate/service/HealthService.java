package com.healthmate.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healthmate.model.HealthPlan;
import com.healthmate.model.User;
import com.healthmate.repository.HealthPlanRepository;
import com.healthmate.repository.UserRepository;

@Service
public class HealthService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    HealthPlanRepository healthPlanRepository;

    public HealthPlan generateOrGetPlan(String userId) {
        Optional<HealthPlan> existingPlan = healthPlanRepository.findByUserId(userId);
        if (existingPlan.isPresent()) {
            HealthPlan plan = existingPlan.get();
            // If the plan is old (different day) or missing AI suggestions, regenerate it
            // automatically
            if (plan.getMealSuggestions() == null || plan.getMealSuggestions().isEmpty() ||
                    plan.getLastUpdated() == null || !plan.getLastUpdated().equals(LocalDate.now())) {
                return regeneratePlan(userId);
            }
            return plan;
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return createPlan(user);
    }

    public HealthPlan regeneratePlan(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        healthPlanRepository.findByUserId(userId).ifPresent(p -> healthPlanRepository.delete(p));
        return createPlan(user);
    }

    private HealthPlan createPlan(User user) {
        double weight = user.getWeight();
        double height = user.getHeight();
        int age = user.getAge();
        double heightM = height / 100.0;
        double bmi = weight / (heightM * heightM);
        String category = getBmiCategory(bmi);

        String healthGoal = (user.getHealthGoal() != null) ? user.getHealthGoal().toLowerCase() : "lose weight";
        String activity = (user.getActivityLevel() != null) ? user.getActivityLevel().toLowerCase() : "lightly active";

        // 1. Calculate BMR (Mifflin-St Jeor Formula)
        // Using -80 as a neutral constant since gender isn't tracked (Men +5, Women
        // -161)
        double bmr = (10 * weight) + (6.25 * height) - (5 * age) - 80;

        // 2. Calculate TDEE (Total Daily Energy Expenditure) based on Activity Level
        double tdeeMultiplier = 1.2; // Default Sedentary
        if (activity.contains("light"))
            tdeeMultiplier = 1.375;
        else if (activity.contains("medium"))
            tdeeMultiplier = 1.55;
        else if (activity.contains("active"))
            tdeeMultiplier = 1.725;
        else if (activity.contains("very"))
            tdeeMultiplier = 1.9;

        double tdee = bmr * tdeeMultiplier;

        // 3. Adjust Calories for Health Goal
        int dailyCals = (int) tdee;
        double proteinRatio = 0.25, carbsRatio = 0.45, fatsRatio = 0.30;

        if (healthGoal.contains("loss")) {
            dailyCals -= 500;
            proteinRatio = 0.35; // Higher protein for muscle preservation
            carbsRatio = 0.35;
            fatsRatio = 0.30;
        } else if (healthGoal.contains("muscle")) {
            dailyCals += 500;
            proteinRatio = 0.30;
            carbsRatio = 0.50; // Higher carbs for energy
            fatsRatio = 0.20;
        }

        // Ensure calories don't drop too low for safety
        if (dailyCals < 1200)
            dailyCals = 1200;

        // 4. Calculate Macro Grams
        int proteinG = (int) ((dailyCals * proteinRatio) / 4);
        int carbsG = (int) ((dailyCals * carbsRatio) / 4);
        int fatsG = (int) ((dailyCals * fatsRatio) / 9);

        // 5. AI Smart Meal Planner - Distribute Macros across meals
        List<HealthPlan.MealSuggestion> mealSuggestions = new ArrayList<>();

        // Distribution ratios: Breakfast (25%), Lunch (35%), Snack (10%), Dinner (30%)
        mealSuggestions.add(createMealSuggestion("Breakfast", 0.25, dailyCals, proteinG, carbsG, fatsG, healthGoal));
        mealSuggestions.add(createMealSuggestion("Lunch", 0.35, dailyCals, proteinG, carbsG, fatsG, healthGoal));
        mealSuggestions.add(createMealSuggestion("Snack", 0.10, dailyCals, proteinG, carbsG, fatsG, healthGoal));
        mealSuggestions.add(createMealSuggestion("Dinner", 0.30, dailyCals, proteinG, carbsG, fatsG, healthGoal));

        // Simple Rule Engine for Plans
        List<String> diet = new ArrayList<>();
        List<String> exercise = new ArrayList<>();
        String water = "2.5 Liters";
        String sleep = "7-8 Hours";

        // ... existing diet logic ...
        if (healthGoal.contains("loss")) {
            diet.add("Breakfast: Oatmeal with Berries");
            diet.add("Lunch: Grilled Chicken Salad");
            diet.add("Dinner: Steamed Vegetables with Fish");
            diet.add("Snack: Green Tea + Almonds");
            diet.add("Focus: Calorie Deficit & High Fiber");
        } else if (healthGoal.contains("muscle")) {
            diet.add("Breakfast: Eggs + Whole Wheat Toast");
            diet.add("Lunch: Brown Rice + Lean Beef/Chicken");
            diet.add("Dinner: Quinoa + Salmon");
            diet.add("Snack: Protein Shake / Greek Yogurt");
            diet.add("Focus: Hypertrophy & Progressive Overload");
        } else {
            diet.add("Balanced Diet: Whole Foods focus");
            diet.add("Limit Sugar and Processed Foods");
        }

        // Exercise Logic
        if (activity.contains("low") || activity.contains("sedentary")) {
            exercise.add("Daily 30 min brisk walk");
            exercise.add("Light Yoga / Stretching");
        } else if (activity.contains("medium") || activity.contains("light")) {
            exercise.add("Cardio (Running/Cycling) 3x a week");
            exercise.add("Bodyweight Strength Training 2x a week");
        } else {
            exercise.add("HIIT Workouts 3x a week");
            exercise.add("Heavy Weight Training 4x a week");
        }

        // Custom adjustments based on BMI
        if (category.equals("Obese")) {
            exercise.clear();
            exercise.add("Low Impact Cardio (Swimming/Walking) - Start Slow");
            exercise.add("Consult a doctor before intense training");
        }

        String goalName = user.getHealthGoal();

        HealthPlan plan = new HealthPlan(user.getId(), bmi, category, water, sleep, diet, exercise, goalName,
                dailyCals, proteinG, carbsG, fatsG, mealSuggestions);
        return healthPlanRepository.save(plan);
    }

    private HealthPlan.MealSuggestion createMealSuggestion(String type, double ratio, int totalCals, int totalP,
            int totalC, int totalF, String goal) {
        int cals = (int) (totalCals * ratio);
        int p = (int) (totalP * ratio);
        int c = (int) (totalC * ratio);
        int f = (int) (totalF * ratio);

        int dayIndex = LocalDate.now().getDayOfWeek().getValue(); // 1 (Mon) to 7 (Sun)
        String food = "";

        if (goal.contains("loss")) {
            if (type.equals("Breakfast")) {
                if (dayIndex % 3 == 0)
                    food = "Vegetable Poha with Peanuts and Lemon";
                else if (dayIndex % 3 == 1)
                    food = "Moong Dal Chilla with Mint Chutney";
                else
                    food = "Oats Upma with Finely Chopped Vegetables";
            } else if (type.equals("Lunch")) {
                if (dayIndex % 3 == 0)
                    food = "Dal Tadka with 1 Bajra Roti and Cucumber Salad";
                else if (dayIndex % 3 == 1)
                    food = "Palak Paneer (Low Fat) with 1 Missi Roti";
                else
                    food = "Brown Rice with Mixed Veg Sambar and Curd";
            } else if (type.equals("Snack")) {
                if (dayIndex % 3 == 0)
                    food = "Masala Chaas (Buttermilk) with Sprouted Moong";
                else if (dayIndex % 3 == 1)
                    food = "Roasted Makhana with Black Salt";
                else
                    food = "Apple slices with a dash of Cinnamon";
            } else { // Dinner
                if (dayIndex % 3 == 0)
                    food = "Lauki (Bottle Gourd) Sabzi with 1 Jowar Roti";
                else if (dayIndex % 3 == 1)
                    food = "Grilled Paneer Salad with Bell Peppers";
                else
                    food = "Tinda Masala with 1 Whole Wheat Phulka";
            }
        } else if (goal.contains("muscle")) {
            if (type.equals("Breakfast")) {
                if (dayIndex % 3 == 0)
                    food = "Paneer Bhurji (150g) with 2 Multigrain Rotis";
                else if (dayIndex % 3 == 1)
                    food = "Sprouted Moong Salad with 2 Boiled Eggs";
                else
                    food = "Masala Egg Omelet (3 eggs) with Brown Bread";
            } else if (type.equals("Lunch")) {
                if (dayIndex % 3 == 0)
                    food = "Chicken Masala / Soya Chunk Curry with Brown Rice";
                else if (dayIndex % 3 == 1)
                    food = "Fish Curry with Red Rice and Sauted Greens";
                else
                    food = "Mutton Curry (Lean) with 2 Bajra Rotis";
            } else if (type.equals("Snack")) {
                if (dayIndex % 3 == 0)
                    food = "Roasted Chana with Peanut Butter / Boiled Eggs";
                else if (dayIndex % 3 == 1)
                    food = "Whey Protein with Milk and 1 Banana";
                else
                    food = "Handful of Almonds and Walnuts with Greek Yogurt";
            } else { // Dinner
                if (dayIndex % 3 == 0)
                    food = "Paneer Tikka / Tandoori Fish with Dal Khichdi";
                else if (dayIndex % 3 == 1)
                    food = "Grilled Chicken Breast with Sweet Potato Mash";
                else
                    food = "Keema Matar (Lean) with 1 Multigrain Roti";
            }
        } else { // Balanced
            if (type.equals("Breakfast")) {
                if (dayIndex % 3 == 0)
                    food = "Idli Sambhar with Coconut Chutney";
                else if (dayIndex % 3 == 1)
                    food = "Vegetable Upma with Roasted Cashews";
                else
                    food = "Aloo Paratha (Less Oil) with Curd";
            } else if (type.equals("Lunch")) {
                if (dayIndex % 3 == 0)
                    food = "Mixed Veg Curry with 2 Phulkas and Curd";
                else if (dayIndex % 3 == 1)
                    food = "Rajma Chawal with Kachumber Salad";
                else
                    food = "Chole Kulche (Whole Wheat) with Lassi";
            } else if (type.equals("Snack")) {
                if (dayIndex % 3 == 0)
                    food = "Roasted Makhana (Fox Nuts) / Seasonal Fruit";
                else if (dayIndex % 3 == 1)
                    food = "Bhel Puri (Healthy version with sprouts)";
                else
                    food = "Dhokla (2-3 pieces) with Green Chutney";
            } else { // Dinner
                if (dayIndex % 3 == 0)
                    food = "Paneer Matar with 1 Roti and Fresh Salad";
                else if (dayIndex % 3 == 1)
                    food = "Bhindi Masala with 1 Roti and Dal";
                else
                    food = "Vegetable Biryani with Cucumber Raita";
            }
        }

        return new HealthPlan.MealSuggestion(type, cals, p, c, f, food);
    }

    private String getBmiCategory(double bmi) {
        if (bmi < 18.5)
            return "Underweight";
        if (bmi < 24.9)
            return "Normal";
        if (bmi < 29.9)
            return "Overweight";
        return "Obese";
    }
}
