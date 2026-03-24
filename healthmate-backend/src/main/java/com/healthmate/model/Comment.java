package com.healthmate.model;

import org.springframework.data.annotation.CreatedDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "comments")
public class Comment {
    @Id
    private String id;
    private String postId;
    private String authorId;
    private String authorUsername;
    @NotBlank
    @Size(min = 2, max = 500)
    private String content;
    private String parentCommentId;
    private String status; // APPROVED, PENDING, SPAM
    @CreatedDate
    private LocalDateTime createdAt;

    public Comment() {
        this.createdAt = LocalDateTime.now();
        this.status = "APPROVED";
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public String getAuthorUsername() {
        return authorUsername;
    }

    public void setAuthorUsername(String authorUsername) {
        this.authorUsername = authorUsername;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getParentCommentId() {
        return parentCommentId;
    }

    public void setParentCommentId(String parentCommentId) {
        this.parentCommentId = parentCommentId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
