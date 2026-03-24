package com.healthmate.controller;

import com.healthmate.dto.FollowUserDTO;
import com.healthmate.model.Follow;
import com.healthmate.enums.FollowType;
import com.healthmate.service.FollowService;
import com.healthmate.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/follow")
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping("/trainer/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('TRAINER') or hasRole('ADMIN')")
    public void followTrainer(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        followService.follow(userDetails.getId(), id, FollowType.TRAINER);
    }

    @DeleteMapping("/trainer/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('TRAINER') or hasRole('ADMIN')")
    public void unfollowTrainer(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        followService.unfollow(userDetails.getId(), id, FollowType.TRAINER);
    }

    @PostMapping("/user/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('TRAINER') or hasRole('ADMIN')")
    public void followUser(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        followService.follow(userDetails.getId(), id, FollowType.USER);
    }

    @DeleteMapping("/user/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('TRAINER') or hasRole('ADMIN')")
    public void unfollowUser(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        followService.unfollow(userDetails.getId(), id, FollowType.USER);
    }

    @PostMapping("/category/{name}")
    @PreAuthorize("hasRole('USER') or hasRole('TRAINER') or hasRole('ADMIN')")
    public void followCategory(@PathVariable String name, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        followService.follow(userDetails.getId(), name, FollowType.CATEGORY);
    }

    @DeleteMapping("/category/{name}")
    @PreAuthorize("hasRole('USER') or hasRole('TRAINER') or hasRole('ADMIN')")
    public void unfollowCategory(@PathVariable String name, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        followService.unfollow(userDetails.getId(), name, FollowType.CATEGORY);
    }

    @GetMapping("/my-follows")
    @PreAuthorize("hasRole('USER') or hasRole('TRAINER') or hasRole('ADMIN')")
    public List<Follow> getMyFollows(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return followService.getMyFollows(userDetails.getId());
    }

    @GetMapping("/my-follows/resolved")
    @PreAuthorize("hasRole('USER') or hasRole('TRAINER') or hasRole('ADMIN')")
    public List<FollowUserDTO> getMyFollowsResolved(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return followService.getAllFollowing(userDetails.getId());
    }

    @GetMapping("/check")
    @PreAuthorize("hasRole('USER') or hasRole('TRAINER') or hasRole('ADMIN')")
    public boolean checkFollowing(@RequestParam String targetId, @RequestParam FollowType type, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return followService.isFollowing(userDetails.getId(), targetId, type);
    }

    @GetMapping("/{targetId}/followers/count")
    public long getFollowerCount(@PathVariable String targetId, @RequestParam FollowType type) {
        return followService.getFollowerCount(targetId, type);
    }

    @GetMapping("/{targetId}/followers")
    public List<FollowUserDTO> getFollowers(@PathVariable String targetId, @RequestParam FollowType type) {
        return followService.getFollowers(targetId, type);
    }

    @GetMapping("/{followerId}/following")
    public List<FollowUserDTO> getFollowing(@PathVariable String followerId, @RequestParam FollowType type) {
        return followService.getFollowing(followerId, type);
    }
}
