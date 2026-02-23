import api from "./api";

const getUserProfile = () => {
    return api.get("/user/profile");
};

const updateMetrics = (data) => {
    return api.post("/user/update-metrics", data);
};

const getHealthPlan = () => {
    return api.get("/user/plan");
};

const logDailyStats = (date, weight, caloriesBurned, waterIntake, sleepDuration, notes, dailyCalorieTarget, dailyWaterTarget, dailySleepTarget) => {
    return api.post("/analytics/log", {
        date,
        weight,
        caloriesBurned,
        waterIntake,
        sleepDuration,
        notes,
        dailyCalorieTarget,
        dailyWaterTarget,
        dailySleepTarget
    });
}

const getHistory = () => {
    return api.get("/analytics/history");
}

const getBmiStatus = () => {
    return api.get("/user/bmi-status");
};

const getStreak = () => {
    return api.get("/analytics/streak");
}

const regeneratePlan = () => {
    return api.post("/user/regenerate-plan");
};

const UserService = {
    getUserProfile,
    updateMetrics,
    getHealthPlan,
    logDailyStats,
    getHistory,
    getStreak,
    getBmiStatus,
    regeneratePlan
};

export default UserService;
