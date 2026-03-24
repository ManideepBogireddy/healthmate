package com.healthmate.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.healthmate.model.Comment;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId);

    List<Comment> findByPostIdAndStatus(String postId, String status);

    long countByPostId(String postId);

    void deleteByParentCommentId(String parentCommentId);
    
    List<Comment> findByParentCommentId(String parentCommentId);

    long countByParentCommentId(String parentCommentId);
}
