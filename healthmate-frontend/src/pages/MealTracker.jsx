import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import mealService from '../services/meal.service';

const MealTracker = () => {
    const { currentUser } = useContext(AuthContext);
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
        }
    }, [currentUser]);

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

    return (
        <div className="container" style={{ paddingTop: '80px' }}>
            <div className="dashboard-header">
                <h2 style={{ fontSize: '2rem', margin: 0 }}>Meal Studio</h2>
                <div className="stat-value">Fuel your body right 🍎</div>
            </div>

            {/* Daily Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px' }}>
                <div className="glass-card" style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--glass-text-muted)', fontSize: '0.8rem' }}>Calories</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-color)' }}>{totals.calories} <span style={{ fontSize: '0.8rem' }}>kcal</span></div>
                </div>
                <div className="glass-card" style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--glass-text-muted)', fontSize: '0.8rem' }}>Protein</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#10b981' }}>{totals.protein.toFixed(1)}g</div>
                </div>
                <div className="glass-card" style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--glass-text-muted)', fontSize: '0.8rem' }}>Carbs</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#3b82f6' }}>{totals.carbs.toFixed(1)}g</div>
                </div>
                <div className="glass-card" style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ color: 'var(--glass-text-muted)', fontSize: '0.8rem' }}>Fats</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f59e0b' }}>{totals.fats.toFixed(1)}g</div>
                </div>
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
                    <h3 style={{ marginBottom: '20px', color: 'var(--glass-text)', display: 'flex', alignItems: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                        Log History
                    </h3>
                    <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
                        {meals.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--glass-text-muted)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🥙</div>
                                <p>Your plate is empty! Log your first meal to start tracking.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {meals.slice().reverse().map((m) => (
                                    <div key={m.id} style={{
                                        padding: '15px',
                                        background: 'rgba(255,255,255,0.03)',
                                        backdropFilter: 'blur(12px)',
                                        WebkitBackdropFilter: 'blur(12px)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        margin: '0',
                                        animation: 'floatUp 0.6s ease-out'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{
                                                width: '45px',
                                                height: '45px',
                                                borderRadius: '12px',
                                                background: 'rgba(99, 102, 241, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '15px',
                                                fontSize: '1.2rem'
                                            }}>
                                                {m.mealType === 'Breakfast' ? '🍳' : m.mealType === 'Lunch' ? '🥗' : m.mealType === 'Dinner' ? '🍛' : '🍎'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '700', color: 'var(--glass-text)' }}>{m.mealType}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--glass-text-muted)' }}>
                                                    {m.calories} kcal • {m.date}
                                                </div>
                                                {m.notes && <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)', marginTop: '2px' }}>"{m.notes}"</div>}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <div style={{
                                                    fontSize: '0.7rem',
                                                    padding: '3px 8px',
                                                    borderRadius: '8px',
                                                    background: 'rgba(16, 185, 129, 0.15)',
                                                    color: '#10b981',
                                                    border: '1px solid rgba(16, 185, 129, 0.1)',
                                                    fontWeight: '600'
                                                }}>P: {m.protein || 0}g</div>
                                                <div style={{
                                                    fontSize: '0.7rem',
                                                    padding: '3px 8px',
                                                    borderRadius: '8px',
                                                    background: 'rgba(59, 130, 246, 0.15)',
                                                    color: '#3b82f6',
                                                    border: '1px solid rgba(59, 130, 246, 0.1)',
                                                    fontWeight: '600'
                                                }}>C: {m.carbs || 0}g</div>
                                                <div style={{
                                                    fontSize: '0.7rem',
                                                    padding: '3px 8px',
                                                    borderRadius: '8px',
                                                    background: 'rgba(245, 158, 11, 0.15)',
                                                    color: '#f59e0b',
                                                    border: '1px solid rgba(245, 158, 11, 0.1)',
                                                    fontWeight: '600'
                                                }}>F: {m.fats || 0}g</div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(m.id)}
                                                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.6, padding: '5px' }}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                            </button>
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
