import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../services/user.service";
import { AuthContext } from "../context/AuthContext";

const CompleteProfile = () => {
    const navigate = useNavigate();
    const { currentUser, updateCurrentUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        age: "",
        gender: "",
        dateOfBirth: "",
        profilePhoto: "",
        height: "",
        weight: "",
        activityLevel: "medium",
        healthGoal: "stay_fit"
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Adjustment state
    const [rawImage, setRawImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const imgRef = useRef(null);
    const canvasRef = useRef(null);

    const calculateAge = (dob) => {
        if (!dob) return "";
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "dateOfBirth") {
            const calculatedAge = calculateAge(value);
            setFormData({ ...formData, [name]: value, age: calculatedAge.toString() });
        } else if (["age", "height", "weight"].includes(name)) {
            if (value === "" || /^\d+$/.test(value)) {
                setFormData({ ...formData, [name]: value });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError("Photo size too large. Please pick an image under 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setRawImage(reader.result);
                setZoom(1);
                setOffset({ x: 0, y: 0 });
                setShowModal(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setOffset({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleApplyAdjustment = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = imgRef.current;

        canvas.width = 400;
        canvas.height = 400;

        const scaleFactor = 400 / 300;
        const drawWidth = 400 * zoom;
        const drawHeight = 400 * (img.naturalHeight / img.naturalWidth) * zoom;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.arc(200, 200, 200, 0, Math.PI * 2);
        ctx.clip();

        const drawX = 200 - (drawWidth / 2) + (offset.x * scaleFactor);
        const drawY = 200 - (drawHeight / 2) + (offset.y * scaleFactor);

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

        const adjustedPhoto = canvas.toDataURL('image/jpeg', 0.9);
        setFormData(prev => ({ ...prev, profilePhoto: adjustedPhoto }));
        setShowModal(false);
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
            updateCurrentUser(fullProfile);
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
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
                        <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                            <div style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '2px solid var(--primary)',
                                background: 'rgba(255, 255, 255, 0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {formData.profilePhoto ? (
                                    <img src={formData.profilePhoto} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontSize: '2.5rem', color: 'var(--text-muted)' }}>👤</span>
                                )}
                            </div>
                            <label htmlFor="photo-upload" style={{
                                position: 'absolute',
                                bottom: '0',
                                right: '0',
                                backgroundColor: 'var(--primary)',
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}>
                                <span style={{ fontSize: '1rem' }}>📷</span>
                                <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                            </label>
                        </div>
                        <p style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Upload Profile Photo</p>
                    </div>

                    {/* Adjustment Modal */}
                    {showModal && (
                        <div style={{
                            position: 'fixed',
                            top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.85)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div className="glass-card" style={{ padding: '30px', width: '400px', textAlign: 'center' }}>
                                <h3 style={{ marginBottom: '20px' }}>Adjust Photo</h3>
                                <div style={{
                                    width: '300px',
                                    height: '300px',
                                    margin: '0 auto 25px auto',
                                    overflow: 'hidden',
                                    borderRadius: '50%',
                                    position: 'relative',
                                    border: '2px solid var(--primary)',
                                    cursor: isDragging ? 'grabbing' : 'grab',
                                    backgroundColor: '#000'
                                }}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                >
                                    <img 
                                        ref={imgRef}
                                        src={rawImage} 
                                        alt="Preview" 
                                        style={{
                                            position: 'absolute',
                                            width: '100%',
                                            top: '50%',
                                            left: '50%',
                                            transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                                            pointerEvents: 'none',
                                            transformOrigin: 'center center'
                                        }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: 0, left: 0, right: 0, bottom: 0,
                                        boxShadow: '0 0 0 1000px rgba(0,0,0,0.5)',
                                        borderRadius: '50%',
                                        pointerEvents: 'none'
                                    }} />
                                </div>

                                <div style={{ marginBottom: '25px' }}>
                                    <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-muted)' }}>Zoom</label>
                                    <input 
                                        type="range" 
                                        min="1" max="3" step="0.01" 
                                        value={zoom} 
                                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                                        style={{ width: '100%', height: '4px', accentColor: 'var(--primary)' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <button type="button" className="glass-button" onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.05)' }}>Cancel</button>
                                    <button type="button" className="glass-button" style={{ background: 'var(--primary)', color: '#fff' }} onClick={handleApplyAdjustment}>Apply</button>
                                </div>
                                <canvas ref={canvasRef} style={{ display: 'none' }} />
                            </div>
                        </div>
                    )}

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

                    <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="glass-label">Gender</label>
                            <select
                                name="gender"
                                className="glass-select"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="glass-label">Date of Birth</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                className="glass-input"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                        <div className="form-group" style={{ flex: 1 }}>
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
