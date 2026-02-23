package com.healthmate.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthmate.service.HealthTipService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/health-tips")
public class HealthTipController {

    @Autowired
    HealthTipService healthTipService;

    @GetMapping("/today")
    public ResponseEntity<?> getTodayTip() {
        return ResponseEntity.ok(healthTipService.getTipForToday());
    }
}
