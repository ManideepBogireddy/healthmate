import React, { useEffect, useState, useContext } from "react";
import UserService from "../services/user.service";
import WorkoutService from "../services/workout.service";
import mealService from "../services/meal.service";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
    const { currentUser } = useContext(AuthContext);
    const [plan, setPlan] = useState(null);
    const [history, setHistory] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [meals, setMeals] = useState([]);
    const [profile, setProfile] = useState(null);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        if (currentUser) {
            UserService.getHealthPlan().then(response => setPlan(response.data));
            UserService.getHistory().then(response => setHistory(response.data));
            UserService.getUserProfile().then(response => setProfile(response.data));
            UserService.getStreak().then(response => setStreak(response.data));
            WorkoutService.getUserWorkouts().then(response => setWorkouts(response.data));
            mealService.getUserMeals().then(response => setMeals(response.data));
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

    const chartData = {
        labels: history.map(log => log.date),
        datasets: [
            {
                label: "Weight (kg)",
                data: history.map(log => log.weight),
                borderColor: "#6366f1",
                backgroundColor: "rgba(99, 102, 241, 0.05)",
                borderWidth: 3,
                pointRadius: 4,
                tension: 0.4,
                fill: true
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: '#1e293b', padding: 12, borderRadius: 8 }
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
            y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#94a3b8' } }
        }
    };

    return (
        <div className="container" style={{ paddingTop: '100px', maxWidth: '1100px', color: 'var(--text-color)' }}>

            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontSize: '2.2rem', margin: 0, color: 'var(--text-color)', fontWeight: '800' }}>Dashboard</h1>
                    <p style={{ color: 'var(--glass-text-muted)', margin: '5px 0 0 0' }}>Welcome back, <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>{currentUser?.username}</span>!</p>
                </div>
                <div style={{ color: 'var(--glass-text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>
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
                            <div style={{ color: 'var(--glass-text-muted)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>{stat.label}</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--glass-text)' }}>{stat.value}</div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Daily Activity Tracker */}
            <div className="glass-card" style={{ padding: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'center', padding: '0 20px', borderRight: '1px solid var(--glass-border)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🔥</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-color)' }}>{streak}</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--glass-text-muted)', textTransform: 'uppercase' }}>Day Streak</div>
                    </div>
                    <div>
                        <h4 style={{ margin: '0 0 10px 0', color: 'var(--glass-text)' }}>Daily Activity Log</h4>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {last7Days.map((date, i) => (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: '35px',
                                        height: '35px',
                                        borderRadius: '8px',
                                        background: hasLogOnDate(date) ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--glass-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '5px',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        {hasLogOnDate(date) && <span style={{ color: 'white', fontSize: '0.8rem' }}>✓</span>}
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--glass-text-muted)', fontWeight: '600' }}>
                                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
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
                <div className="glass-card" style={{ padding: '25px', marginBottom: '30px', borderLeft: '4px solid var(--primary-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <div>
                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '1px' }}>Daily Calorie Goal</span>
                            <h3 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', color: 'var(--glass-text)' }}>
                                {Math.min(Math.round((meals.filter(m => m.date === today).reduce((sum, m) => sum + (m.calories || 0), 0) / todayLog.dailyCalorieTarget) * 100), 100) >= 100
                                    ? "Goal Achieved! Amazing work! 🎉"
                                    : Math.min(Math.round((meals.filter(m => m.date === today).reduce((sum, m) => sum + (m.calories || 0), 0) / todayLog.dailyCalorieTarget) * 100), 100) >= 80
                                        ? "You're so close! Just a bit more to go. 💪"
                                        : "Keep going! Small steps lead to big results. 🚀"}
                            </h3>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary-color)' }}>
                                {Math.min(Math.round((meals.filter(m => m.date === today).reduce((sum, m) => sum + (m.calories || 0), 0) / todayLog.dailyCalorieTarget) * 100), 100)}%
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--glass-text-muted)' }}>
                                {meals.filter(m => m.date === today).reduce((sum, m) => sum + (m.calories || 0), 0)} / {todayLog.dailyCalorieTarget} kcal
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${Math.min(Math.round((meals.filter(m => m.date === today).reduce((sum, m) => sum + (m.calories || 0), 0) / todayLog.dailyCalorieTarget) * 100), 100)}%`,
                            height: '100%',
                            background: 'var(--primary-color)',
                            borderRadius: '10px',
                            transition: 'width 0.5s ease'
                        }}></div>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '30px' }}>

                {/* Progress Card */}
                <div className="glass-card" style={{ padding: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, color: 'var(--glass-text)', fontSize: '1.1rem' }}>Weight Progress</h3>
                        <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '20px' }}>Active Tracking</span>
                    </div>
                    <div style={{ height: '300px' }}>
                        {history.length > 0 ? (
                            <Line data={chartData} options={chartOptions} />
                        ) : (
                            <div style={{ textAlign: 'center', color: 'var(--glass-text-muted)', padding: '80px 40px' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📈</div>
                                <div>No weights logged yet. Your progress chart will appear here once you log your first entry!</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Plan Summary Card */}
                <div className="glass-card" style={{ background: 'var(--primary-color)', color: 'white', padding: '25px', position: 'relative', overflow: 'hidden', border: 'none' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h3 style={{ margin: 0, color: 'white', fontSize: '1.1rem', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Daily Health Plan</h3>
                        {plan ? (
                            <>
                                <div style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '5px' }}>{plan.goal}</div>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '25px' }}>Target: {plan.dailyCalories} calories per day</p>

                                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '15px', backdropFilter: 'blur(5px)' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: '600', opacity: 0.8 }}>TOP SUGGESTION</span>
                                    <p style={{ margin: '5px 0 0 0', fontWeight: '500' }}>{plan.recommendations?.[0] || 'Keep moving to stay fit!'}</p>
                                </div>
                            </>
                        ) : (
                            <div style={{ padding: '20px 0' }}>
                                <p style={{ opacity: 0.8 }}>Complete your profile to generate your personalized Health Plan!</p>
                            </div>
                        )}
                        <Link to="/profile" style={{ display: 'block', marginTop: '30px', color: 'white', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}>
                            View Full Plan →
                        </Link>
                    </div>
                    {/* Decorative Circle */}
                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                </div>
            </div>

            {/* Bottom Row: Recent Activities */}
            <div style={{ marginTop: '40px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1.1rem', border: 'none' }}>Recent Activities</h3>
                    <Link to="/workout-tracker" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>See all</Link>
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
                                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--glass-text)', textTransform: 'capitalize' }}>{w.exerciseType}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--glass-text-muted)' }}>{w.duration} mins • {w.date}</div>
                            </div>
                        </div>
                    )) : (
                        <div className="glass-card" style={{ gridColumn: 'span 3', padding: '30px', textAlign: 'center', color: 'var(--glass-text-muted)' }}>
                            <p style={{ margin: 0 }}>Start your workout journey! Log your first activity in the <Link to="/workout-tracker" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Workout Tracker</Link>.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;