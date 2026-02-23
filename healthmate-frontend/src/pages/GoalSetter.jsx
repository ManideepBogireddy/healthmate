import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import UserService from '../services/user.service';
import mealService from '../services/meal.service';
import ChartComponent from '../components/ChartComponent';

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
    const [meals, setMeals] = useState([]);

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

            const mealsRes = await mealService.getUserMeals();
            setMeals(mealsRes.data);

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
        { key: 'calories', label: 'Calories', icon: '🔥', unit: 'kcal', color: 'var(--primary)', step: '1' },
        { key: 'water', label: 'Water', icon: '💧', unit: 'L', color: '#0ea5e9', step: '0.1' },
        { key: 'sleep', label: 'Sleep', icon: '😴', unit: 'h', color: '#8b5cf6', step: '0.1' }
    ];

    const processedChartData = useMemo(() => {
        return history.map(log => {
            const dateStr = typeof log.date === 'string' ? log.date.split('T')[0] : '';
            const dayMeals = meals.filter(m => {
                const mDate = typeof m.date === 'string' ? m.date.split('T')[0] : '';
                return mDate === dateStr;
            });
            const calIntake = dayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);

            return {
                date: dateStr,
                caloriesAchieved: log.dailyCalorieTarget > 0 ? Math.min(Math.round((calIntake / log.dailyCalorieTarget) * 100), 100) : 0,
                waterAchieved: log.dailyWaterTarget > 0 ? Math.min(Math.round((log.waterIntake / log.dailyWaterTarget) * 100), 100) : 0,
                sleepAchieved: log.dailySleepTarget > 0 ? Math.min(Math.round((log.sleepDuration / log.dailySleepTarget) * 100), 100) : 0
            };
        });
    }, [history, meals]);

    return (
        <div className="container" style={{ paddingTop: '80px', maxWidth: '1000px' }}>
            <div className="dashboard-header" style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '2.5rem', margin: 0, fontWeight: '800' }}>Goal Center</h2>
                <div style={{ color: 'var(--text-muted)', marginTop: '5px', fontSize: '1.1rem' }}>
                    One place to define and track your path to greatness. 🏆
                </div>
            </div>

            {/* Suggested Health Targets (Macros) - NEW */}
            {plan && (
                <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><line x1="16" y1="8" x2="2" y2="22" /><line x1="17.5" y1="15" x2="9" y2="15" /></svg>
                        Scientific Health Targets
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                        {[
                            { label: 'Daily Calories', value: plan.dailyCalories, unit: 'kcal', color: '#f59e0b', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg> },
                            { label: 'Protein Target', value: plan.proteinGrams, unit: 'g', color: '#ef4444', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.4 15.4c.6.6 2.4.6 3 0s.6-2.4 0-3-2.4-.6-3 0-.6 2.4 0 3Z" /><path d="M12.5 12.5c-.6-.6-2.4-.6-3 0s-.6 2.4 0 3 2.4.6 3 0 .6-2.4 0-3Z" /><path d="M11.5 11.5c-4-3-8-1-9 6s7 8 9 6Z" /></svg> },
                            { label: 'Carbs Target', value: plan.carbsGrams, unit: 'g', color: '#3b82f6', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22 16 8" /><path d="M3.5 12.5 5 11l1.5 1.5a3.5 3.5 0 0 1 0 5L5 19l-1.5-1.5a3.5 3.5 0 0 1 0-5Z" /><path d="M7.5 8.5 9 7l1.5 1.5a3.5 3.5 0 0 1 0 5L9 15l-1.5-1.5a3.5 3.5 0 0 1 0-5Z" /><path d="M11.5 4.5 13 3l1.5 1.5a3.5 3.5 0 0 1 0 5L13 11l-1.5-1.5a3.5 3.5 0 0 1 0-5Z" /></svg> },
                            { label: 'Fats Target', value: plan.fatsGrams, unit: 'g', color: '#10b981', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5s-3 3.5-3 5.5a7 7 0 0 0 7 7z" /><circle cx="12" cy="15" r="2" /></svg> }
                        ].map((target, i) => (
                            <div key={i} className="glass-card" style={{ padding: '20px', textAlign: 'center', borderBottom: `3px solid ${target.color}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{target.icon}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{target.label}</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
                                    {target.value}<span style={{ fontSize: '0.8rem', fontWeight: '500', marginLeft: '2px', opacity: 0.7 }}>{target.unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '40px', alignItems: 'start' }}>
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
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                            {stats[type.key]} / {parseFloat(goals[type.key]) || '0'} {type.unit}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="glass-card" style={{
                        padding: '20px',
                        background: 'rgba(255,255,255,0.03)',
                        borderLeft: '4px solid #f59e0b',
                        maxWidth: '500px',
                        margin: '0 auto'
                    }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div style={{ color: '#f59e0b', fontSize: '1.2rem' }}>💡</div>
                            <div style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                                <strong style={{ color: 'var(--text-main)' }}>Smart Tip:</strong> Your health plan recommends <strong>{plan?.dailyWaterIntake || '2-3 L'}</strong> of water. Staying hydrated improves sleep quality by 15%!
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personalized Health Plan Section - NEW */}
            {plan && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '40px' }}>
                    <div className="glass-card" style={{ padding: '25px', borderTop: '4px solid #10b981' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '1.5rem' }}>🥗</span> Personalized Diet Plan
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {plan.dietPlan?.map((item, i) => (
                                <li key={i} style={{
                                    padding: '12px',
                                    marginBottom: '10px',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="glass-card" style={{ padding: '25px', borderTop: '4px solid var(--primary)' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '1.5rem' }}>💪</span> Personalized Exercise Plan
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {plan.exercisePlan?.map((item, i) => (
                                <li key={i} style={{
                                    padding: '12px',
                                    marginBottom: '10px',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Chart Section */}
            <div style={{ marginTop: '40px', marginBottom: '60px' }}>
                <ChartComponent
                    title="Goal Achievement Progress (%)"
                    data={processedChartData}
                    dateKey="date"
                    metrics={[
                        { key: 'caloriesAchieved', label: 'Calories (%)', color: '#f59e0b' }, // Amber/Orange for calories
                        { key: 'waterAchieved', label: 'Water (%)', color: '#0ea5e9' },
                        { key: 'sleepAchieved', label: 'Sleep (%)', color: '#8b5cf6' }
                    ]}
                />
            </div>
        </div>
    );
};

export default GoalSetter;
