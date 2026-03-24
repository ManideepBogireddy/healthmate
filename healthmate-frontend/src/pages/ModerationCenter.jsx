import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import moderationService from '../services/moderation.service';

const ModerationCenter = () => {
    const { currentUser } = useContext(AuthContext);
    const [pendingPosts, setPendingPosts] = useState([]);
    const [pendingReports, setPendingReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'reports'

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [postsRes, reportsRes] = await Promise.all([
                moderationService.getPendingPosts(),
                moderationService.getPendingReports()
            ]);
            console.log("Moderation posts load response:", postsRes.data);
            setPendingPosts(postsRes.data || []);
            setPendingReports(reportsRes.data || []);
        } catch (error) {
            console.error("Error loading moderation data", error);
            if (error.response?.status === 403) {
                console.error("Access Forbidden! The backend is still blocking your role. Check if your username is exactly 'Manideep'.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (postId) => {
        try {
            await moderationService.approvePost(postId);
            setMessage("Post approved successfully! ✅");
            loadData();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage("Failed to approve post.");
        }
    };

    const handleReject = async (postId) => {
        const reason = prompt("Reason for rejection:");
        if (!reason) return;
        try {
            await moderationService.rejectPost(postId, reason);
            setMessage("Post rejected. ❌");
            loadData();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage("Failed to reject post.");
        }
    };

    const handleRequestEdit = async (postId) => {
        const reason = prompt("Notes for author (Edit Request):");
        if (!reason) return;
        try {
            await moderationService.requestEdit(postId, reason);
            setMessage("Edit request sent to author. 📝");
            loadData();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage("Failed to send edit request.");
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to permanently delete this pending post?")) return;
        try {
            await moderationService.deletePost(postId);
            setMessage("Post deleted permanently. 🗑️");
            loadData();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage("Failed to delete post.");
        }
    };

    const handleResolveReport = async (reportId, status) => {
        try {
            await moderationService.resolveReport(reportId, status);
            setMessage(`Report ${status.toLowerCase()}! ⚖️`);
            loadData();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage("Failed to resolve report.");
        }
    };

    if (!currentUser?.roles?.includes('ROLE_ADMIN') && !currentUser?.roles?.includes('ROLE_TRAINER') && currentUser?.username !== 'Manideep') {
        return <div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>
            <h2>Access Denied</h2>
            <p>You do not have permission to access the Moderation Center.</p>
        </div>;
    }

    return (
        <div className="container" style={{ paddingTop: '100px', maxWidth: '1200px' }}>
            <div style={{ marginBottom: '50px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '10px' }}>Moderation Center</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Maintain community standards and review flagged content.</p>
            </div>

            {message && (
                <div className="glass-card" style={{ padding: '20px', marginBottom: '30px', textAlign: 'center', border: '1px solid var(--primary)', background: 'rgba(16, 185, 129, 0.1)' }}>
                    <span style={{ fontWeight: '600', color: '#10b981' }}>{message}</span>
                </div>
            )}

            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', borderBottom: '1px solid var(--glass-border)' }}>
                <button 
                    onClick={() => setActiveTab('posts')}
                    style={{
                        padding: '15px 30px',
                        background: 'transparent',
                        border: 'none',
                        color: activeTab === 'posts' ? 'var(--text-main)' : 'var(--text-muted)',
                        fontWeight: activeTab === 'posts' ? '700' : '400',
                        borderBottom: activeTab === 'posts' ? '3px solid var(--primary)' : '3px solid transparent',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    Pending Posts ({pendingPosts.length})
                </button>
                <button 
                    onClick={() => setActiveTab('reports')}
                    style={{
                        padding: '15px 30px',
                        background: 'transparent',
                        border: 'none',
                        color: activeTab === 'reports' ? 'var(--text-main)' : 'var(--text-muted)',
                        fontWeight: activeTab === 'reports' ? '700' : '400',
                        borderBottom: activeTab === 'reports' ? '3px solid var(--primary)' : '3px solid transparent',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    Reports ({pendingReports.length})
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px' }}>
                    <div className="loader" style={{ margin: '0 auto 20px' }}></div>
                    <p>Loading moderation queue...</p>
                </div>
            ) : (
                <div>
                    {activeTab === 'posts' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {pendingPosts.length === 0 ? (
                                <div className="glass-card" style={{ padding: '80px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✨</div>
                                    <h2 style={{ opacity: 0.6 }}>No pending posts.</h2>
                                    <p style={{ color: 'var(--text-muted)' }}>The community is all caught up!</p>
                                </div>
                            ) : (
                                pendingPosts.map(post => (
                                    <div key={post.id} className="glass-card" style={{ padding: '30px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '30px', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                                                <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)' }}>
                                                    {post.category}
                                                </span>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                    by <b>{post.authorUsername}</b> ({post.authorRole?.replace('ROLE_', '')}) • {new Date(post.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem' }}>{post.title}</h3>
                                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>{post.content}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => handleApprove(post.id)} className="glass-button" style={{ width: 'auto', padding: '10px 20px', background: '#10b981', borderColor: '#10b981' }}>Approve</button>
                                            <button onClick={() => handleRequestEdit(post.id)} className="glass-button" style={{ width: 'auto', padding: '10px 20px', background: '#f59e0b', borderColor: '#f59e0b' }}>Request Edit</button>
                                            <button onClick={() => handleReject(post.id)} className="glass-button" style={{ width: 'auto', padding: '10px 20px', background: '#ef4444', borderColor: '#ef4444' }}>Reject</button>
                                            <button onClick={() => handleDeletePost(post.id)} className="glass-button" style={{ width: 'auto', padding: '10px 20px', border: '1px solid #ff4d4d', color: '#ff4d4d' }}>Delete</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {pendingReports.length === 0 ? (
                                <div className="glass-card" style={{ padding: '80px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛡️</div>
                                    <h2 style={{ opacity: 0.6 }}>No active reports.</h2>
                                    <p style={{ color: 'var(--text-muted)' }}>Great job keeping the community safe!</p>
                                </div>
                            ) : (
                                pendingReports.map(report => (
                                    <div key={report.id} className="glass-card" style={{ padding: '30px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '30px', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                                                <span style={{ padding: '4px 10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                                    {report.contentType} REPORT
                                                </span>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                    flagged by <b>User ID: {report.reporterId}</b> • {new Date(report.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h4 style={{ margin: '0 0 5px 0', color: 'var(--text-main)' }}>Reason: {report.reason}</h4>
                                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Content ID: {report.contentId}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => handleResolveReport(report.id, 'RESOLVED')} className="glass-button" style={{ width: 'auto', padding: '10px 20px', background: 'var(--primary)', borderColor: 'var(--primary)' }}>Resolve</button>
                                            <button onClick={() => handleResolveReport(report.id, 'IGNORED')} className="glass-button" style={{ width: 'auto', padding: '10px 20px', background: 'rgba(255,255,255,0.05)' }}>Ignore</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ModerationCenter;
