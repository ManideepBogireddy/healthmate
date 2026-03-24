package com.healthmate.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healthmate.model.BlogPost;
import com.healthmate.model.Comment;
import com.healthmate.enums.PostStatus;
import com.healthmate.exception.ResourceNotFoundException;
import com.healthmate.repository.BlogPostRepository;
import com.healthmate.repository.CommentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class BlogService {

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private CommentRepository commentRepository;

    private static final Logger logger = LoggerFactory.getLogger(BlogService.class);

    public BlogPost createPost(BlogPost post) {
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        post.setStatus(PostStatus.PENDING);
        post.setLikes(0);
        post.setLikedBy(new java.util.ArrayList<>());
        post.setCommentCount(0);
        BlogPost savedPost = blogPostRepository.save(post);
        logger.info("Post created: {} by user {}", savedPost.getId(), savedPost.getAuthorId());
        return savedPost;
    }

    public Page<BlogPost> getPublishedPosts(Pageable pageable) {
        logger.info("Fetching published posts for feed");
        Page<BlogPost> posts = blogPostRepository.findByStatusOrderByCreatedAtDesc(PostStatus.PUBLISHED, pageable);
        
        // Sync comment and like counts for any posts that might be out of sync
        posts.forEach(post -> {
            boolean changed = false;
            long actualCommentCount = commentRepository.countByPostId(post.getId());
            if (post.getCommentCount() != (int) actualCommentCount) {
                post.setCommentCount((int) actualCommentCount);
                changed = true;
            }
            
            int actualLikeCount = post.getLikedBy() != null ? post.getLikedBy().size() : 0;
            if (post.getLikes() != actualLikeCount) {
                post.setLikes(actualLikeCount);
                changed = true;
            }
            
            if (changed) {
                blogPostRepository.save(post);
            }
        });
        
        return posts;
    }

    public List<BlogPost> getAllPostsForModeration() {
        return blogPostRepository.findAll();
    }

    public List<BlogPost> getPostsByAuthor(String authorId) {
        List<BlogPost> posts = blogPostRepository.findByAuthorId(authorId);
        // Sync counts
        posts.forEach(post -> {
            boolean changed = false;
            long actualCommentCount = commentRepository.countByPostId(post.getId());
            if (post.getCommentCount() != (int) actualCommentCount) {
                post.setCommentCount((int) actualCommentCount);
                changed = true;
            }
            int actualLikeCount = post.getLikedBy() != null ? post.getLikedBy().size() : 0;
            if (post.getLikes() != actualLikeCount) {
                post.setLikes(actualLikeCount);
                changed = true;
            }
            if (changed) {
                blogPostRepository.save(post);
            }
        });
        return posts;
    }

    public Optional<BlogPost> getPostById(String id) {
        Optional<BlogPost> postOpt = blogPostRepository.findById(id);
        postOpt.ifPresent(post -> {
            boolean changed = false;
            long actualCommentCount = commentRepository.countByPostId(post.getId());
            if (post.getCommentCount() != (int) actualCommentCount) {
                post.setCommentCount((int) actualCommentCount);
                changed = true;
            }
            int actualLikeCount = post.getLikedBy() != null ? post.getLikedBy().size() : 0;
            if (post.getLikes() != actualLikeCount) {
                post.setLikes(actualLikeCount);
                changed = true;
            }
            if (changed) {
                blogPostRepository.save(post);
            }
        });
        return postOpt;
    }

    public BlogPost updatePost(BlogPost post) {
        post.setUpdatedAt(LocalDateTime.now());
        return blogPostRepository.save(post);
    }

    public void deletePost(String id) {
        blogPostRepository.deleteById(id);
        List<Comment> comments = commentRepository.findByPostId(id);
        commentRepository.deleteAll(comments);
    }

    public BlogPost likePost(String id, String userId) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (!post.getStatus().equals(PostStatus.PUBLISHED)) {
            throw new RuntimeException("Cannot like unpublished post");
        }

        List<String> likedBy = post.getLikedBy();
        if (likedBy == null) {
            likedBy = new java.util.ArrayList<>();
            post.setLikedBy(likedBy);
        }

        String userIdStr = String.valueOf(userId);
        boolean alreadyLiked = likedBy.stream().anyMatch(existingId -> String.valueOf(existingId).equals(userIdStr));

        if (!alreadyLiked) {
            likedBy.add(userIdStr);
            logger.info("User {} liked post {}", userIdStr, id);
        } else {
            // Remove all occurrences of the user ID (just in case)
            likedBy.removeIf(existingId -> String.valueOf(existingId).equals(userIdStr));
            logger.info("User {} unliked post {}", userIdStr, id);
        }

        post.setLikes(likedBy.size());
        return blogPostRepository.save(post);
    }


    // Comment logic
    public Comment addComment(Comment comment) {
        Comment savedComment = commentRepository.save(comment);
        updatePostCommentCount(comment.getPostId(), 1);
        return savedComment;
    }

    public Comment addReply(String parentCommentId, Comment reply) {
        Comment parentComment = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
        
        reply.setParentCommentId(parentCommentId);
        reply.setPostId(parentComment.getPostId());
        Comment savedReply = commentRepository.save(reply);
        
        updatePostCommentCount(parentComment.getPostId(), 1);
        return savedReply;
    }

    private void updatePostCommentCount(String postId, int delta) {
        blogPostRepository.findById(postId).ifPresent(post -> {
            post.setCommentCount(Math.max(0, post.getCommentCount() + delta));
            blogPostRepository.save(post);
        });
    }

    public List<Comment> getComments(String postId) {
        return commentRepository.findByPostIdAndStatus(postId, "APPROVED");
    }

    public void deleteComment(String commentId, String userId, boolean isModOrAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        // Permission check
        if (!comment.getAuthorId().equals(userId) && !isModOrAdmin) {
            throw new RuntimeException("Unauthorized to delete this comment");
        }

        // Recursive deletion
        int deletedCount = deleteRecursive(commentId);

        // Update post count
        updatePostCommentCount(comment.getPostId(), -deletedCount);
    }

    private int deleteRecursive(String commentId) {
        int count = 1;
        List<Comment> replies = commentRepository.findByParentCommentId(commentId);
        for (Comment reply : replies) {
            count += deleteRecursive(reply.getId());
        }
        commentRepository.deleteById(commentId);
        return count;
    }
}
