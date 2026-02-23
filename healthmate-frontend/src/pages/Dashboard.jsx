import React, { useEffect, useState, useContext } from "react";
import UserService from "../services/user.service";
import WorkoutService from "../services/workout.service";
import mealService from "../services/meal.service";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import ChartComponent from "../components/ChartComponent";
import HealthTipService from "../services/healthTip.service";

const Dashboard = () => {
    const { currentUser } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [meals, setMeals] = useState([]);
    const [profile, setProfile] = useState(null);
    const [streak, setStreak] = useState(0);
    const [dailyTip, setDailyTip] = useState(null);

    useEffect(() => {
        if (currentUser) {
            UserService.getHistory().then(response => setHistory(response.data));
            UserService.getUserProfile().then(response => setProfile(response.data));
            UserService.getStreak().then(response => setStreak(response.data));
            WorkoutService.getUserWorkouts().then(response => setWorkouts(response.data));
            mealService.getUserMeals().then(response => setMeals(response.data));
            HealthTipService.getTodayTip().then(response => setDailyTip(response.data));
        }
    }, [currentUser]);

    // Calculate last 7 days for the tracker
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });

    const hasLogOnDate = (dateStr) => {
        return history.some(log => log.date === dateStr);
    };

    // Calculate today's data for the cards
    const today = new Date().toISOString().split('T')[0];
    const todayLog = history.find(log => {
        if (!log.date) return false;
        // Handle both simple "YYYY-MM-DD" and full ISO strings
        const logDateStr = typeof log.date === 'string' ? log.date.split('T')[0] : '';
        return logDateStr === today;
    });
    const latestLog = history.length > 0 ? history[history.length - 1] : null;
    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    // DAILY_TIPS now handled by the Backend Internal API

    return (
        <div className="container" style={{ paddingTop: '100px', maxWidth: '1100px', color: 'var(--text-main)' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontSize: '2.2rem', margin: 0, color: 'var(--text-main)', fontWeight: '800' }}>Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)', margin: '5px 0 0 0' }}>Welcome back, <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{currentUser?.username}</span>!</p>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Top Metrics Row - Using theme-aware glass-cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                {[
                    {
                        label: 'Weight',
                        value: todayLog?.weight
                            ? `${todayLog.weight} kg`
                            : latestLog?.weight
                                ? `${latestLog.weight} kg`
                                : profile?.weight
                                    ? `${profile.weight} kg`
                                    : 'Not Set',
                        icon: '⚖️',
                        color: '#e0e7ff',
                        textColor: '#4338ca',
                        link: '/health-tracker'
                    },
                    {
                        label: 'Cals Intake',
                        value: `${meals.filter(m => m.date === today).reduce((sum, m) => sum + (m.calories || 0), 0)} kcal`,
                        icon: '🍎',
                        color: '#dcfce7',
                        textColor: '#166534',
                        link: '/meal-tracker'
                    },
                    {
                        label: 'Water',
                        value: `${todayLog?.waterIntake || '0'} L`,
                        icon: '💧',
                        color: '#e0f2fe',
                        textColor: '#0369a1',
                        link: '/health-tracker'
                    },
                    {
                        label: 'Sleep',
                        value: `${todayLog?.sleepDuration || '0'} h`,
                        icon: '😴',
                        color: '#f3e8ff',
                        textColor: '#6b21a8',
                        link: '/health-tracker'
                    }
                ].map((stat, i) => (
                    <Link key={i} to={stat.link} className="glass-card" style={{ display: 'flex', alignItems: 'center', padding: '20px', textDecoration: 'none', transition: 'transform 0.2s' }}>
                        <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginRight: '15px' }}>
                            {stat.icon}
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>{stat.label}</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>{stat.value}</div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Daily Health Insight - NEW */}
            {dailyTip && (
                <div className="glass-card" style={{
                    padding: '25px',
                    marginBottom: '30px',
                    background: `linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 100%)`,
                    borderLeft: `5px solid ${dailyTip.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    animation: 'floatUp 0.8s ease-out'
                }}>
                    <div style={{
                        minWidth: '60px',
                        height: '60px',
                        borderRadius: '15px',
                        background: `${dailyTip.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem'
                    }}>
                        {dailyTip.icon}
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: dailyTip.color, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Daily Insight • {dailyTip.title}
                            </span>
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.5', fontWeight: '500' }}>
                            {dailyTip.tip}
                        </p>
                    </div>
                </div>
            )}

            {/* Daily Activity Tracker */}
            <div className="glass-card" style={{ padding: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'center', padding: '0 20px', borderRight: '1px solid var(--glass-border)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🔥</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>{streak}</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Day Streak</div>
                    </div>
                    <div>
                        <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-main)' }}>Daily Activity Log</h4>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {last7Days.map((date, i) => (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: '35px',
                                        height: '35px',
                                        borderRadius: '8px',
                                        background: hasLogOnDate(date) ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--glass-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '5px',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        {hasLogOnDate(date) && <span style={{ color: 'white', fontSize: '0.8rem' }}>✓</span>}
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600', lineHeight: '1.2' }}>
                                        <div>{new Date(date).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}</div>
                                        <div style={{ fontSize: '0.6rem', opacity: 0.8 }}>{new Date(date).getDate()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Link to="/health-tracker" className="glass-button" style={{ padding: '10px 20px', fontSize: '0.9rem', width: 'auto' }}>
                    Log Today's Stats
                </Link>
            </div>

            {/* Daily Goal Progress Section - NEW */}
            {todayLog && todayLog.dailyCalorieTarget > 0 && (
                <div className="glass-card" style={{ padding: '25px', marginBottom: '30px', borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <div>
                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Daily Calorie Goal</span>
                            <h3 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', color: 'var(--text-main)' }}>
                                {Math.min(Math.round((meals.filter(m => m.date === today).reduce((sum, m) => sum + (m.calories || 0), 0) / todayLog.dailyCalorieTarget) * 100), 100) >= 100
                                    ? "Goal Achieved! Amazing work! 🎉"
                                    : Math.min(Math.round((meals.filter(m => m.date === today).reduce((sum, m) => sum + (m.calories || 0), 0) / todayLog.dailyCalorieTarget) * 100), 100) >= 80
                                        ? "You're so close! Just a bit more to go. 💪"
                                        : "Keep going! Small steps lead to big results. 🚀"}
                            </h3>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                                {Math.min(Math.round((meals.filter(m => m.date === today).reduce((sum, m) => sum + (m.calories || 0), 0) / todayLog.dailyCalorieTarget) * 100), 100)}%
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {meals.filter(m => m.date === today).reduce((sum, m) => sum + (m.calories || 0), 0)} / {todayLog.dailyCalorieTarget} kcal
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${Math.min(Math.round((meals.filter(m => m.date === today).reduce((sum, m) => sum + (m.calories || 0), 0) / todayLog.dailyCalorieTarget) * 100), 100)}%`,
                            height: '100%',
                            background: 'var(--primary)',
                            borderRadius: '10px',
                            transition: 'width 0.5s ease'
                        }}></div>
                    </div>
                </div>
            )}

            <div style={{ height: '400px', marginBottom: '60px' }}>
                {/* Progress Card */}
                <ChartComponent
                    title="Weight Progress"
                    data={history}
                    dateKey="date"
                    metrics={[
                        { key: 'weight', label: 'Weight (kg)', color: '#6366f1' }
                    ]}
                />
            </div>

            {/* Bottom Row: Recent Activities */}
            <div style={{ marginTop: '40px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.1rem', border: 'none' }}>Recent Activities</h3>
                    <Link to="/workout-tracker" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>See all</Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    {workouts.length > 0 ? workouts.slice(-3).reverse().map(w => (
                        <div key={w.id} className="glass-card" style={{ padding: '15px', display: 'flex', alignItems: 'center' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '15px'
                            }}>
                                {w.exerciseType === 'cardio' ? (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                                ) : w.exerciseType === 'strength' ? (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11" /><path d="m21.1 21.1-1.4-1.4" /><path d="m4.3 4.3-1.4-1.4" /><path d="M18 5c.6 0 1 .4 1 1v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V6c0-.6.4-1 1-1h1Z" /><path d="M8 15c.6 0 1 .4 1 1v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1c0-.6.4-1 1-1h1Z" /><path d="M15 11c.6 0 1 .4 1 1v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1c0-.6.4-1 1-1h1Z" /><path d="M11 7c.6 0 1 .4 1 1v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V8c0-.6.4-1 1-1h1Z" /></svg>
                                ) : w.exerciseType === 'yoga' ? (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V21m0-13.5L16.5 12M12 7.5 7.5 12M12 21a4.5 4.5 0 1 1 4.5-4.5M12 21a4.5 4.5 0 1 0-4.5-4.5M12 21l4.5-4.5M12 21l-4.5-4.5" /></svg>
                                ) : w.exerciseType === 'sports' ? (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.45.98.96 1.21C16.14 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2z" /></svg>
                                ) : (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path><path d="M12 6v6l4 2"></path></svg>
                                )}
                            </div>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', textTransform: 'capitalize' }}>{w.exerciseType}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{w.duration} mins • {w.date}</div>
                            </div>
                        </div>
                    )) : (
                        <div className="glass-card" style={{ gridColumn: 'span 3', padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <p style={{ margin: 0 }}>Start your workout journey! Log your first activity in the <Link to="/workout-tracker" style={{ color: 'var(--primary)', fontWeight: '600' }}>Workout Tracker</Link>.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;