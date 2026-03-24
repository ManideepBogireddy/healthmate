package com.healthmate.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healthmate.model.BlogPost;
import com.healthmate.model.ModerationLog;
import com.healthmate.model.Report;
import com.healthmate.enums.PostStatus;
import com.healthmate.exception.ResourceNotFoundException;
import com.healthmate.repository.BlogPostRepository;
import com.healthmate.repository.ModerationLogRepository;
import com.healthmate.repository.ReportRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ModerationService {

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private ModerationLogRepository moderationLogRepository;

    private static final Logger logger = LoggerFactory.getLogger(ModerationService.class);

    public List<BlogPost> getPendingPosts() {
        return blogPostRepository.findByStatus(PostStatus.PENDING);
    }

    public BlogPost approvePost(String id, String moderatorId) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        post.setStatus(PostStatus.PUBLISHED);
        post.setUpdatedAt(LocalDateTime.now());
        BlogPost savedPost = blogPostRepository.save(post);

        logAction(moderatorId, "APPROVE", "BLOG_POST", id, "Post approved for feed");
        logger.info("Moderator {} approved post {}", moderatorId, id);
        return savedPost;
    }

    public BlogPost rejectPost(String id, String moderatorId, String reason) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        post.setStatus(PostStatus.REJECTED);
        post.setUpdatedAt(LocalDateTime.now());
        BlogPost savedPost = blogPostRepository.save(post);

        logAction(moderatorId, "REJECT", "BLOG_POST", id, reason);
        logger.info("Moderator {} rejected post {} for reason: {}", moderatorId, id, reason);
        return savedPost;
    }

    public BlogPost requestEdit(String id, String moderatorId, String reason) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        post.setStatus(PostStatus.NEEDS_REVISION);
        post.setUpdatedAt(LocalDateTime.now());
        post.setModeratorNotes(reason);
        BlogPost savedPost = blogPostRepository.save(post);

        logAction(moderatorId, "REQUEST_EDIT", "BLOG_POST", id, reason);
        logger.info("Moderator {} requested edit for post {}: {}", moderatorId, id, reason);
        return savedPost;
    }

    public void deletePost(String id, String moderatorId) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        
        blogPostRepository.delete(post);
        logAction(moderatorId, "DELETE", "BLOG_POST", id, "Post deleted by moderator from queue");
        logger.info("Moderator {} deleted post {}", moderatorId, id);
    }

    public Report reportContent(Report report) {
        return reportRepository.save(report);
    }

    public List<Report> getPendingReports() {
        return reportRepository.findByStatus("PENDING");
    }

    public Report resolveReport(String id, String moderatorId, String status) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        report.setStatus(status);
        report.setResolvedAt(LocalDateTime.now());
        report.setResolutionNotes("Resolved by " + moderatorId);
        Report savedReport = reportRepository.save(report);

        logAction(moderatorId, "RESOLVE_REPORT", report.getContentType(), report.getContentId(),
                "Report status set to " + status);
        logger.info("Moderator {} resolved report {}", moderatorId, id);
        return savedReport;
    }

    private void logAction(String moderatorId, String action, String resourceType, String resourceId, String details) {
        moderationLogRepository.save(new ModerationLog(moderatorId, action, resourceType, resourceId, details));
    }
}
