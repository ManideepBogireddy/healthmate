import React, { useEffect, useState, useRef } from "react";
import UserService from "../services/user.service";
import { AuthContext } from "../context/AuthContext";
import { countries } from '../utils/locations';

const Profile = () => {
    const { updateCurrentUser } = React.useContext(AuthContext);
    const [user, setUser] = useState({
        username: "",
        email: "",
        profilePhoto: "",
        age: "",
        gender: "",
        dateOfBirth: "",
        height: "",
        weight: "",
        activityLevel: "medium",
        healthGoal: "stay_fit",
        country: "",
        state: "",
    });
    const [msg, setMsg] = useState("");

    // Adjustment state
    const [rawImage, setRawImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const imgRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        UserService.getUserProfile().then((res) => {
            setUser(res.data);
        })
    }, []);

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
            setUser({ ...user, [name]: value, age: calculatedAge });
        } else {
            setUser({ ...user, [name]: value });
        }
    }

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("Selected file:", file.name, file.size);
            if (file.size > 2 * 1024 * 1024) {
                setMsg("Photo size too large. Please pick an image under 2MB.");
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

        // Set high resolution for the saved photo
        canvas.width = 400;
        canvas.height = 400;

        const scaleFactor = 400 / 300; // UI is 300px, Canvas is 400px
        const drawWidth = 400 * zoom;
        const drawHeight = 400 * (img.naturalHeight / img.naturalWidth) * zoom;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Circular clip
        ctx.beginPath();
        ctx.arc(200, 200, 200, 0, Math.PI * 2);
        ctx.clip();

        // Draw centered and offset
        const drawX = 200 - (drawWidth / 2) + (offset.x * scaleFactor);
        const drawY = 200 - (drawHeight / 2) + (offset.y * scaleFactor);

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

        const adjustedPhoto = canvas.toDataURL('image/jpeg', 0.9);
        setUser(prev => ({ ...prev, profilePhoto: adjustedPhoto }));
        setShowModal(false);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        console.log("Updating profile with photo. Length:", user.profilePhoto?.length);
        UserService.updateMetrics(user).then((res) => {
            updateCurrentUser(user);
            setMsg("Profile updated successfully! Health plan regenerated.");
            // Re-fetch to confirm persistence
            UserService.getUserProfile().then(res => {
                console.log("Profile re-fetched. Photo present:", !!res.data.profilePhoto);
                setUser(res.data);
            });
        }, (err) => {
            console.error("Error updating profile:", err);
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
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
                        <div key={user.profilePhoto ? 'with-photo' : 'no-photo'} style={{ position: 'relative', width: '120px', height: '120px' }}>
                            <div style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '3px solid var(--primary)',
                                background: 'rgba(255, 255, 255, 0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {user.profilePhoto ? (
                                    <img src={user.profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontSize: '3rem', color: 'var(--text-muted)' }}>
                                        {user.username?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <label htmlFor="photo-upload" style={{
                                position: 'absolute',
                                bottom: '5px',
                                right: '5px',
                                backgroundColor: 'var(--primary)',
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
                            }}>
                                <span style={{ fontSize: '1.2rem' }}>📷</span>
                                <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                            </label>
                        </div>
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
                                    {/* Circular Frame Overlay */}
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div className="form-group">
                            <label className="glass-label">Gender</label>
                            <select name="gender" className="glass-select" value={user.gender || ""} onChange={handleChange}>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="glass-label">Date of Birth</label>
                            <input type="date" name="dateOfBirth" className="glass-input" value={user.dateOfBirth || ""} onChange={handleChange} />
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div className="form-group">
                            <label className="glass-label">Country</label>
                            <select name="country" className="glass-select" value={user.country || ""} onChange={(e) => {
                                handleChange(e);
                                setUser(prev => ({ ...prev, state: "" })); // Reset state on country change
                            }}>
                                <option value="">Select Country</option>
                                {countries.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="glass-label">State</label>
                            <select name="state" className="glass-select" value={user.state || ""} onChange={handleChange} disabled={!user.country}>
                                <option value="">Select State</option>
                                {user.country && countries.find(c => c.name === user.country)?.states.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
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
