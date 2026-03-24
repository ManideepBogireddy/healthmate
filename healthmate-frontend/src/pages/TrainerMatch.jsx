import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import trainerService from '../services/trainer.service';
import UserService from '../services/user.service';
import { useNavigate } from 'react-router-dom';

const TrainerMatch = () => {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const [userProfile, setUserProfile] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        loadData();
    }, []);

    const categories = ['All', 'Yoga', 'Strength Training', 'General Fitness', 'Weight Loss'];

    const loadData = async () => {
        try {
            setLoading(true);
            // Fetch latest user profile to ensure metrics/location are up to date
            const userRes = await UserService.getUserProfile();
            setUserProfile(userRes.data);
            
            // Fetch matches
            const matchRes = await trainerService.matchTrainers();
            setTrainers(matchRes.data);
        } catch (error) {
            console.error("Error loading matches:", error);
            setMessage("Failed to load recommendations.");
        } finally {
            setLoading(false);
        }
    };

    const filteredTrainers = selectedCategory === 'All'
        ? trainers
        : trainers.filter(trainer => 
            trainer.specialties.some(spec => 
                spec.toLowerCase().includes(selectedCategory.toLowerCase())
            )
        );

    return (
        <div className="container" style={{ paddingTop: '60px', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="dashboard-header" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                gap: '40px', 
                marginBottom: '50px',
                flexWrap: 'wrap'
            }}>
                <div style={{ flex: '1', minWidth: '300px' }}>
                    <h2 style={{ 
                        fontSize: '4rem', 
                        margin: 0, 
                        fontWeight: '900', 
                        lineHeight: '1',
                        letterSpacing: '-2px',
                        background: 'linear-gradient(135deg, var(--text-main) 0%, var(--primary) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '15px'
                    }}>
                        Find Your <br />
                        <span style={{ color: 'var(--primary)', WebkitTextFillColor: 'initial' }}>Trainer</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '400px', lineHeight: '1.6' }}>
                        Discover world-class professionals tailored to your unique fitness journey.
                    </p>
                </div>

                <div className="glass-card" style={{ 
                    flex: '1.2', 
                    minWidth: '350px', 
                    padding: '30px', 
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '800' }}>
                        Match Analysis ⚡
                    </div>
                    <div style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
                        Optimizing for health goal: <strong style={{ color: 'var(--primary)', borderBottom: '2px solid var(--primary)', paddingBottom: '2px' }}>{(userProfile?.healthGoal || currentUser?.healthGoal || "General Fitness").replace('_', ' ')}</strong> 🎯
                        
                        {userProfile?.state && (
                            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ 
                                    background: 'rgba(139, 92, 246, 0.05)', 
                                    padding: '8px 15px', 
                                    borderRadius: '12px', 
                                    border: '1px solid rgba(139, 92, 246, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '0.9rem',
                                    color: 'var(--text-main)'
                                }}>
                                    <span style={{ fontSize: '1.2rem' }}>📍</span> {userProfile.state}, {userProfile.country}
                                </div>
                                <div style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '8px', fontWeight: '700' }}>
                                    LOCAL MATCHING ACTIVE
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '12px',
                            border: '1px solid',
                            borderColor: selectedCategory === cat ? 'var(--primary)' : 'var(--glass-border)',
                            background: selectedCategory === cat ? 'var(--primary)' : 'transparent',
                            color: selectedCategory === cat ? 'white' : 'var(--text-muted)',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            outline: 'none'
                        }}
                    >
                        {cat === 'Strength Training' ? 'Strength' : cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>Analyzing your goals and finding matches... 🔎</div>
            ) : filteredTrainers.length === 0 ? (
                <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🏃</div>
                    <h3>No {selectedCategory !== 'All' ? selectedCategory : ''} matches yet.</h3>
                    <p style={{ color: 'var(--text-muted)' }}>We are expanding our trainer network. Check back soon!</p>
                    <button className="glass-button" style={{ width: 'auto', marginTop: '20px' }} onClick={() => {
                        setSelectedCategory('All');
                        trainerService.getAllTrainers().then(res => setTrainers(res.data));
                    }}>
                        Show All Trainers
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                    {filteredTrainers.map(trainer => (
                        <div key={trainer.id} className="glass-card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                             <div style={{ position: 'relative' }}>
                                 <div style={{
                                     width: '100px',
                                     height: '100px',
                                     borderRadius: '50%',
                                     background: 'linear-gradient(45deg, var(--primary), #8b5cf6)',
                                     marginBottom: '20px',
                                     display: 'flex',
                                     alignItems: 'center',
                                     justifyContent: 'center',
                                     fontSize: '2.5rem',
                                     color: 'white',
                                     fontWeight: '800'
                                 }}>
                                     {trainer.name.charAt(0)}
                                 </div>
                                 {trainer.certified && (
                                     <div style={{
                                         position: 'absolute',
                                         bottom: '20px',
                                         right: '0',
                                         background: '#10b981',
                                         color: 'white',
                                         width: '24px',
                                         height: '24px',
                                         borderRadius: '50%',
                                         display: 'flex',
                                         alignItems: 'center',
                                         justifyContent: 'center',
                                         fontSize: '0.8rem',
                                         border: '2px solid white',
                                         boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
                                     }} title="Certified Trainer">
                                         ✓
                                     </div>
                                 )}
                             </div>
                             <h3 style={{ margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                 {trainer.name}
                                 {trainer.certified && <span style={{ fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>CERTIFIED</span>}
                             </h3>
                             <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '5px' }}>
                                 📍 {trainer.city}, {trainer.state}, {trainer.country}
                             </div>
                             <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '15px', fontStyle: 'italic' }}>
                                 🏠 {trainer.address}
                             </div>
                            <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '15px' }}>
                                {trainer.experience} Experience
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.5' }}>
                                {trainer.bio}
                            </p>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '25px' }}>
                                {trainer.specialties.map(spec => (
                                    <span key={spec} style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: '600' }}>
                                        {spec}
                                    </span>
                                ))}
                            </div>
                            <div style={{ marginTop: 'auto', width: '100%', borderTop: '1px solid var(--glass-border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>🏆 {trainer.rating?.toFixed(1) || '0.0'}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{trainer.reviewCount} reviews</div>
                                </div>
                                 <button 
                                     className="glass-button" 
                                     style={{ width: 'auto', padding: '10px 20px' }}
                                     onClick={() => navigate(`/trainer/${trainer.id}`)}
                                 >
                                     View Profile
                                 </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TrainerMatch;
