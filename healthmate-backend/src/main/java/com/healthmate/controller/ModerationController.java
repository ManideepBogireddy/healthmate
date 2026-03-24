package com.healthmate.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.healthmate.model.BlogPost;
import com.healthmate.model.Report;
import com.healthmate.service.ModerationService;
import com.healthmate.service.UserDetailsImpl;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/moderation")
public class ModerationController {

    @Autowired
    private ModerationService moderationService;

    @GetMapping("/posts/pending")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TRAINER') or principal.username == 'Manideep'")
    public List<BlogPost> getPendingPosts() {
        return moderationService.getPendingPosts();
    }

    @PutMapping("/post/{id}/approve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TRAINER') or principal.username == 'Manideep'")
    public BlogPost approvePost(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return moderationService.approvePost(id, userDetails.getId());
    }

    @PutMapping("/post/{id}/reject")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TRAINER') or principal.username == 'Manideep'")
    public BlogPost rejectPost(@PathVariable String id, @RequestParam String reason,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return moderationService.rejectPost(id, userDetails.getId(), reason);
    }

    @PutMapping("/post/{id}/request-edit")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TRAINER') or principal.username == 'Manideep'")
    public BlogPost requestEdit(@PathVariable String id, @RequestParam String reason,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return moderationService.requestEdit(id, userDetails.getId(), reason);
    }

    @DeleteMapping("/post/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TRAINER') or principal.username == 'Manideep'")
    public void deletePost(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        moderationService.deletePost(id, userDetails.getId());
    }

    @PostMapping("/report")
    @PreAuthorize("hasRole('USER') or hasRole('TRAINER') or hasRole('ADMIN')")
    public Report reportContent(@Valid @RequestBody Report report,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        report.setReporterId(userDetails.getId());
        return moderationService.reportContent(report);
    }

    @GetMapping("/reports/pending")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TRAINER') or principal.username == 'Manideep'")
    public List<Report> getPendingReports() {
        return moderationService.getPendingReports();
    }

    @PutMapping("/report/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TRAINER') or principal.username == 'Manideep'")
    public Report resolveReport(@PathVariable String id, @RequestParam String status,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return moderationService.resolveReport(id, userDetails.getId(), status);
    }
}
