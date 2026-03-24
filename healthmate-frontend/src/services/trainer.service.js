import api from './api';

const matchTrainers = () => {
    return api.get('/trainer/match');
};

const getAllTrainers = () => {
    return api.get('/trainer/all');
};

const getTrainer = (id) => {
    return api.get(`/trainer/${id}`);
};

const trainerService = {
    matchTrainers,
    getAllTrainers,
    getTrainer
};

export default trainerService;
