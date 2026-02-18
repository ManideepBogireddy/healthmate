import api from "./api";

const addWorkout = (workoutData) => {
    return api.post("/workouts/add", workoutData);
};

const getUserWorkouts = () => {
    return api.get("/workouts/user");
};

const deleteWorkout = (id) => {
    return api.delete(`/workouts/${id}`);
};

const WorkoutService = {
    addWorkout,
    getUserWorkouts,
    deleteWorkout
};

export default WorkoutService;