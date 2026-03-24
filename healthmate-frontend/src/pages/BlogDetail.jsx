import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import blogService from '../services/blog.service';
import followService from '../services/follow.service';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [animatingLike, setAnimatingLike] = useState(false);
    const [loading, setLoading] = useState(true);
    const [commentLoading, setCommentLoading] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);

    useEffect(() => {
        loadPostData();
    }, [id]);

    const loadPostData = async () => {
        setLoading(true);
        try {
            const postRes = await blogService.getPost(id);
            setPost(postRes.data);
            const commentsRes = await blogService.getComments(id);
            setComments(commentsRes.data);
            
            if (currentUser && postRes.data.authorId) {
                const followRes = await followService.checkFollowing(postRes.data.authorId, 'TRAINER');
                setIsFollowingAuthor(followRes.data);
            }
        } catch (error) {
            console.error("Error loading post details", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!currentUser || !post) return;
        
        setAnimatingLike(true);
        setTimeout(() => setAnimatingLike(false), 400);

        // Optimistic update
        const likedByList = post.likedBy || [];
        const isLiked = likedByList.some(id => String(id) === String(currentUser.id));
        const newLikedBy = isLiked 
            ? likedByList.filter(id => String(id) !== String(currentUser.id))
            : [...likedByList, currentUser.id];
            
        setPost(prev => ({
            ...prev,
            likedBy: newLikedBy,
            likes: newLikedBy.length
        }));

        try {
            await blogService.likePost(id);
        } catch (error) {
            console.error("Error liking post", error);
            loadPostData(); // Rollback on error
        }
    };


    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard! 🔗");
    };

    const handleFollow = async () => {
        if (!currentUser) return alert("Please login to follow designers/trainers!");
        try {
            if (isFollowingAuthor) {
                await followService.unfollowTrainer(post.authorId);
                setIsFollowingAuthor(false);
            } else {
                await followService.followTrainer(post.authorId);
                setIsFollowingAuthor(true);
            }
        } catch (error) {
            console.error("Error updating follow status", error);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setCommentLoading(true);
        try {
            await blogService.addComment(id, { content: newComment });
            setNewComment('');
            const commentsRes = await blogService.getComments(id);
            setComments(commentsRes.data);
            const postRes = await blogService.getPost(id); // Reload post for count
            setPost(postRes.data);
        } catch (error) {
            console.error("Error adding comment", error);
        } finally {
            setCommentLoading(false);
        }
    };

    const handleAddReply = async (e, parentCommentId) => {
        e.preventDefault();
        if (!replyContent.trim()) return;
        setCommentLoading(true);
        try {
            await blogService.addReply(parentCommentId, { content: replyContent });
            setReplyContent('');
            setReplyingTo(null);
            const commentsRes = await blogService.getComments(id);
            setComments(commentsRes.data);
            const postRes = await blogService.getPost(id); // Reload post for count
            setPost(postRes.data);
        } catch (error) {
            console.error("Error adding reply", error);
        } finally {
            setCommentLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        setCommentLoading(true);
        try {
            await blogService.deleteComment(commentId);
            const commentsRes = await blogService.getComments(id);
            setComments(commentsRes.data);
            const postRes = await blogService.getPost(id); // Reload post for count
            setPost(postRes.data);
        } catch (error) {
            console.error("Error deleting comment", error);
        } finally {
            setCommentLoading(false);
        }
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

    if (loading) return (
        <div style={{ padding: '200px 0', textAlign: 'center' }}>
            <div className="loader" style={{ margin: '0 auto' }}></div>
        </div>
    );

    if (!post) return (
        <div style={{ padding: '200px 0', textAlign: 'center' }}>
            <h2>Post not found</h2>
            <button className="glass-button" onClick={() => navigate('/blog-studio')}>Back to Feed</button>
        </div>
    );

    return (
        <div className="container" style={{ paddingTop: '120px', maxWidth: '800px', margin: '0 auto' }}>
            <button 
                onClick={() => navigate('/blog-studio')} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
                ← Back to Feed
            </button>

            <header style={{ marginBottom: '50px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {post.authorUsername?.charAt(0).toUpperCase()}
                    </div>
                     <div>
                        <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {post.authorUsername}
                            {currentUser?.id !== post.authorId && (
                                <button 
                                    onClick={handleFollow}
                                    style={{ 
                                        background: isFollowingAuthor ? 'transparent' : 'var(--primary)', 
                                        border: isFollowingAuthor ? '1px solid var(--primary)' : 'none',
                                        color: isFollowingAuthor ? 'var(--primary)' : 'white',
                                        padding: '4px 12px',
                                        borderRadius: '15px',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {isFollowingAuthor ? 'Following' : '+ Follow'}
                                </button>
                            )}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {post.category} • {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
                <h1 style={{ fontSize: '3rem', fontWeight: '900', lineHeight: '1.2', marginBottom: '20px' }}>{post.title}</h1>
            </header>

            <div style={{ width: '100%', height: '450px', borderRadius: '15px', overflow: 'hidden', marginBottom: '50px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)' }}>
                <img 
                    src={post.imageUrl || getPlaceholder(post.category)} 
                    alt={post.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
            </div>

            <article style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-main)', marginBottom: '60px', whiteSpace: 'pre-wrap' }}>
                {post.content}
            </article>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '30px 0', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', marginBottom: '60px' }}>
                <button 
                    onClick={handleLike} 
                    className={animatingLike ? 'animate-like' : ''}
                    style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
                        fontSize: '1.2rem', 
                        color: post.likedBy?.some(id => String(id) === String(currentUser?.id)) ? '#ff3040' : 'var(--text-muted)',
                        transition: 'all 0.2s'
                    }}
                >
                        <svg 
                            aria-label="Like" 
                            fill={post.likedBy?.some(id => String(id) === String(currentUser?.id)) ? '#ff3040' : 'none'} 
                            height="28" 
                            role="img" 
                            viewBox="0 0 24 24" 
                            width="28" 
                            stroke={post.likedBy?.some(id => String(id) === String(currentUser?.id)) ? '#ff3040' : 'currentColor'} 
                            strokeWidth="2"
                        >
                            <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.194 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.03.04.06.0c.075.11.135.244.18.403h.873a.808.808 0 00.18-.403 4.21 4.21 0 013.676-1.941z"></path>
                        </svg>
                    <span style={{ fontWeight: '700' }}>{post.likes}</span>
                </button>
                <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg aria-label="Comment" color="currentColor" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                        <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                    <span style={{ fontWeight: '700' }}>{post.commentCount || 0}</span>
                </div>
                <button 
                    onClick={handleShare}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', color: 'var(--text-muted)', marginLeft: 'auto' }}
                >
                    <svg aria-label="Share" color="currentColor" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                        <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
                        <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
                    </svg>
                    <span style={{ fontWeight: '700' }}>SHARE</span>
                </button>
            </div>

            <section>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '30px' }}>Comments ({post.commentCount || 0})</h3>
                
                <form onSubmit={handleAddComment} style={{ marginBottom: '50px' }}>
                    <textarea 
                        placeholder="What are your thoughts?" 
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '20px', color: 'white', fontSize: '1rem', outline: 'none', resize: 'none', minHeight: '120px', marginBottom: '15px' }}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                    ></textarea>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="glass-button" style={{ width: 'auto', padding: '10px 30px' }} disabled={commentLoading}>
                            {commentLoading ? 'Posting...' : 'Respond'}
                        </button>
                    </div>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginBottom: '100px' }}>
                    {comments.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No comments yet. Start the conversation!</p>
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
                                    paddingLeft: depth > 0 ? '30px' : '0', 
                                    borderLeft: depth > 0 ? '3px solid rgba(16, 185, 129, 0.15)' : 'none',
                                    marginTop: depth === 0 ? '0' : '20px' 
                                }}>
                                    <div style={{ paddingBottom: '15px', borderBottom: depth === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                            <div style={{ width: depth === 0 ? '32px' : '28px', height: depth === 0 ? '32px' : '28px', borderRadius: '50%', background: 'var(--glass-border)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: depth === 0 ? '0.8rem' : '0.75rem', fontWeight: 'bold' }}>
                                                {comment.authorUsername?.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ fontWeight: '600', fontSize: depth === 0 ? '0.95rem' : '0.9rem' }}>{comment.authorUsername}</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: depth === 0 ? '0.85rem' : '0.8rem' }}>• {new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p style={{ color: 'var(--text-main)', lineHeight: '1.6', fontSize: depth === 0 ? '1rem' : '0.95rem', marginBottom: '10px' }}>{comment.content}</p>
                                        <div style={{ display: 'flex', gap: '20px' }}>
                                            <button 
                                                onClick={() => {
                                                    setReplyingTo(replyingTo === comment.id ? null : comment.id);
                                                    setReplyContent('');
                                                }}
                                                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', cursor: 'pointer', padding: 0, fontWeight: '600' }}
                                            >
                                                {replyingTo === comment.id ? 'Cancel' : 'Reply'}
                                            </button>
                                            {canDelete && (
                                                <button 
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    style={{ background: 'transparent', border: 'none', color: '#ff4d4d', fontSize: '0.85rem', cursor: 'pointer', padding: 0, fontWeight: '600' }}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Reply Input */}
                                    {replyingTo === comment.id && (
                                        <form onSubmit={(e) => handleAddReply(e, comment.id)} style={{ marginTop: '20px', marginLeft: depth === 0 ? '45px' : '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <textarea 
                                                autoFocus
                                                placeholder={`Reply to ${comment.authorUsername}...`}
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '15px', color: 'white', fontSize: '1rem', outline: 'none', resize: 'none', minHeight: '80px' }}
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                required
                                            ></textarea>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <button type="submit" className="glass-button" style={{ width: 'auto', padding: '8px 25px', fontSize: '0.85rem' }} disabled={commentLoading}>
                                                    Post Reply
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {/* Nested Replies Rendering */}
                                    {comment.replies.length > 0 && (
                                        <div style={{ marginTop: '10px' }}>
                                            {comment.replies.map(reply => renderCommentThread(reply, depth + 1))}
                                        </div>
                                    )}
                                </div>
                            );
                        };

                        return rootComments.map(c => renderCommentThread(c));
                    })()}
                </div>
            </section>
        </div>
    );
};

export default BlogDetail;
