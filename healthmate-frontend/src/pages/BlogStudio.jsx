import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import blogService from '../services/blog.service';
import followService from '../services/follow.service';

const BlogStudio = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', category: 'Nutrition', tags: '', imageUrl: '' });
    const [message, setMessage] = useState('');
    const [myPosts, setMyPosts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [selectedPostForComment, setSelectedPostForComment] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [animatingLikes, setAnimatingLikes] = useState({});
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [followingList, setFollowingList] = useState([]);
    const [followingModalList, setFollowingModalList] = useState([]);
    const [followersList, setFollowersList] = useState([]);
    const [listLoading, setListLoading] = useState(false);

    useEffect(() => {
        loadFeed();
        if (currentUser?.id) {
            loadStats();
        }
    }, [currentUser]);

    const loadStats = async () => {
        try {
            console.log("Loading stats for user:", currentUser.id);
            
            // Fetch both types of followers to ensure we catch social (USER) and professional (TRAINER) follows
            const requests = [
                followService.getMyFollows(),
                followService.getFollowerCount(currentUser.id, 'TRAINER'),
                followService.getFollowerCount(currentUser.id, 'USER')
            ];

            const results = await Promise.all(requests);
            
            // Total followers is the sum of both types
            const trainerFollowers = Number(results[1].data || 0);
            const userFollowers = Number(results[2].data || 0);
            setFollowerCount(trainerFollowers + userFollowers);
            
            const followingRes = results[0];
            const allFollows = followingRes.data || [];
            const followingData = allFollows.filter(f => f.type !== 'CATEGORY');
            
            console.log("Following data:", followingData);
            setFollowingCount(followingData.length);
            
            // Map follow objects for consistent comparison in the post cards
            const mappedFollowing = followingData.map(f => ({ 
                id: String(f.targetId), 
                type: f.type 
            }));
            setFollowingList(mappedFollowing);
        } catch (error) {
            console.error("Error loading stats:", error);
        }
    };

    const handleOpenFollowers = async () => {
        setShowFollowersModal(true);
        setListLoading(true);
        try {
            // Fetch both trainer followers and user followers
            const [trainerRes, userRes] = await Promise.all([
                followService.getFollowers(currentUser.id, 'TRAINER'),
                followService.getFollowers(currentUser.id, 'USER')
            ]);
            
            // Combine results and remove duplicates (though IDs should be unique per type)
            const combined = [...(trainerRes.data || []), ...(userRes.data || [])];
            setFollowersList(combined);
        } catch (error) {
            console.error("Error loading followers:", error);
        } finally {
            setListLoading(false);
        }
    };

    const handleOpenFollowing = async () => {
        setShowFollowingModal(true);
        setListLoading(true);
        try {
            const res = await followService.getMyFollowsResolved();
            // Filter out categories and set the list which now contains {id, username}
            const followingData = (res.data || []).filter(f => f.id !== null);
            setFollowingModalList(followingData); // Using a separate state for the modal list to avoid confusion with followingList
        } catch (error) {
            console.error("Error loading following:", error);
        } finally {
            setListLoading(false);
        }
    };

    const loadFeed = async () => {
        setLoading(true);
        try {
            console.log("Fetching blog feed...");
            const [feedRes, myPostsRes] = await Promise.all([
                blogService.getFeed(),
                currentUser ? blogService.getMyPosts() : Promise.resolve({ data: [] })
            ]);
            
            const postsData = feedRes.data.content || feedRes.data || [];
            setPosts(postsData);
            setMyPosts(myPostsRes.data || []);
        } catch (error) {
            console.error("Error loading feed:", error);
            setMessage("Failed to load blog posts.");
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId) => {
        if (!currentUser) return;
        
        setAnimatingLikes(prev => ({ ...prev, [postId]: true }));
        setTimeout(() => {
            setAnimatingLikes(prev => ({ ...prev, [postId]: false }));
        }, 400);

        // Optimistic update
        setPosts(prevPosts => prevPosts.map(post => {
            if (post.id === postId) {
                const likedByList = post.likedBy || [];
                const isLiked = likedByList.some(id => String(id) === String(currentUser.id));
                const newLikedBy = isLiked 
                    ? likedByList.filter(id => String(id) !== String(currentUser.id))
                    : [...likedByList, currentUser.id];
                return {
                    ...post,
                    likedBy: newLikedBy,
                    likes: newLikedBy.length
                };
            }
            return post;
        }));

        try {
            await blogService.likePost(postId);
        } catch (error) {
            console.error("Error liking post", error);
            loadFeed(); // Rollback on error
        }
    };


    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            const postData = {
                ...newPost,
                tags: newPost.tags.split(',').map(tag => tag.trim()).filter(t => t !== ''),
                authorId: currentUser.id,
                authorUsername: currentUser.username,
                authorRole: currentUser.roles[0] // Assuming roles is an array
            };
            await blogService.createPost(postData);
            setMessage("Post submitted for moderation! 🚀 It will appear in the feed once approved.");
            setShowCreateModal(false);
            setNewPost({ title: '', content: '', category: 'Nutrition', tags: '', imageUrl: '' });
            
            // Refetch feed to show the new pending post in "My Stories"
            await loadFeed();
            // Automatically switch to "My Stories" tab so the user sees their pending post
            setActiveCategory('My Stories');
            
            setTimeout(() => setMessage(''), 5000);
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Failed to submit post.";
            setMessage(errorMsg);
        }
    };

    const handleOpenComments = async (post) => {
        setSelectedPostForComment(post);
        setShowCommentModal(true);
        setCommentLoading(true);
        try {
            const res = await blogService.getComments(post.id);
            setComments(res.data);
        } catch (error) {
            console.error("Error loading comments", error);
        } finally {
            setCommentLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await blogService.addComment(selectedPostForComment.id, { content: newComment });
            setNewComment('');
            const res = await blogService.getComments(selectedPostForComment.id);
            setComments(res.data);
            // Refresh feed to update comment count
            loadFeed();
        } catch (error) {
            console.error("Error adding comment", error);
        }
    };

    const handleAddReply = async (e, parentCommentId) => {
        e.preventDefault();
        if (!replyContent.trim()) return;
        try {
            await blogService.addReply(parentCommentId, { content: replyContent });
            setReplyContent('');
            setReplyingTo(null);
            const res = await blogService.getComments(selectedPostForComment.id);
            setComments(res.data);
            // Refresh feed to update comment count
            loadFeed();
        } catch (error) {
            console.error("Error adding reply", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            await blogService.deleteComment(commentId);
            const res = await blogService.getComments(selectedPostForComment.id);
            setComments(res.data);
            loadFeed();
        } catch (error) {
            console.error("Error deleting comment", error);
        }
    };

    const handleShare = (post) => {
        const url = `${window.location.origin}/blog/${post.id}`;
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard! 🔗");
    };

    const isModerator = currentUser && (
        currentUser.roles?.includes('ROLE_ADMIN') || 
        currentUser.roles?.includes('ROLE_TRAINER')
    );

    const getPlaceholder = (category) => {
        switch (category) {
            case 'Nutrition': return '/placeholder-nutrition.png';
            case 'Workout': return '/placeholder-workout.png';
            case 'Recovery': return '/placeholder-recovery.png';
            case 'Mental Health': return '/placeholder-mental-health.png';
            case 'Community': return '/placeholder-community.png';
            default: return '/blog-placeholder.png';
        }
    };

    const categories = ['All', 'Nutrition', 'Workout', 'Recovery', 'Mental Health', 'Community', 'My Stories'];
    const activeCategories = currentUser ? categories : categories.filter(c => c !== 'My Stories');

    const filteredPosts = activeCategory === 'My Stories'
        ? myPosts
        : activeCategory === 'All' 
            ? posts 
            : posts.filter(p => p.category === activeCategory);

    return (
        <div className="container" style={{ paddingTop: '100px', maxWidth: '1200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px' }}>
                <div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '10px', letterSpacing: '-2px' }}>Blog Studio</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Stories, advice, and inspiration from the HealthMate community.</p>
                </div>
                <button className="glass-button" onClick={() => setShowCreateModal(true)} style={{ width: 'auto', padding: '15px 30px', borderRadius: '30px' }}>
                    Write a story
                </button>
            </div>

            {message && (
                <div className="glass-card" style={{ padding: '20px', marginBottom: '30px', textAlign: 'center', border: '1px solid var(--primary)', background: 'rgba(16, 185, 129, 0.1)' }}>
                    <span style={{ fontWeight: '600', color: '#10b981' }}>{message}</span>
                </div>
            )}

            <div style={{ display: 'flex', gap: '50px' }}>
                {/* Main Content */}
                <div style={{ flex: 2 }}>
                    <div style={{ borderBottom: '1px solid var(--glass-border)', marginBottom: '30px', display: 'flex', gap: '20px' }}>
                        {activeCategories.map(cat => (
                            <button 
                                key={cat} 
                                onClick={() => setActiveCategory(cat)}
                                style={{
                                    padding: '10px 0',
                                    background: 'transparent',
                                    border: 'none',
                                    color: activeCategory === cat ? 'var(--text-main)' : 'var(--text-muted)',
                                    fontWeight: activeCategory === cat ? '700' : '400',
                                    borderBottom: activeCategory === cat ? '3px solid var(--primary)' : '3px solid transparent',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '100px' }}>
                            <div className="loader" style={{ margin: '0 auto 20px' }}></div>
                            <p style={{ color: 'var(--text-muted)' }}>Fetching latest stories...</p>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div style={{ padding: '100px 0', textAlign: 'center' }}>
                            <h2 style={{ fontSize: '2rem', opacity: 0.5 }}>No published posts yet.</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Be the first to share your health journey.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                            {filteredPosts.map(post => (
                                <div key={post.id} style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '30px', paddingBottom: '40px', borderBottom: '1px solid var(--glass-border)' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                                {post.authorUsername?.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{post.authorUsername}</span>
                                            
                                            {currentUser && post.authorId && String(post.authorId) !== String(currentUser.id) && (
                                                <button 
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        const isFollowingAuthor = followingList.some(f => String(f.id) === String(post.authorId));
                                                        console.log("Toggling follow for author:", post.authorId, "Current state:", isFollowingAuthor);
                                                        try {
                                                            if (isFollowingAuthor) {
                                                                await followService.unfollowUser(post.authorId);
                                                            } else {
                                                                await followService.followUser(post.authorId);
                                                            }
                                                            await loadStats();
                                                        } catch (error) {
                                                            console.error("Error toggling follow", error);
                                                        }
                                                    }}
                                                    style={{ 
                                                        background: 'transparent', 
                                                        border: '1px solid var(--primary)', 
                                                        color: followingList.some(f => String(f.id) === String(post.authorId)) ? 'white' : 'var(--primary)', 
                                                        backgroundColor: followingList.some(f => String(f.id) === String(post.authorId)) ? 'var(--primary)' : 'transparent',
                                                        fontSize: '0.65rem', 
                                                        padding: '2px 10px', 
                                                        borderRadius: '12px', 
                                                        cursor: 'pointer',
                                                        fontWeight: '700',
                                                        marginLeft: '10px',
                                                        transition: 'all 0.3s'
                                                    }}
                                                >
                                                    {followingList.some(f => String(f.id) === String(post.authorId)) ? 'FOLLOWING' : 'FOLLOW'}
                                                </button>
                                            )}

                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>in</span>
                                            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{post.category}</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>• {new Date(post.createdAt).toLocaleDateString()}</span>
                                            {activeCategory === 'My Stories' && (
                                                <span style={{ 
                                                    marginLeft: 'auto', 
                                                    padding: '2px 8px', 
                                                    borderRadius: '4px', 
                                                    fontSize: '0.7rem', 
                                                    fontWeight: '700',
                                                    background: post.status === 'PUBLISHED' ? '#10b981' : post.status === 'PENDING' ? '#f59e0b' : post.status === 'NEEDS_REVISION' ? '#6366f1' : '#ef4444',
                                                    color: 'white'
                                                }}>
                                                    {post.status?.replace('_', ' ')}
                                                </span>
                                            )}
                                        </div>
                                        {activeCategory === 'My Stories' && post.status === 'NEEDS_REVISION' && (
                                            <div className="glass-card" style={{ padding: '15px', marginBottom: '15px', borderLeft: '4px solid #6366f1', background: 'rgba(99, 102, 241, 0.1)' }}>
                                                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#6366f1', marginBottom: '5px' }}>MODERATOR NOTES:</div>
                                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)' }}>{post.moderatorNotes || "No notes provided."}</p>
                                            </div>
                                        )}
                                        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '10px', cursor: 'pointer' }} onClick={() => navigate(`/blog/${post.id}`)}>{post.title}</h2>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', cursor: 'pointer' }} onClick={() => navigate(`/blog/${post.id}`)}>
                                            {post.content}
                                        </p>
                                        <div style={{ marginTop: '25px' }}>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                                                {post.tags?.map(tag => (
                                                    <span key={tag} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', border: '1px solid rgba(255,255,255,0.1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                    <button 
                                                        onClick={() => handleLike(post.id)} 
                                                        className={animatingLikes[post.id] ? 'animate-like' : ''}
                                                        style={{ 
                                                            background: 'transparent', 
                                                            border: 'none', 
                                                            cursor: 'pointer', 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            gap: '8px', 
                                                            color: post.likedBy?.some(id => String(id) === String(currentUser?.id)) ? '#ff3040' : 'var(--text-muted)', 
                                                            fontSize: '0.95rem', 
                                                            transition: 'all 0.2s', 
                                                            padding: '5px 0' 
                                                        }} 
                                                        onMouseEnter={(e) => {
                                                            if (!post.likedBy?.some(id => String(id) === String(currentUser?.id))) {
                                                                e.currentTarget.style.color = '#ff3040';
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (!post.likedBy?.some(id => String(id) === String(currentUser?.id))) {
                                                                e.currentTarget.style.color = 'var(--text-muted)';
                                                            }
                                                        }}
                                                        onMouseDown={(e) => e.currentTarget.style.transform='scale(0.9)'} 
                                                        onMouseUp={(e) => e.currentTarget.style.transform='scale(1)'}
                                                    >
                                                        <svg 
                                                            aria-label="Like" 
                                                            fill={post.likedBy?.some(id => String(id) === String(currentUser?.id)) ? '#ff3040' : 'none'} 
                                                            height="24" 
                                                            role="img" 
                                                            viewBox="0 0 24 24" 
                                                            width="24" 
                                                            stroke={post.likedBy?.some(id => String(id) === String(currentUser?.id)) ? '#ff3040' : 'currentColor'} 
                                                            strokeWidth="2"
                                                        >
                                                            <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.194 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.03.04.06.0c.075.11.135.244.18.403h.873a.808.808 0 00.18-.403 4.21 4.21 0 013.676-1.941z"></path>
                                                        </svg>
                                                        <span style={{ fontWeight: '700' }}>{post.likes}</span>
                                                    </button>
                                                    <button onClick={() => handleOpenComments(post)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', transition: 'all 0.2s', padding: '5px 0' }}>
                                                        <svg aria-label="Comment" color="currentColor" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                                                            <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                                                        </svg>
                                                        <span style={{ fontWeight: '700' }}>{post.commentCount || 0}</span>
                                                    </button>
                                                    <button onClick={() => handleShare(post)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', transition: 'all 0.2s', padding: '5px 0' }}>
                                                        <svg aria-label="Share" color="currentColor" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                                                            <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
                                                            <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
                                                        </svg>
                                                        <span style={{ fontWeight: '700' }}>SHARE</span>
                                                    </button>
                                                </div>
                                                <button className="glass-button" onClick={() => navigate(`/blog/${post.id}`)} style={{ width: 'auto', padding: '10px 25px', fontSize: '0.8rem', borderRadius: '20px', fontWeight: '800', letterSpacing: '1px' }}>
                                                    READ MORE
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div 
                                        onClick={() => navigate(`/blog/${post.id}`)}
                                        style={{ 
                                            position: 'relative',
                                            height: '150px', 
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            background: 'var(--glass-bg)',
                                            border: '1px solid var(--glass-border)'
                                        }}
                                    >
                                        <img 
                                            src={post.imageUrl || getPlaceholder(post.category)} 
                                            alt={post.title} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div style={{ flex: 0.8, borderLeft: '1px solid var(--glass-border)', paddingLeft: '40px', visibility: 'visible' }}>
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '20px' }}>Staff Picks</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Placeholder for staff picks or popular posts */}
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Stay tuned for the best health tips and success stories curated just for you.</p>
                        </div>

                        {currentUser && (
                            <div style={{ marginTop: '50px' }}>
                                <h4 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '20px' }}>My Stats</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div 
                                        className="glass-card" 
                                        onClick={handleOpenFollowers}
                                        style={{ padding: '20px', textAlign: 'center', border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'all 0.3s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                                    >
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Followers</div>
                                        <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--primary)' }}>{followerCount}</div>
                                    </div>
                                    <div 
                                        className="glass-card" 
                                        onClick={handleOpenFollowing}
                                        style={{ padding: '20px', textAlign: 'center', border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'all 0.3s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                                    >
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Following</div>
                                        <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--primary)' }}>{followingCount}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: '50px' }}>
                            <h4 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '20px' }}>Moderation</h4>
                            {(currentUser?.roles?.includes('ROLE_ADMIN') || currentUser?.roles?.includes('ROLE_TRAINER') || currentUser?.username === 'Manideep') && (
                                <a href="/moderation-center" className="glass-button" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', fontSize: '0.9rem' }}>
                                    Moderation Dashboard
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Post Modal */}
            {showCreateModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div className="glass-card" style={{ maxWidth: '800px', width: '100%', padding: '50px', position: 'relative' }}>
                        <button onClick={() => setShowCreateModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' }}>×</button>
                        
                        <form onSubmit={handleCreatePost}>
                            <input 
                                type="text" 
                                placeholder="Title" 
                                style={{ width: '100%', background: 'transparent', border: 'none', borderLeft: '2px solid var(--primary)', padding: '0 20px', fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '30px', outline: 'none' }}
                                value={newPost.title}
                                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                required
                            />
                            
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                                <select 
                                    style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '10px 20px', borderRadius: '20px', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
                                    value={newPost.category}
                                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                                >
                                    {categories.filter(c => c !== 'All' && c !== 'My Stories').map(cat => (
                                        <option key={cat} value={cat} style={{ background: '#111', color: 'white' }}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                <input 
                                    type="text" 
                                    placeholder="Tags (comma separated)" 
                                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: 'none', padding: '10px 20px', borderRadius: '20px', color: 'var(--text-main)', outline: 'none' }}
                                    value={newPost.tags}
                                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                                />
                            </div>

                            <textarea 
                                placeholder="Tell your story..." 
                                style={{ width: '100%', background: 'transparent', border: 'none', fontSize: '1.2rem', color: 'var(--text-main)', lineHeight: '1.6', height: '300px', outline: 'none', resize: 'none' }}
                                value={newPost.content}
                                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                required
                            ></textarea>

                            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" className="glass-button" style={{ width: 'auto', padding: '15px 40px', borderRadius: '30px' }}>
                                    Publish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Comment Modal */}
            {showCommentModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', zIndex: 1100 }}>
                    <div className="glass-card" style={{ width: '400px', height: '100%', borderRadius: 0, padding: '40px', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <h3 style={{ margin: 0 }}>Comments</h3>
                            <button onClick={() => setShowCommentModal(false)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>

                        {selectedPostForComment && (
                            <div style={{ marginBottom: '30px' }}>
                                <h4 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '10px' }}>{selectedPostForComment.title}</h4>
                            </div>
                        )}

                        <form onSubmit={handleAddComment} style={{ marginBottom: '40px' }}>
                            <textarea 
                                placeholder="What are your thoughts?" 
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '15px', color: 'white', outline: 'none', resize: 'none', minHeight: '100px', marginBottom: '10px' }}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                required
                            ></textarea>
                            <button type="submit" className="glass-button" style={{ width: 'auto', padding: '8px 20px', fontSize: '0.9rem' }}>Respond</button>
                        </form>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {commentLoading ? (
                                <p style={{ color: 'var(--text-muted)' }}>Loading comments...</p>
                            ) : comments.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)' }}>No comments yet.</p>
                            ) : (() => {
                                // Build tree structure
                                const commentMap = {};
                                const rootComments = [];
                                
                                comments.forEach(c => {
                                    commentMap[c.id] = { ...c, replies: [] };
                                });
                                
                                comments.forEach(c => {
                                    if (c.parentCommentId && commentMap[c.parentCommentId]) {
                                        commentMap[c.parentCommentId].replies.push(commentMap[c.id]);
                                    } else if (!c.parentCommentId) {
                                        rootComments.push(commentMap[c.id]);
                                    }
                                });

                                // Recursive render function
                                const renderCommentThread = (comment, depth = 0) => {
                                    const canDelete = currentUser && (
                                        (currentUser.id && comment.authorId && String(currentUser.id) === String(comment.authorId)) || 
                                        (currentUser.username && comment.authorUsername && currentUser.username === comment.authorUsername) ||
                                        currentUser.roles?.includes("ROLE_ADMIN") ||
                                        currentUser.roles?.includes("ROLE_TRAINER")
                                    );

                                    return (
                                        <div key={comment.id} style={{ 
                                            paddingLeft: depth > 0 ? '20px' : '0', 
                                            borderLeft: depth > 0 ? '2px solid rgba(16, 185, 129, 0.15)' : 'none',
                                            marginTop: depth === 0 ? '20px' : '15px' 
                                        }}>
                                            <div style={{ paddingBottom: '10px', borderBottom: depth === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                                <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '5px' }}>{comment.authorUsername}</div>
                                                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.4', marginBottom: '8px' }}>{comment.content}</div>
                                                <div style={{ display: 'flex', gap: '15px' }}>
                                                    <button 
                                                        onClick={() => {
                                                            setReplyingTo(replyingTo === comment.id ? null : comment.id);
                                                            setReplyContent('');
                                                        }}
                                                        style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer', padding: 0, fontWeight: '600' }}
                                                    >
                                                        {replyingTo === comment.id ? 'Cancel' : 'Reply'}
                                                    </button>
                                                    {canDelete && (
                                                        <button 
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            style={{ background: 'transparent', border: 'none', color: '#ff4d4d', fontSize: '0.75rem', cursor: 'pointer', padding: 0, fontWeight: '600' }}
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Reply Input */}
                                            {replyingTo === comment.id && (
                                                <form onSubmit={(e) => handleAddReply(e, comment.id)} style={{ marginTop: '10px', marginLeft: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    <input 
                                                        autoFocus
                                                        placeholder={`Reply to ${comment.authorUsername}...`}
                                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '6px', padding: '8px 12px', color: 'white', fontSize: '0.85rem', outline: 'none' }}
                                                        value={replyContent}
                                                        onChange={(e) => setReplyContent(e.target.value)}
                                                    />
                                                    <div style={{ display: 'flex' }}>
                                                        <button type="submit" className="glass-button" style={{ width: 'auto', padding: '5px 12px', fontSize: '0.75rem' }}>Post Reply</button>
                                                    </div>
                                                </form>
                                            )}

                                            {/* Nested Replies Rendering */}
                                            {comment.replies.length > 0 && (
                                                <div style={{ marginLeft: '10px' }}>
                                                    {comment.replies.map(reply => renderCommentThread(reply, depth + 1))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                };

                                return rootComments.map(c => renderCommentThread(c));
                            })()}
                        </div>
                    </div>
                </div>
            )}
            {/* Followers/Following Modal */}
            {(showFollowersModal || showFollowingModal) && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
                    <div className="glass-card" style={{ width: '400px', maxHeight: '500px', padding: '30px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h3 style={{ margin: 0 }}>{showFollowersModal ? 'Followers' : 'Following'}</h3>
                            <button 
                                onClick={() => { setShowFollowersModal(false); setShowFollowingModal(false); }} 
                                style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
                            >×</button>
                        </div>

                        <div style={{ overflowY: 'auto', flex: 1 }}>
                            {listLoading ? (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    <div className="loader" style={{ margin: '0 auto' }}></div>
                                </div>
                            ) : (showFollowersModal ? followersList : followingModalList).length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>No users found.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {(showFollowersModal ? followersList : followingModalList).map((user, idx) => (
                                    <div key={user.id || idx} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', marginBottom: '10px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            {user.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '600' }}>{user.username}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{showFollowersModal ? 'Follower' : 'Following'}</div>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogStudio;
