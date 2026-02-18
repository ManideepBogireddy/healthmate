import axios from 'axios';
import authService from './auth.service';

const API_URL = "http://localhost:8080/api/meals";

const getHeader = () => {
    const user = authService.getCurrentUser();
    return {
        headers: {
            'Authorization': user ? `Bearer ${user.token}` : ''
        }
    };
};

const logMeal = (mealData) => {
    return axios.post(API_URL, mealData, getHeader());
};

const getUserMeals = () => {
    return axios.get(`${API_URL}/user`, getHeader());
};

const deleteMeal = (id) => {
    return axios.delete(`${API_URL}/${id}`, getHeader());
};

const mealService = {
    logMeal,
    getUserMeals,
    deleteMeal
};

export default mealService;
