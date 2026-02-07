import React, { useEffect, useState } from "react";
import UserService from "../services/user.service";

const Profile = () => {
    const [user, setUser] = useState({
        username: "",
        email: "",
        age: "",
        height: "",
        weight: "",
        activityLevel: "",
        healthGoal: ""
    });
    const [msg, setMsg] = useState("");

    useEffect(() => {
        UserService.getUserProfile().then((res) => {
            setUser(res.data);
        })
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const handleUpdate = (e) => {
        e.preventDefault();
        UserService.updateMetrics(user).then((res) => {
            setMsg("Profile updated successfully! Health plan regenerated.");
        }, (err) => {
            setMsg("Error updating profile.");
        })
    }

    return (
        <div className="container" style={{ maxWidth: '700px', marginTop: '40px' }}>
            <div className="glass-card">
                <h2 style={{ textAlign: 'center', marginBottom: '30px', background: 'linear-gradient(to right, #818cf8, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '2rem' }}>
                    Your Profile
                </h2>

                {msg && (
                    <div style={{
                        padding: '12px',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        color: '#34d399',
                        borderRadius: '8px',
                        marginBottom: '25px',
                        textAlign: 'center'
                    }}>
                        {msg}
                    </div>
                )}

                <form onSubmit={handleUpdate}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div className="form-group">
                            <label className="glass-label">Username</label>
                            <input type="text" className="glass-input" value={user.username} disabled />
                        </div>
                        <div className="form-group">
                            <label className="glass-label">Email</label>
                            <input type="text" className="glass-input" value={user.email} disabled />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div className="form-group">
                            <label className="glass-label">Age</label>
                            <input type="number" name="age" className="glass-input" value={user.age} onChange={handleChange} placeholder="Years" />
                        </div>
                        <div className="form-group">
                            <label className="glass-label">Height (cm)</label>
                            <input type="number" name="height" className="glass-input" value={user.height} onChange={handleChange} placeholder="cm" />
                        </div>
                        <div className="form-group">
                            <label className="glass-label">Weight (kg)</label>
                            <input type="number" name="weight" className="glass-input" value={user.weight} onChange={handleChange} placeholder="kg" />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '10px' }}>
                        <div className="form-group">
                            <label className="glass-label">Activity Level</label>
                            <select name="activityLevel" className="glass-select" value={user.activityLevel} onChange={handleChange}>
                                <option value="sedentary">Sedentary (Little or no exercise)</option>
                                <option value="light">Light (Light exercise/sports 1-3 days/week)</option>
                                <option value="medium">Medium (Moderate exercise/sports 3-5 days/week)</option>
                                <option value="active">Active (Hard exercise 6-7 days/week)</option>
                                <option value="very_active">Very Active (Very hard exercise & physical job)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="glass-label">Health Goal</label>
                            <select name="healthGoal" className="glass-select" value={user.healthGoal} onChange={handleChange}>
                                <option value="weight_loss">Weight Loss</option>
                                <option value="muscle_gain">Muscle Gain</option>
                                <option value="stay_fit">Stay Fit</option>
                                <option value="endurance">Endurance</option>
                            </select>
                        </div>
                    </div>

                    <button className="glass-button">Update Profile</button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
