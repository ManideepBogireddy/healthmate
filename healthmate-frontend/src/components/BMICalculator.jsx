import React, { useState, useEffect } from 'react';

const BMICalculator = ({ initialHeight, initialWeight }) => {
    const [height, setHeight] = useState(initialHeight || '');
    const [weight, setWeight] = useState(initialWeight || '');
    const [bmi, setBmi] = useState(null);
    const [category, setCategory] = useState('');
    const [color, setColor] = useState('');

    useEffect(() => {
        if (initialHeight) setHeight(initialHeight);
        if (initialWeight) setWeight(initialWeight);
    }, [initialHeight, initialWeight]);

    const calculateBMI = (e) => {
        if (e) e.preventDefault();

        if (height && weight) {
            const hMeter = height / 100;
            const bmiValue = (weight / (hMeter * hMeter)).toFixed(1);
            setBmi(bmiValue);

            let cat = '';
            let col = '';

            if (bmiValue < 18.5) {
                cat = 'Underweight';
                col = '#3b82f6'; // Blue
            } else if (bmiValue < 25) {
                cat = 'Normal weight';
                col = '#10b981'; // Green
            } else if (bmiValue < 30) {
                cat = 'Overweight';
                col = '#f59e0b'; // Orange
            } else {
                cat = 'Obese';
                col = '#ef4444'; // Red
            }

            setCategory(cat);
            setColor(col);
        }
    };

    return (
        <div className="glass-card" style={{ padding: '25px', height: '100%' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>⚖️</span> BMI Calculator
            </h3>

            <form onSubmit={calculateBMI} style={{ display: 'grid', gap: '15px' }}>
                <div className="form-group">
                    <label className="glass-label">Height (cm)</label>
                    <input
                        type="number"
                        className="glass-input"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="e.g. 175"
                    />
                </div>

                <div className="form-group">
                    <label className="glass-label">Weight (kg)</label>
                    <input
                        type="number"
                        className="glass-input"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="e.g. 70"
                    />
                </div>

                <button type="submit" className="glass-button" style={{ marginTop: '10px' }}>
                    Calculate BMI
                </button>
            </form>

            {bmi && (
                <div style={{
                    marginTop: '25px',
                    padding: '20px',
                    borderRadius: '15px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--glass-border)',
                    textAlign: 'center',
                    animation: 'fadeIn 0.5s ease-out'
                }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Your Body Mass Index
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: '800', color: color, margin: '10px 0' }}>
                        {bmi}
                    </div>
                    <div style={{
                        display: 'inline-block',
                        padding: '6px 15px',
                        borderRadius: '20px',
                        background: `${color}20`,
                        color: color,
                        fontWeight: '700',
                        fontSize: '0.9rem'
                    }}>
                        {category}
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '15px', fontStyle: 'italic' }}>
                        {category === 'Normal weight'
                            ? "Great job! Keep maintaining your healthy lifestyle. 🌟"
                            : category === 'Underweight'
                                ? "Focus on nutrient-dense foods and strength training. 💪"
                                : "Consider a balanced diet and regular physical activity. 🥗"}
                    </p>
                </div>
            )}
        </div>
    );
};

export default BMICalculator;
