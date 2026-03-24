package com.healthmate.service;

import com.healthmate.dto.FollowUserDTO;
import com.healthmate.enums.FollowType;
import com.healthmate.model.Follow;
import com.healthmate.repository.FollowRepository;
import com.healthmate.repository.UserRepository;
import com.healthmate.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FollowService {

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private UserRepository userRepository;

    public void follow(String followerId, String targetId, FollowType type) {
        if (!followRepository.existsByFollowerIdAndTargetIdAndType(followerId, targetId, type)) {
            followRepository.save(new Follow(followerId, targetId, type));
        }
    }

    public void unfollow(String followerId, String targetId, FollowType type) {
        followRepository.deleteByFollowerIdAndTargetIdAndType(followerId, targetId, type);
    }

    public List<Follow> getMyFollows(String followerId) {
        return followRepository.findByFollowerId(followerId);
    }

    public boolean isFollowing(String followerId, String targetId, FollowType type) {
        return followRepository.existsByFollowerIdAndTargetIdAndType(followerId, targetId, type);
    }

    public long getFollowerCount(String targetId, FollowType type) {
        return followRepository.countByTargetIdAndType(targetId, type);
    }

    public List<FollowUserDTO> getFollowers(String targetId, FollowType type) {
        List<Follow> follows = followRepository.findByTargetIdAndType(targetId, type);
        return follows.stream()
                .map(f -> userRepository.findById(f.getFollowerId())
                        .map(u -> new FollowUserDTO(u.getId(), u.getUsername()))
                        .orElse(new FollowUserDTO(f.getFollowerId(), "Unknown User")))
                .collect(Collectors.toList());
    }

    public List<FollowUserDTO> getFollowing(String followerId, FollowType type) {
        List<Follow> follows = followRepository.findByFollowerIdAndType(followerId, type);
        return follows.stream()
                .map(f -> {
                    if (type == FollowType.TRAINER || type == FollowType.USER) {
                        return userRepository.findById(f.getTargetId())
                                .map(u -> new FollowUserDTO(u.getId(), u.getUsername()))
                                .orElse(new FollowUserDTO(f.getTargetId(), "Unknown User"));
                    } else {
                        return new FollowUserDTO(null, f.getTargetId()); // For CATEGORY, targetId is the name
                    }
                })
                .collect(Collectors.toList());
    }

    public List<FollowUserDTO> getAllFollowing(String followerId) {
        List<Follow> follows = followRepository.findByFollowerId(followerId);
        return follows.stream()
                .map(f -> {
                    if (f.getType() == FollowType.TRAINER || f.getType() == FollowType.USER) {
                        return userRepository.findById(f.getTargetId())
                                .map(u -> new FollowUserDTO(u.getId(), u.getUsername()))
                                .orElse(new FollowUserDTO(f.getTargetId(), "Unknown User"));
                    } else {
                        return new FollowUserDTO(null, f.getTargetId());
                    }
                })
                .collect(Collectors.toList());
    }
}
