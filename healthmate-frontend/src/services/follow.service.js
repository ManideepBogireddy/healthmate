import api from './api';

const followTrainer = (id) => {
    return api.post(`/follow/trainer/${id}`);
};

const unfollowTrainer = (id) => {
    return api.delete(`/follow/trainer/${id}`);
};

const followUser = (id) => {
    return api.post(`/follow/user/${id}`);
};

const unfollowUser = (id) => {
    return api.delete(`/follow/user/${id}`);
};

const followCategory = (name) => {
    return api.post(`/follow/category/${name}`);
};

const unfollowCategory = (name) => {
    return api.delete(`/follow/category/${name}`);
};

const getMyFollows = () => {
    return api.get('/follow/my-follows');
};

const getMyFollowsResolved = () => {
    return api.get('/follow/my-follows/resolved');
};

const checkFollowing = (targetId, type) => {
    return api.get(`/follow/check?targetId=${targetId}&type=${type}`);
};

const getFollowerCount = (targetId, type = 'TRAINER') => {
    return api.get(`/follow/${targetId}/followers/count?type=${type}`);
};

const getFollowers = (targetId, type = 'TRAINER') => {
    return api.get(`/follow/${targetId}/followers?type=${type}`);
};

const getFollowingList = (followerId, type = 'TRAINER') => {
    return api.get(`/follow/${followerId}/following?type=${type}`);
};

const followService = {
    followTrainer,
    unfollowTrainer,
    followCategory,
    unfollowCategory,
    getMyFollows,
    checkFollowing,
    getFollowerCount,
    getFollowers,
    getFollowingList,
    followUser,
    unfollowUser,
    getMyFollowsResolved
};

export default followService;
