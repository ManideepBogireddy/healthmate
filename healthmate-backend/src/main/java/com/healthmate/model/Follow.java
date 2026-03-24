package com.healthmate.model;

import com.healthmate.enums.FollowType;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "follows")
public class Follow {
    @Id
    private String id;
    private String followerId;
    private String targetId; // Can be Trainer ID or Category Name
    private FollowType type;
    private LocalDateTime createdAt;

    public Follow() {
        this.createdAt = LocalDateTime.now();
    }

    public Follow(String followerId, String targetId, FollowType type) {
        this.followerId = followerId;
        this.targetId = targetId;
        this.type = type;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFollowerId() {
        return followerId;
    }

    public void setFollowerId(String followerId) {
        this.followerId = followerId;
    }

    public String getTargetId() {
        return targetId;
    }

    public void setTargetId(String targetId) {
        this.targetId = targetId;
    }

    public FollowType getType() {
        return type;
    }

    public void setType(FollowType type) {
        this.type = type;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
