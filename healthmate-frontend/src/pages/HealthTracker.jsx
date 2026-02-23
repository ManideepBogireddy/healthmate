import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import UserService from '../services/user.service';
import ChartComponent from '../components/ChartComponent';
import BMICalculator from '../components/BMICalculator';

const HealthTracker = () => {
    const { currentUser } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [formData, setFormData] = useState({
        weight: '',
        waterIntake: '',
        sleepDuration: '',
        notes: ''
    });
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (currentUser) {
            loadHistory();
            loadProfile();
        }
    }, [currentUser]);

    const loadProfile = async () => {
        try {
            const response = await UserService.getUserProfile();
            setProfile(response.data);
        } catch (error) {
            console.error("Error loading profile", error);
        }
    };

    const loadHistory = async () => {
        try {
            const response = await UserService.getHistory();
            setHistory(response.data);

            // Auto-fill today's data if it exists
            const today = new Date().toISOString().split('T')[0];
            const todayLog = response.data.find(log => {
                if (!log.date) return false;
                const logDateStr = typeof log.date === 'string' ? log.date.split('T')[0] : '';
                return logDateStr === today;
            });
            if (todayLog) {
                setFormData({
                    weight: todayLog.weight || '',
                    waterIntake: todayLog.waterIntake || '',
                    sleepDuration: todayLog.sleepDuration || '',
                    notes: todayLog.notes || ''
                });
            }
        } catch (error) {
            console.error("Error loading history", error);
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
            const date = new Date().toISOString().split('T')[0];
            await UserService.logDailyStats(
                date,
                parseFloat(formData.weight) || 0,
                0, // caloriesBurned handled by workout tracker
                parseFloat(formData.waterIntake) || 0,
                parseFloat(formData.sleepDuration) || 0,
                formData.notes
            );
            setMessage("Vitals updated successfully! ✨");
            loadHistory();
        } catch (error) {
            console.error("Failed to log stats", error);
            setMessage("Failed to update vitals.");
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '80px' }}>
            <div className="dashboard-header">
                <h2 style={{ fontSize: '2rem', margin: 0 }}>Vitals Hub</h2>
                <div className="stat-value">Track your daily wellness 🧘‍♂️</div>
            </div>

            {/* Chart Section */}
            <div style={{ marginTop: '30px', marginBottom: '30px' }}>
                <ChartComponent
                    title="Health Metrics History"
                    data={history}
                    dateKey="date"
                    metrics={[
                        { key: 'weight', label: 'Weight (kg)', color: '#6366f1' },
                        { key: 'waterIntake', label: 'Water (L)', color: '#0ea5e9' },
                        { key: 'sleepDuration', label: 'Sleep (h)', color: '#8b5cf6' }
                    ]}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '30px' }}>

                {/* Form Section */}
                <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <h3>Update Today's Stats</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="glass-label">Weight (kg)</label>
                            <input type="number" step="0.1" name="weight" className="glass-input" placeholder="e.g. 70.5" value={formData.weight} onChange={handleInputChange} />
                        </div>

                        <div className="form-group">
                            <label className="glass-label">Water Intake (Liters)</label>
                            <input type="number" step="0.1" name="waterIntake" className="glass-input" placeholder="e.g. 2.5" value={formData.waterIntake} onChange={handleInputChange} />
                        </div>

                        <div className="form-group">
                            <label className="glass-label">Sleep Duration (Hours)</label>
                            <input type="number" step="0.1" name="sleepDuration" className="glass-input" placeholder="e.g. 8.0" value={formData.sleepDuration} onChange={handleInputChange} />
                        </div>

                        <div className="form-group">
                            <label className="glass-label">Daily Notes</label>
                            <textarea name="notes" className="glass-input" placeholder="How was your day?" value={formData.notes} onChange={handleInputChange} style={{ height: '80px' }} />
                        </div>

                        <button type="submit" className="glass-button" disabled={loading}>
                            {loading ? "Updating..." : "Save Daily Vitals"}
                        </button>
                        {message && <p style={{ marginTop: '10px', color: '#10b981', textAlign: 'center' }}>{message}</p>}
                    </form>
                </div>

                <BMICalculator
                    initialHeight={profile?.height}
                    initialWeight={formData.weight || profile?.weight}
                />

                {/* History Section */}
                <div className="glass-card" style={{ gridColumn: 'span 2' }}>
                    <h3>Health History</h3>
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {history.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No records yet. Start your journey today! 🚀</p>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                                        <th style={{ padding: '12px', textAlign: 'center' }}>Weight</th>
                                        <th style={{ padding: '12px', textAlign: 'center' }}>Water</th>
                                        <th style={{ padding: '12px', textAlign: 'center' }}>Sleep</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.slice().reverse().map((log) => (
                                        <tr key={log.id || log.date} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                            <td style={{ padding: '12px' }}>{log.date}</td>
                                            <td style={{ padding: '12px', textAlign: 'center' }}>{log.weight} kg</td>
                                            <td style={{ padding: '12px', textAlign: 'center' }}>{log.waterIntake} L</td>
                                            <td style={{ padding: '12px', textAlign: 'center' }}>{log.sleepDuration} h</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthTracker;
