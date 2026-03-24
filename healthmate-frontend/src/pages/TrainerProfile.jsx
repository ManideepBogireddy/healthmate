import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import trainerService from '../services/trainer.service';
import dietPlanService from '../services/dietPlan.service';
import workoutPlanService from '../services/workoutPlan.service';
import { AuthContext } from '../context/AuthContext';

const TrainerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [trainer, setTrainer] = useState(null);
    const [dietPlans, setDietPlans] = useState([]);
    const [workoutPlans, setWorkoutPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    const [showContact, setShowContact] = useState(false);

    useEffect(() => {
        loadTrainerData();
    }, [id]);

    const loadTrainerData = async () => {
        try {
            setLoading(true);
            const [trainerRes, dietRes, workoutRes] = await Promise.all([
                trainerService.getTrainer(id),
                dietPlanService.getDietPlansByTrainer(id),
                workoutPlanService.getWorkoutPlansByTrainer(id)
            ]);
            setTrainer(trainerRes.data);
            setDietPlans(dietRes.data);
            setWorkoutPlans(workoutRes.data);
        } catch (error) {
            console.error("Error loading trainer profile:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading profile...</div>;
    if (!trainer) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Trainer not found.</div>;

    return (
        <div className="container" style={{ paddingTop: '80px', maxWidth: '1100px' }}>
            <button 
                onClick={() => navigate('/trainer-match')} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
                ← Back to Matching
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '40px' }}>
                {/* Profile Sidebar */}
                <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
                    <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                        <div style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            background: 'linear-gradient(45deg, var(--primary), #8b5cf6)',
                            margin: '0 auto 25px auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '4rem',
                            color: 'white',
                            fontWeight: '800',
                            position: 'relative'
                        }}>
                            {trainer.name.charAt(0)}
                            {trainer.certified && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '10px',
                                    right: '5px',
                                    background: '#10b981',
                                    color: 'white',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem',
                                    border: '3px solid white',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
                                }}>✓</div>
                            )}
                        </div>
                        <h2 style={{ margin: '0 0 10px 0', fontSize: '1.8rem' }}>{trainer.name}</h2>
                        {trainer.certified && (
                            <div style={{ display: 'inline-block', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '15px' }}>
                                CERTIFIED PROFESSIONAL
                            </div>
                        )}
                        <div style={{ color: 'var(--primary)', fontWeight: '700', marginBottom: '20px' }}>
                            {trainer.experience} Experience
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>
                             📍 {trainer.city}, {trainer.state}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '25px', fontStyle: 'italic' }}>
                             🏠 {trainer.address}
                        </div>
                        
                        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '25px', marginBottom: '25px', display: 'flex', justifyContent: 'center', gap: '40px' }}>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>🏆 {trainer.rating?.toFixed(1) || '0.0'}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rating</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>💬 {trainer.reviewCount}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reviews</div>
                            </div>
                        </div>

                        {showContact ? (
                            <div style={{ animation: 'fadeIn 0.3s ease-out', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '15px', textAlign: 'left', border: '1px solid var(--glass-border)' }}>
                                <div style={{ fontSize: '0.85rem', marginBottom: '10px' }}>📞 {trainer.phoneNumber || "N/A"}</div>
                                <div style={{ fontSize: '0.85rem' }}>📧 {trainer.email || "N/A"}</div>
                                <button 
                                    onClick={() => setShowContact(false)}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer', marginTop: '10px', padding: 0 }}
                                >
                                    Hide Details
                                </button>
                            </div>
                        ) : (
                            <button className="glass-button" onClick={() => setShowContact(true)}>Connect with {trainer.name.split(' ')[0]}</button>
                        )}
                    </div>
                </div>

                {/* Main Content Areas */}
                <div>
                    <div style={{ display: 'flex', gap: '30px', marginBottom: '30px', borderBottom: '1px solid var(--glass-border)' }}>
                        {['overview', 'diet', 'workout'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '15px 5px',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                                    color: activeTab === tab ? 'white' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    fontSize: '0.8rem',
                                    letterSpacing: '1px'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="glass-card" style={{ padding: '40px' }}>
                        {activeTab === 'overview' && (
                            <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                                <h3 style={{ marginTop: 0, marginBottom: '20px' }}>About {trainer.name}</h3>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}>
                                    {trainer.bio}
                                </p>
                                
                                <h4 style={{ marginTop: '40px', marginBottom: '20px', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Specializations</h4>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {trainer.specialties.map(spec => (
                                        <span key={spec} style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 20px', borderRadius: '25px', fontSize: '0.9rem', fontWeight: '600' }}>
                                            {spec}
                                        </span>
                                    ))}
                                </div>

                                <h4 style={{ marginTop: '40px', marginBottom: '20px', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Target Goals</h4>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {trainer.compatibleGoals.map(goal => (
                                        <span key={goal} style={{ border: '1px solid var(--glass-border)', padding: '8px 20px', borderRadius: '25px', fontSize: '0.9rem', color: 'var(--primary)' }}>
                                            🎯 {goal}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'diet' && (
                            <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                    <h3 style={{ margin: 0 }}>Specialized Diet Plans</h3>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{dietPlans.length} Plans Available</div>
                                </div>
                                
                                {dietPlans.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                        No diet plans published yet.
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        {dietPlans.map((plan, idx) => (
                                            <div key={plan.id || idx} className="glass-card" style={{ padding: '25px', background: 'rgba(255,255,255,0.02)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                                    <h4 style={{ margin: 0, color: 'var(--primary)' }}>{plan.goal}</h4>
                                                </div>
                                                <p style={{ margin: '0 0 20px 0', fontSize: '0.95rem', color: 'var(--text-muted)' }}>{plan.description}</p>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                                                    {plan.mealSuggestions.map((meal, midx) => (
                                                        <div key={midx} style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 15px', borderRadius: '10px', fontSize: '0.85rem' }}>
                                                            🍽️ {meal}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'workout' && (
                            <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                    <h3 style={{ margin: 0 }}>Workout Programs</h3>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{workoutPlans.length} Programs Available</div>
                                </div>

                                {workoutPlans.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                        No workout programs published yet.
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                        {workoutPlans.map((plan, idx) => (
                                            <div key={plan.id || idx} className="glass-card" style={{ padding: '25px', background: 'rgba(255,255,255,0.02)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                                    <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{plan.programName}</h4>
                                                    <span style={{ background: 'var(--primary)', color: 'white', padding: '3px 10px', borderRadius: '5px', fontSize: '0.7rem', fontWeight: 'bold' }}>{plan.duration}</span>
                                                </div>
                                                <div style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
                                                    Target: {plan.targetGoal}
                                                </div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                    {plan.exercises.map((ex, eidx) => (
                                                        <div key={eidx} style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 15px', borderRadius: '8px', fontSize: '0.85rem' }}>
                                                            🔥 {ex}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainerProfile;
