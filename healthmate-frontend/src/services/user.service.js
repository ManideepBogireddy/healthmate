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

const logDailyStats = (date, weight, caloriesBurned, notes) => {
    return api.post("/analytics/log", {
        date,
        weight,
        caloriesBurned,
        notes
    });
}

const getHistory = () => {
    return api.get("/analytics/history");
}

const UserService = {
    getUserProfile,
    updateMetrics,
    getHealthPlan,
    logDailyStats,
    getHistory
};

export default UserService;
