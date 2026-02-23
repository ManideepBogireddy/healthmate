import api from "./api";

const getTodayTip = () => {
    return api.get("/health-tips/today");
};

const HealthTipService = {
    getTodayTip
};

export default HealthTipService;
