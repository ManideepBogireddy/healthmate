import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import UserService from '../services/user.service';
import mealService from '../services/meal.service';

const GoalSetter = () => {
    const { currentUser } = useContext(AuthContext);
    const [goals, setGoals] = useState({
        calories: '',
        water: '',
        sleep: ''
    });
    const [stats, setStats] = useState({
        calories: 0,
        water: 0,
        sleep: 0
    });
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (currentUser) {
            loadData();
        }
    }, [currentUser]);

    const loadData = async () => {
        try {
            const planRes = await UserService.getHealthPlan();
            setPlan(planRes.data);

            const historyRes = await UserService.getHistory();
            setHistory(historyRes.data);

            const today = new Date().toISOString().split('T')[0];
            const todayLog = historyRes.data.find(log => {
                if (!log.date) return false;
                const logDateStr = typeof log.date === 'string' ? log.date.split('T')[0] : '';
                return logDateStr === today;
            });

            // Helper to extract first number from a string (e.g., "7-8 hours" -> 7, "2.5 L" -> 2.5)
            const extractNum = (str) => {
                if (!str) return '';
                const match = str.match(/(\d+(\.\d+)?)/);
                return match ? match[0] : '';
            };

            if (todayLog) {
                setGoals({
                    calories: todayLog.dailyCalorieTarget || extractNum(planRes.data?.dailyCalories?.toString()),
                    water: todayLog.dailyWaterTarget || extractNum(planRes.data?.dailyWaterIntake),
                    sleep: todayLog.dailySleepTarget || extractNum(planRes.data?.sleepRecommendation)
                });
                setStats({
                    calories: 0,
                    water: todayLog.waterIntake || 0,
                    sleep: todayLog.sleepDuration || 0
                });
            } else {
                setGoals({
                    calories: extractNum(planRes.data?.dailyCalories?.toString()),
                    water: extractNum(planRes.data?.dailyWaterIntake),
                    sleep: extractNum(planRes.data?.sleepRecommendation)
                });
            }

            const mealsRes = await mealService.getUserMeals();
            const calorieIntake = mealsRes.data
                .filter(m => {
                    const mDate = typeof m.date === 'string' ? m.date.split('T')[0] : '';
                    return mDate === today;
                })
                .reduce((sum, m) => sum + (m.calories || 0), 0);

            setStats(prev => ({ ...prev, calories: calorieIntake }));
        } catch (error) {
            console.error("Error loading goal data", error);
        }
    };

    const handleSaveGoals = async () => {
        setLoading(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            const todayLog = history.find(log => {
                const logDateStr = typeof log.date === 'string' ? log.date.split('T')[0] : '';
                return logDateStr === today;
            }) || {};

            await UserService.logDailyStats(
                today,
                todayLog.weight || 0,
                0,
                todayLog.waterIntake || 0,
                todayLog.sleepDuration || 0,
                todayLog.notes || '',
                parseInt(goals.calories) || 0,
                parseFloat(goals.water) || 0,
                parseFloat(goals.sleep) || 0
            );
            setMessage("Goals updated! Time to conquer the day! 🚀");
            loadData();
        } catch (error) {
            setMessage("Failed to save goals.");
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const calculateProgress = (actual, target) => {
        const t = parseFloat(target);
        if (isNaN(t) || t <= 0) return 0;
        return Math.min(Math.round((actual / t) * 100), 100);
    };

    const getFeedback = (type, actual, target) => {
        const t = parseFloat(target);
        if (isNaN(t) || t <= 0) return { text: "Set a goal!", color: "var(--glass-text-muted)" };
        const p = (actual / t) * 100;
        if (p >= 100) return { text: "Goal Achieved! 🎉", color: "#10b981" };
        if (p >= 80) return { text: "So close! 💪", color: "#f59e0b" };
        return { text: "Keep going! 🚀", color: "var(--primary-color)" };
    };

    const goalTypes = [
        { key: 'calories', label: 'Calories', icon: '🔥', unit: 'kcal', color: 'var(--primary-color)', step: '1' },
        { key: 'water', label: 'Water', icon: '💧', unit: 'L', color: '#0ea5e9', step: '0.1' },
        { key: 'sleep', label: 'Sleep', icon: '😴', unit: 'h', color: '#8b5cf6', step: '0.1' }
    ];

    return (
        <div className="container" style={{ paddingTop: '80px', maxWidth: '1000px' }}>
            <div className="dashboard-header" style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '2.5rem', margin: 0, fontWeight: '800' }}>Goal Center</h2>
                <div style={{ color: 'var(--glass-text-muted)', marginTop: '5px', fontSize: '1.1rem' }}>
                    One place to define and track your path to greatness. 🏆
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '40px' }}>
                {/* Inputs Column */}
                <div className="glass-card" style={{ padding: '30px' }}>
                    <h3 style={{ margin: '0 0 25px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                        Set Your Targets
                    </h3>

                    {goalTypes.map(type => (
                        <div key={type.key} className="form-group" style={{ marginBottom: '20px' }}>
                            <label className="glass-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>{type.icon}</span> Today's {type.label} ({type.unit})
                            </label>
                            <input
                                type="number"
                                className="glass-input"
                                step={type.step}
                                min="0"
                                placeholder={`e.g. ${type.key === 'calories' ? '2000' : type.key === 'water' ? '3.0' : '8.0'}`}
                                value={goals[type.key]}
                                onChange={(e) => setGoals({ ...goals, [type.key]: e.target.value })}
                            />
                        </div>
                    ))}

                    <button className="glass-button" onClick={handleSaveGoals} disabled={loading} style={{ marginTop: '10px' }}>
                        {loading ? "Saving..." : "Update All Goals"}
                    </button>
                    {message && <p style={{ marginTop: '15px', color: '#10b981', textAlign: 'center', fontWeight: '600' }}>{message}</p>}
                </div>

                {/* Status Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="glass-card" style={{ padding: '30px', flex: 1 }}>
                        <h3 style={{ margin: '0 0 25px 0', fontSize: '1.2rem' }}>Live Performance</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                            {goalTypes.map(type => {
                                const prog = calculateProgress(stats[type.key], goals[type.key]);
                                const fb = getFeedback(type.key, stats[type.key], goals[type.key]);

                                return (
                                    <div key={type.key} style={{ textAlign: 'center' }}>
                                        <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 15px' }}>
                                            <svg width="100" height="100" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                                                <circle
                                                    cx="50" cy="50" r="45" fill="none"
                                                    stroke={type.color} strokeWidth="6"
                                                    strokeDasharray="282.7"
                                                    strokeDashoffset={282.7 - (282.7 * prog) / 100}
                                                    strokeLinecap="round"
                                                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                                                />
                                            </svg>
                                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '1.2rem', fontWeight: '800' }}>
                                                {prog}%
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '700', color: fb.color }}>{fb.text}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--glass-text-muted)', marginTop: '4px' }}>
                                            {stats[type.key]} / {parseFloat(goals[type.key]) || '0'} {type.unit}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '25px', background: 'rgba(255,255,255,0.03)' }}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <div style={{ color: '#f59e0b', fontSize: '1.5rem' }}>💡</div>
                            <div style={{ fontSize: '0.95rem' }}>
                                <strong>Smart Tip:</strong> Your health plan recommends <strong>{plan?.dailyWaterIntake || '2-3 L'}</strong> of water. Staying hydrated improves sleep quality by 15%!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoalSetter;
