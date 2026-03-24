import api from './api';

const getFeed = () => {
    return api.get('/blog/feed');
};

const createPost = (post) => {
    return api.post('/blog/post', post);
};

const getMyPosts = () => {
    return api.get('/blog/my-posts');
};

const getPost = (id) => {
    return api.get(`/blog/post/${id}`);
};

const likePost = (id) => {
    return api.put(`/blog/post/${id}/like`);
};

const addComment = (postId, comment) => {
    return api.post(`/blog/post/${postId}/comment`, comment);
};

const getComments = (postId) => {
    return api.get(`/blog/post/${postId}/comments`);
};

const addReply = (commentId, reply) => {
    return api.post(`/blog/comment/${commentId}/reply`, reply);
};

const deleteComment = (commentId) => {
    return api.delete(`/blog/comment/${commentId}`);
};

const blogService = {
    getFeed,
    createPost,
    getMyPosts,
    getPost,
    likePost,
    addComment,
    getComments,
    addReply,
    deleteComment
};

export default blogService;
