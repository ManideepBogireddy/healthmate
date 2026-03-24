import api from './api';

const getPendingPosts = () => {
    return api.get('/moderation/posts/pending');
};

const approvePost = (id) => {
    return api.put(`/moderation/post/${id}/approve`);
};

const rejectPost = (id, reason) => {
    return api.put(`/moderation/post/${id}/reject`, null, { params: { reason } });
};

const requestEdit = (id, reason) => {
    return api.put(`/moderation/post/${id}/request-edit`, null, { params: { reason } });
};

const deletePost = (id) => {
    return api.delete(`/moderation/post/${id}`);
};

const reportContent = (report) => {
    return api.post('/moderation/report', report);
};

const getPendingReports = () => {
    return api.get('/moderation/reports/pending');
};

const resolveReport = (id, status) => {
    return api.put(`/moderation/report/${id}/resolve`, null, { params: { status } });
};

const moderationService = {
    getPendingPosts,
    approvePost,
    rejectPost,
    requestEdit,
    deletePost,
    reportContent,
    getPendingReports,
    resolveReport
};

export default moderationService;
