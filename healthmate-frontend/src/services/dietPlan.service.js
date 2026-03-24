import api from './api';

const createDietPlan = (data) => {
    return api.post('/diet-plans', data);
};

const getDietPlansByTrainer = (trainerId) => {
    return api.get(`/diet-plans/trainer/${trainerId}`);
};

const deleteDietPlan = (id) => {
    return api.delete(`/diet-plans/${id}`);
};

const dietPlanService = {
    createDietPlan,
    getDietPlansByTrainer,
    deleteDietPlan
};

export default dietPlanService;
