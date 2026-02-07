import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../services/user.service";
import { AuthContext } from "../context/AuthContext";

const CompleteProfile = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        age: "",
        height: "",
        weight: "",
        activityLevel: "medium",
        healthGoal: "stay_fit"
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // For number fields, only allow digits
        if (["age", "height", "weight"].includes(name)) {
            if (value === "" || /^\d+$/.test(value)) {
                setFormData({ ...formData, [name]: value });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // We need to send username and email too as 'updateMetrics' expects the full user object usually
            // or we might need to adjust the backend to accept partial updates. 
            // Based on Profile.jsx, it sends the whole user object.
            // Let's fetch the current profile first ensuring we have the latest base data.
            const profileRes = await UserService.getUserProfile();
            const fullProfile = {
                ...profileRes.data,
                ...formData,
                age: parseInt(formData.age),
                height: parseFloat(formData.height),
                weight: parseFloat(formData.weight)
            };

            await UserService.updateMetrics(fullProfile);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || err.message || "Failed to update profile. Please try again.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            paddingTop: "100px" // Account for Navbar
        }}>
            <div className="glass-card" style={{ maxWidth: "500px", width: "100%" }}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Complete Your Profile</h2>
                <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "30px" }}>
                    Welcome! We need a few more details to build your personalized health plan.
                </p>

                {error && <div style={{ color: "red", textAlign: "center", marginBottom: "15px" }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="glass-label">Age</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            name="age"
                            className="glass-input"
                            value={formData.age}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ display: "flex", gap: "15px" }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="glass-label">Height (cm)</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                name="height"
                                className="glass-input"
                                value={formData.height}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="glass-label">Weight (kg)</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                name="weight"
                                className="glass-input"
                                value={formData.weight}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="glass-label">Activity Level</label>
                        <select
                            name="activityLevel"
                            className="glass-select"
                            value={formData.activityLevel}
                            onChange={handleChange}
                        >
                            <option value="sedentary">Sedentary (Little or no exercise)</option>
                            <option value="light">Light (Light exercise/sports 1-3 days/week)</option>
                            <option value="medium">Medium (Moderate exercise/sports 3-5 days/week)</option>
                            <option value="active">Active (Hard exercise 6-7 days/week)</option>
                            <option value="very_active">Very Active (Very hard exercise & physical job)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="glass-label">Health Goal</label>
                        <select
                            name="healthGoal"
                            className="glass-select"
                            value={formData.healthGoal}
                            onChange={handleChange}
                        >
                            <option value="weight_loss">Weight Loss</option>
                            <option value="muscle_gain">Muscle Gain</option>
                            <option value="stay_fit">Stay Fit</option>
                            <option value="endurance">Endurance</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="glass-button"
                        disabled={isLoading}
                        style={{ marginTop: "20px" }}
                    >
                        {isLoading ? "Saving..." : "Get Started"}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '15px' }}>
                        <button
                            type="button"
                            onClick={() => {
                                localStorage.removeItem("user");
                                localStorage.removeItem("token");
                                navigate("/login");
                            }}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-muted)',
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }}
                        >
                            Logout / Try Again
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfile;
