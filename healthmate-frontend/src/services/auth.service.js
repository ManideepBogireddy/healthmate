import api from "./api";

const register = (username, email, password, age, height, weight, activityLevel, healthGoal) => {
    return api.post("/auth/signup", {
        username,
        email,
        password,
        age,
        height,
        weight,
        activityLevel,
        healthGoal,
    });
};

const login = (username, password) => {
    return api
        .post("/auth/signin", {
            username,
            password,
        })
        .then((response) => {
            if (response.data.token) {
                localStorage.setItem("user", JSON.stringify(response.data));
                localStorage.setItem("token", response.data.token);
            }
            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const checkUsername = (username) => {
    return api.get(`/auth/check-username?username=${username}`);
};

const checkEmail = (email) => {
    return api.get(`/auth/check-email?email=${email}`);
};

const forgotPassword = (email) => {
    return api.post("/auth/forgot-password", { email });
};

const forgotUsername = (email) => {
    return api.post("/auth/forgot-username", { email });
};

const verifyOtp = (email, otp) => {
    return api.post("/auth/verify-otp", { email, otp });
};

const resetPassword = (email, otp, newPassword) => {
    return api.post("/auth/reset-password", { email, otp, newPassword });
};

const resetUsername = (email, otp, newUsername) => {
    return api.post("/auth/reset-username", { email, otp, newUsername });
};

const sendSignupOtp = (email) => {
    return api.post("/auth/send-signup-otp", { email });
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
    checkUsername,
    checkEmail,
    forgotPassword,
    forgotUsername,
    verifyOtp,
    resetPassword,
    resetUsername,
    sendSignupOtp, // Added export
};

export default AuthService;
