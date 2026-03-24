package com.healthmate.model;

import com.healthmate.enums.PostStatus;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "blog_posts")
public class BlogPost {
    @Id
    private String id;
    private String authorId;
    private String authorUsername;
    private String authorRole; // ROLE_USER, ROLE_TRAINER, etc.

    @NotBlank
    @Size(min = 5, max = 150)
    private String title;

    @NotBlank
    @Size(min = 20)
    private String content;

    @NotBlank
    private String category;
    private List<String> tags = new ArrayList<>();
    private String imageUrl;
    private PostStatus status = PostStatus.PENDING;
    private int likes = 0;
    private List<String> likedBy = new ArrayList<>(); // User IDs
    private int commentCount = 0;
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
    private String moderatorNotes;

    public BlogPost() {
        this.tags = new ArrayList<>();
        this.likedBy = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = PostStatus.PENDING;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
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

    public String getAuthorRole() {
        return authorRole;
    }

    public void setAuthorRole(String authorRole) {
        this.authorRole = authorRole;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public PostStatus getStatus() {
        return status;
    }

    public void setStatus(PostStatus status) {
        this.status = status;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public List<String> getLikedBy() {
        return likedBy;
    }

    public void setLikedBy(List<String> likedBy) {
        this.likedBy = likedBy;
    }

    public int getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(int commentCount) {
        this.commentCount = commentCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getModeratorNotes() {
        return moderatorNotes;
    }

    public void setModeratorNotes(String moderatorNotes) {
        this.moderatorNotes = moderatorNotes;
    }
}
