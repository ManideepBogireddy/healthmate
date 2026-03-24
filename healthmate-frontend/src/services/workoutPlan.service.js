import api from './api';

const createWorkoutPlan = (data) => {
    return api.post('/workout-plans', data);
};

const getWorkoutPlansByTrainer = (trainerId) => {
    return api.get(`/workout-plans/trainer/${trainerId}`);
};

const deleteWorkoutPlan = (id) => {
    return api.delete(`/workout-plans/${id}`);
};

const workoutPlanService = {
    createWorkoutPlan,
    getWorkoutPlansByTrainer,
    deleteWorkoutPlan
};

export default workoutPlanService;
