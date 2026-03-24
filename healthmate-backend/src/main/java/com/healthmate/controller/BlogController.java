package com.healthmate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.healthmate.model.BlogPost;
import com.healthmate.model.Comment;
import com.healthmate.service.BlogService;
import com.healthmate.service.UserDetailsImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/blog")
public class BlogController {

    @Autowired
    private BlogService blogService;

    @GetMapping("/feed")
    public Page<BlogPost> getPublishedPosts(Pageable pageable) {
        return blogService.getPublishedPosts(pageable);
    }

    @GetMapping("/my-posts")
    @PreAuthorize("hasRole('USER') or hasRole('TRAINER') or hasRole('ADMIN')")
    public List<BlogPost> getMyPosts(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return blogService.getPostsByAuthor(userDetails.getId());
    }

    @PostMapping("/post")
    @PreAuthorize("hasRole('USER') or hasRole('TRAINER') or hasRole('ADMIN')")
    public BlogPost createPost(@Valid @RequestBody BlogPost post,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        post.setAuthorId(userDetails.getId());
        post.setAuthorUsername(userDetails.getUsername());
        // Simple role check for authorRole
        String role = userDetails.getAuthorities().iterator().next().getAuthority();
        post.setAuthorRole(role);
        return blogService.createPost(post);
    }

    @GetMapping("/post/{id}")
    public BlogPost getPostById(@PathVariable String id) {
        return blogService.getPostById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    @PutMapping("/post/{id}/like")
    @PreAuthorize("hasRole('USER') or hasRole('TRAINER') or hasRole('ADMIN')")
    public BlogPost likePost(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return blogService.likePost(id, userDetails.getId());
    }

    @PostMapping("/post/{id}/comment")
    @PreAuthorize("hasRole('USER') or hasRole('TRAINER') or hasRole('ADMIN')")
    public Comment addComment(@PathVariable String id, @RequestBody Comment comment,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        comment.setPostId(id);
        comment.setAuthorId(userDetails.getId());
        comment.setAuthorUsername(userDetails.getUsername());
        return blogService.addComment(comment);
    }

    @PostMapping("/comment/{commentId}/reply")
    @PreAuthorize("hasRole('USER') or hasRole('TRAINER') or hasRole('ADMIN')")
    public Comment addReply(@PathVariable String commentId, @RequestBody Comment reply,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        reply.setAuthorId(userDetails.getId());
        reply.setAuthorUsername(userDetails.getUsername());
        return blogService.addReply(commentId, reply);
    }

    @GetMapping("/post/{id}/comments")
    public List<Comment> getComments(@PathVariable String id) {
        return blogService.getComments(id);
    }

    @DeleteMapping("/comment/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('TRAINER') or hasRole('ADMIN')")
    public void deleteComment(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        boolean isModOrAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_TRAINER"));
        blogService.deleteComment(id, userDetails.getId(), isModOrAdmin);
    }
}
