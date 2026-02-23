import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import WorkoutService from '../services/workout.service';
import ChartComponent from '../components/ChartComponent';

const WorkoutTracker = () => {
    const { currentUser } = useContext(AuthContext);
    const [workouts, setWorkouts] = useState([]);
    const [formData, setFormData] = useState({
        exerciseType: 'cardio',
        duration: '',
        caloriesBurned: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [chartMetric, setChartMetric] = useState('duration'); // 'duration' or 'caloriesBurned'

    useEffect(() => {
        if (currentUser) {
            loadWorkouts();
        }
    }, [currentUser]);

    const loadWorkouts = async () => {
        if (!currentUser) return;
        try {
            const response = await WorkoutService.getUserWorkouts();
            setWorkouts(response.data);
        } catch (error) {
            console.error("Error loading workouts", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const workoutToSave = {
                ...formData,
                userId: currentUser.id,
                date: new Date().toISOString().split('T')[0]
            };
            await WorkoutService.addWorkout(workoutToSave);
            setMessage("Workout logged successfully!");
            setFormData({ exerciseType: 'cardio', duration: '', caloriesBurned: '', notes: '' });
            loadWorkouts();
        } catch (error) {
            console.error("Failed to log workout", error);
            setMessage("Failed to log workout.");
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this log?")) {
            try {
                await WorkoutService.deleteWorkout(id);
                loadWorkouts();
            } catch (error) {
                console.error("Error deleting workout", error);
            }
        }
    };

    return (
        <div className="container" style={{ paddingTop: '80px' }}>
            <div className="dashboard-header">
                <h2 style={{ fontSize: '2rem', margin: 0 }}>Workout Tracker</h2>
                <div className="stat-value">Stay Active! 🏃‍♂️</div>
            </div>

            {/* Chart Section */}
            <div style={{ marginTop: '30px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', gap: '10px' }}>
                    <button
                        onClick={() => setChartMetric('duration')}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            border: '1px solid var(--glass-border)',
                            background: chartMetric === 'duration' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            color: chartMetric === 'duration' ? 'white' : 'var(--text-muted)',
                            cursor: 'pointer'
                        }}
                    >
                        Duration
                    </button>
                    <button
                        onClick={() => setChartMetric('caloriesBurned')}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            border: '1px solid var(--glass-border)',
                            background: chartMetric === 'caloriesBurned' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            color: chartMetric === 'caloriesBurned' ? 'white' : 'var(--text-muted)',
                            cursor: 'pointer'
                        }}
                    >
                        Calories
                    </button>
                </div>
                <ChartComponent
                    title={`Workout ${chartMetric === 'duration' ? 'Duration (mins)' : 'Calories Burned'}`}
                    data={workouts}
                    dateKey="date"
                    metrics={[
                        {
                            key: chartMetric,
                            label: chartMetric === 'duration' ? 'Minutes' : 'kcal',
                            color: chartMetric === 'duration' ? '#10b981' : '#f59e0b'
                        }
                    ]}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>

                {/* Log Workout Section */}
                <div className="glass-card">
                    <h3>Log New Workout</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="glass-label">Exercise Type</label>
                            <select
                                name="exerciseType"
                                className="glass-select"
                                value={formData.exerciseType}
                                onChange={handleInputChange}
                            >
                                <option value="cardio">Cardio (Running, Cycling)</option>
                                <option value="strength">Strength (Weights, Gym)</option>
                                <option value="yoga">Yoga & Flexibility</option>
                                <option value="sports">Sports</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="glass-label">Duration (minutes)</label>
                            <input
                                type="number"
                                name="duration"
                                className="glass-input"
                                placeholder="e.g. 30"
                                value={formData.duration}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="glass-label">Calories Burned (optional)</label>
                            <input
                                type="number"
                                name="caloriesBurned"
                                className="glass-input"
                                placeholder="Estimated calories"
                                value={formData.caloriesBurned}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="glass-label">Notes</label>
                            <textarea
                                name="notes"
                                className="glass-input"
                                placeholder="How did it feel?"
                                value={formData.notes}
                                onChange={handleInputChange}
                                style={{ height: '80px' }}
                            />
                        </div>

                        <button type="submit" className="glass-button" disabled={loading}>
                            {loading ? "Saving..." : "Log Workout"}
                        </button>
                        {message && <p style={{ marginTop: '10px', color: message.includes("success") ? '#10b981' : '#ef4444' }}>{message}</p>}
                    </form>
                </div>

                {/* History Section */}
                <div className="glass-card" style={{ padding: '30px' }}>
                    <h3 style={{ marginBottom: '25px', color: '#a5b4fc', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                        Recent History
                    </h3>
                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {workouts.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <p style={{ color: '#64748b' }}>No records found. Time to sweat! 🏋️‍♂️</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {workouts.slice().reverse().map((w, index) => (
                                    <div key={w.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '16px 0',
                                        borderBottom: index === workouts.length - 1 ? 'none' : '1px solid var(--glass-border)',
                                        transition: 'all 0.2s'
                                    }} className="history-row">
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '12px'
                                            }}>
                                                {w.exerciseType === 'cardio' ? (
                                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                                                ) : w.exerciseType === 'strength' ? (
                                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11" /><path d="m21.1 21.1-1.4-1.4" /><path d="m4.3 4.3-1.4-1.4" /><path d="M18 5c.6 0 1 .4 1 1v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V6c0-.6.4-1 1-1h1Z" /><path d="M8 15c.6 0 1 .4 1 1v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1c0-.6.4-1 1-1h1Z" /><path d="M15 11c.6 0 1 .4 1 1v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1c0-.6.4-1 1-1h1Z" /><path d="M11 7c.6 0 1 .4 1 1v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V8c0-.6.4-1 1-1h1Z" /></svg>
                                                ) : w.exerciseType === 'yoga' ? (
                                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V21m0-13.5L16.5 12M12 7.5 7.5 12M12 21a4.5 4.5 0 1 1 4.5-4.5M12 21a4.5 4.5 0 1 0-4.5-4.5M12 21l4.5-4.5M12 21l-4.5-4.5" /></svg>
                                                ) : w.exerciseType === 'sports' ? (
                                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.45.98.96 1.21C16.14 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2z" /></svg>
                                                ) : (
                                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path><path d="M12 6v6l4 2"></path></svg>
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '1rem', textTransform: 'capitalize' }}>
                                                    {w.exerciseType} <span style={{ color: 'var(--text-muted)', fontWeight: '400', fontSize: '0.9rem' }}>• {w.duration} mins</span>
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                    {w.date} {w.caloriesBurned > 0 && <span style={{ color: '#10b981', marginLeft: '5px' }}>• {w.caloriesBurned} kcal</span>}
                                                </div>
                                                {w.notes && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', fontStyle: 'italic' }}>"{w.notes}"</div>}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(w.id)}
                                            className="delete-icon-btn"
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: 'var(--text-muted)',
                                                cursor: 'pointer',
                                                padding: '8px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s',
                                                opacity: 0.6
                                            }}
                                            title="Delete Log"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>
                {`
                .history-row:hover { background: rgba(255,255,255,0.01); }
                .delete-icon-btn:hover { color: #ef4444 !important; opacity: 1 !important; background: rgba(239, 68, 68, 0.1) !important; }
                `}
            </style>
        </div>
    );
};

export default WorkoutTracker;
