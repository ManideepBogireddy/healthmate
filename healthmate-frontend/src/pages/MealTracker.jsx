import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import UserService from '../services/user.service';
import mealService from '../services/meal.service';
import ChartComponent from '../components/ChartComponent';

const MealTracker = () => {
    const { currentUser } = useContext(AuthContext);
    const [plan, setPlan] = useState(null);
    const [meals, setMeals] = useState([]);
    const [formData, setFormData] = useState({
        mealType: 'Breakfast',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (currentUser) {
            loadMeals();
            loadPlan();
        }
    }, [currentUser]);

    const loadPlan = async () => {
        try {
            const response = await UserService.getHealthPlan();
            setPlan(response.data);
        } catch (error) {
            console.error("Error loading plan", error);
        }
    };

    const handleRegeneratePlan = async () => {
        setLoading(true);
        try {
            await UserService.regeneratePlan();
            setMessage("AI Plan regenerated successfully! ✨");
            loadPlan();
        } catch (error) {
            console.error("Failed to regenerate plan", error);
            setMessage("Failed to regenerate plan.");
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleQuickFill = (suggestion, foodName = null) => {
        setFormData({
            mealType: suggestion.mealType,
            calories: suggestion.calories.toString(),
            protein: suggestion.protein.toString(),
            carbs: suggestion.carbs.toString(),
            fats: suggestion.fats.toString(),
            notes: foodName || suggestion.suggestion
        });
        window.scrollTo({ top: 500, behavior: 'smooth' });
        setMessage(`Pre-filled ${suggestion.mealType} suggestions! 🚀`);
        setTimeout(() => setMessage(''), 3000);
    };

    const loadMeals = async () => {
        if (!currentUser) return;
        try {
            const response = await mealService.getUserMeals();
            setMeals(response.data);
        } catch (error) {
            console.error("Error loading meals", error);
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
            const mealToSave = {
                ...formData,
                userId: currentUser.id,
                date: new Date().toISOString().split('T')[0]
            };
            await mealService.logMeal(mealToSave);
            setMessage("Meal logged successfully! 🍴");
            setFormData({ mealType: 'Breakfast', calories: '', protein: '', carbs: '', fats: '', notes: '' });
            loadMeals();
        } catch (error) {
            console.error("Failed to log meal", error);
            setMessage("Failed to log meal.");
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this meal entry?")) {
            try {
                await mealService.deleteMeal(id);
                loadMeals();
            } catch (error) {
                console.error("Error deleting meal", error);
            }
        }
    };

    // Calculate daily totals for today
    const today = new Date().toISOString().split('T')[0];
    const todaysMeals = meals.filter(m => m.date === today);
    const totals = todaysMeals.reduce((acc, m) => ({
        calories: acc.calories + (parseInt(m.calories) || 0),
        protein: acc.protein + (parseFloat(m.protein) || 0),
        carbs: acc.carbs + (parseFloat(m.carbs) || 0),
        fats: acc.fats + (parseFloat(m.fats) || 0),
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

    const groupedMeals = useMemo(() => {
        const groups = meals.reduce((acc, meal) => {
            const date = meal.date || 'Unknown Date';
            if (!acc[date]) {
                acc[date] = {
                    meals: [],
                    totals: { calories: 0, protein: 0, carbs: 0, fats: 0 }
                };
            }
            acc[date].meals.push(meal);
            acc[date].totals.calories += (parseInt(meal.calories) || 0);
            acc[date].totals.protein += (parseFloat(meal.protein) || 0);
            acc[date].totals.carbs += (parseFloat(meal.carbs) || 0);
            acc[date].totals.fats += (parseFloat(meal.fats) || 0);
            return acc;
        }, {});

        return Object.entries(groups)
            .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA));
    }, [meals]);

    const chartData = useMemo(() => {
        return groupedMeals.map(([date, data]) => ({
            date,
            calories: data.totals.calories
        })).reverse();
    }, [groupedMeals]);

    return (
        <div className="container" style={{ paddingTop: '80px' }}>
            <div className="dashboard-header">
                <h2 style={{ fontSize: '2rem', margin: 0 }}>Meal Studio</h2>
                <div className="stat-value">Fuel your body right 🍎</div>
            </div>

            {/* Smart Suggestions - NEW */}
            <div style={{ marginTop: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ animation: 'pulse 2s infinite' }}>💡</span> Smart Suggestions
                        <span style={{ fontSize: '0.75rem', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '12px', fontWeight: '700' }}>PERSONALIZED</span>
                    </h3>
                    <button
                        onClick={handleRegeneratePlan}
                        disabled={loading}
                        className="glass-button"
                        style={{ width: 'auto', padding: '8px 16px', fontSize: '0.8rem', margin: 0 }}
                    >
                        {loading ? "Regenerating..." : "🔄 Force Update Plan"}
                    </button>
                </div>

                {!plan || !plan.mealSuggestions ? (
                    <div className="glass-card" style={{ padding: '30px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🤖</div>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>AI logic is warming up. If suggestions don't appear, click "Force Update".</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                        {plan.mealSuggestions.map((s, i) => (
                            <div
                                key={i}
                                className="glass-card"
                                style={{
                                    padding: '20px',
                                    transition: 'all 0.3s ease',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px', textTransform: 'uppercase' }}>{s.mealType}</div>
                                <div
                                    style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '8px', minHeight: '3em', cursor: 'pointer' }}
                                    onClick={() => handleQuickFill(s, s.suggestion)}
                                >
                                    {s.suggestion}
                                </div>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>🔥 {s.calories} kcal</span>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>🍗 {s.protein}g P</span>
                                </div>

                                {s.alternatives && s.alternatives.length > 0 && (
                                    <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.05em' }}>BACKUP PLAN</div>
                                        <div style={{ maxHeight: '100px', overflowY: 'auto', paddingRight: '5px' }} className="custom-scrollbar">
                                            {s.alternatives.map((alt, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => handleQuickFill(s, alt)}
                                                    style={{
                                                        fontSize: '0.7rem',
                                                        padding: '6px 8px',
                                                        borderRadius: '6px',
                                                        background: alt === s.suggestion ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                                        color: alt === s.suggestion ? 'var(--primary)' : 'var(--text-muted)',
                                                        cursor: 'pointer',
                                                        marginBottom: '4px',
                                                        transition: 'background 0.2s ease'
                                                    }}
                                                    onMouseEnter={(e) => { if (alt !== s.suggestion) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                                                    onMouseLeave={(e) => { if (alt !== s.suggestion) e.currentTarget.style.background = 'transparent' }}
                                                >
                                                    • {alt}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div
                                    onClick={() => handleQuickFill(s, s.suggestion)}
                                    style={{
                                        marginTop: '12px',
                                        fontSize: '0.7rem',
                                        textAlign: 'right',
                                        color: 'var(--primary)',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        gap: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Quick Tap <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Daily Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px' }}>
                <div className="glass-card" style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Calories</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)' }}>{totals.calories} <span style={{ fontSize: '0.8rem' }}>kcal</span></div>
                </div>
                <div className="glass-card" style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Protein</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#10b981' }}>{totals.protein.toFixed(1)}g</div>
                </div>
                <div className="glass-card" style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Carbs</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#3b82f6' }}>{totals.carbs.toFixed(1)}g</div>
                </div>
                <div className="glass-card" style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Fats</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f59e0b' }}>{totals.fats.toFixed(1)}g</div>
                </div>
            </div>

            {/* Chart Section */}
            <div style={{ marginTop: '30px', marginBottom: '30px' }}>
                <ChartComponent
                    title="Daily Calorie Intake"
                    data={chartData}
                    dateKey="date"
                    metrics={[
                        { key: 'calories', label: 'Total kcal', color: '#f59e0b' }
                    ]}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '30px', marginTop: '30px' }}>

                {/* Form Section */}
                <div className="glass-card">
                    <h3>Log a Meal</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="glass-label">Meal Type</label>
                            <select name="mealType" className="glass-select" value={formData.mealType} onChange={handleInputChange}>
                                <option>Breakfast</option>
                                <option>Lunch</option>
                                <option>Dinner</option>
                                <option>Snack</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="glass-label">Calories (kcal)</label>
                            <input type="number" name="calories" className="glass-input" placeholder="e.g. 500" value={formData.calories} onChange={handleInputChange} required />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                            <div className="form-group">
                                <label className="glass-label">Protein (g)</label>
                                <input type="number" step="0.1" name="protein" className="glass-input" placeholder="0" value={formData.protein} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label className="glass-label">Carbs (g)</label>
                                <input type="number" step="0.1" name="carbs" className="glass-input" placeholder="0" value={formData.carbs} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label className="glass-label">Fats (g)</label>
                                <input type="number" step="0.1" name="fats" className="glass-input" placeholder="0" value={formData.fats} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="glass-label">Notes</label>
                            <input type="text" name="notes" className="glass-input" placeholder="What did you eat?" value={formData.notes} onChange={handleInputChange} />
                        </div>

                        <button type="submit" className="glass-button" disabled={loading} style={{ marginTop: '10px' }}>
                            {loading ? "Logging..." : "Add Meal Entry"}
                        </button>
                        {message && <p style={{ marginTop: '10px', color: '#10b981', textAlign: 'center', fontSize: '0.9rem' }}>{message}</p>}
                    </form>
                </div>

                {/* History Section */}
                <div className="glass-card" style={{ padding: '25px' }}>
                    <h3 style={{ marginBottom: '20px', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                        Log History
                    </h3>
                    <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
                        {groupedMeals.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🥙</div>
                                <p>Your plate is empty! Log your first meal to start tracking.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                {groupedMeals.map(([date, data]) => (
                                    <div key={date} className="day-block" style={{
                                        background: 'rgba(255,255,255,0.02)',
                                        borderRadius: '20px',
                                        padding: '5px', // padding 5px to contain the border properly
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        <div style={{
                                            padding: '15px 20px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            background: 'rgba(99, 102, 241, 0.05)',
                                            borderRadius: '16px 16px 0 0',
                                            borderBottom: '1px solid rgba(255,255,255,0.05)'
                                        }}>
                                            <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--primary)' }}>📅 {date}</div>
                                            <div style={{ display: 'flex', gap: '15px', fontSize: '0.75rem', fontWeight: '600' }}>
                                                <span style={{ color: '#f59e0b' }}>🔥 {data.totals.calories} kcal</span>
                                                <span style={{ color: '#10b981' }}>P: {data.totals.protein.toFixed(1)}g</span>
                                                <span style={{ color: '#3b82f6' }}>C: {data.totals.carbs.toFixed(1)}g</span>
                                                <span style={{ color: '#ef4444' }}>F: {data.totals.fats.toFixed(1)}g</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px' }}>
                                            {data.meals.slice().reverse().map((m) => (
                                                <div key={m.id} style={{
                                                    padding: '12px 15px',
                                                    background: 'rgba(255,255,255,0.03)',
                                                    backdropFilter: 'blur(12px)',
                                                    WebkitBackdropFilter: 'blur(12px)',
                                                    border: '1px solid var(--glass-border)',
                                                    borderRadius: '12px',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    animation: 'floatUp 0.4s ease-out'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div style={{
                                                            width: '36px',
                                                            height: '36px',
                                                            borderRadius: '10px',
                                                            background: 'rgba(99, 102, 241, 0.1)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            marginRight: '12px',
                                                            fontSize: '1rem'
                                                        }}>
                                                            {m.mealType === 'Breakfast' ? '🍳' : m.mealType === 'Lunch' ? '🥗' : m.mealType === 'Dinner' ? '🍛' : '🍎'}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.9rem' }}>{m.mealType}</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                                {m.calories} kcal
                                                            </div>
                                                            {m.notes && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>"{m.notes}"</div>}
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{ display: 'flex', gap: '5px' }}>
                                                            <div style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>P: {m.protein || 0}g</div>
                                                            <div style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>C: {m.carbs || 0}g</div>
                                                            <div style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>F: {m.fats || 0}g</div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDelete(m.id)}
                                                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.6, padding: '5px' }}
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MealTracker;
