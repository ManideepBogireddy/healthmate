package com.healthmate.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.healthmate.model.ERole;
import com.healthmate.model.Role;
import com.healthmate.model.User;
import com.healthmate.dto.JwtResponse;
import com.healthmate.dto.LoginRequest;
import com.healthmate.dto.MessageResponse;
import com.healthmate.dto.SignupRequest;
import com.healthmate.repository.RoleRepository;
import com.healthmate.repository.UserRepository;
import com.healthmate.config.JwtUtils;
import com.healthmate.service.UserDetailsImpl;

import com.healthmate.service.EmailService;
import com.healthmate.service.OtpService;
import jakarta.mail.MessagingException;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    OtpService otpService;

    @Autowired
    EmailService emailService;

    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestParam String username) {
        System.out.println("Checking availability for: " + username);
        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.ok(new MessageResponse("Taken"));
        }
        return ResponseEntity.ok(new MessageResponse("Available"));
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        System.out.println("Checking availability for email: " + email);
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.ok(new MessageResponse("Taken"));
        }
        return ResponseEntity.ok(new MessageResponse("Available"));
    }

    @PostMapping("/send-signup-otp")
    public ResponseEntity<?> sendSignupOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        String otp = otpService.generateOtp(email);
        try {
            emailService.sendOtpEmail(email, otp, "email_verification");
        } catch (MessagingException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Please enter a valid mail id."));
        }

        return ResponseEntity.ok(new MessageResponse("OTP sent to your email!"));
    }

    // --- Account Recovery Endpoints ---

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (!userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email not found!"));
        }

        String otp = otpService.generateOtp(email);
        try {
            emailService.sendOtpEmail(email, otp, "password_reset");
        } catch (MessagingException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(new MessageResponse("Error: Failed to send email."));
        }

        return ResponseEntity.ok(new MessageResponse("OTP sent to your email!"));
    }

    @PostMapping("/forgot-username")
    public ResponseEntity<?> forgotUsername(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (!userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email not found!"));
        }

        String otp = otpService.generateOtp(email);
        try {
            emailService.sendOtpEmail(email, otp, "username_recovery");
        } catch (MessagingException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(new MessageResponse("Error: Failed to send email."));
        }

        return ResponseEntity.ok(new MessageResponse("OTP sent to your email!"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        if (otpService.isOtpValid(email, otp)) {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Error: User not found."));
            user.setPassword(encoder.encode(newPassword));
            userRepository.save(user); // Password updated
            return ResponseEntity.ok(new MessageResponse("Password reset successfully!"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid or Expired OTP!"));
        }
    }

    @PostMapping("/reset-username")
    public ResponseEntity<?> resetUsername(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newUsername = request.get("newUsername");

        if (otpService.isOtpValid(email, otp)) {
            if (userRepository.existsByUsername(newUsername)) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
            }
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Error: User not found."));
            user.setUsername(newUsername);
            userRepository.save(user); // Username updated
            return ResponseEntity.ok(new MessageResponse("Username reset successfully!"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid or Expired OTP!"));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (otpService.isOtpValid(email, otp)) {
            return ResponseEntity.ok(new MessageResponse("Valid"));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid or Expired OTP"));
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        // Set additional physical stats
        user.setAge(signUpRequest.getAge());
        user.setHeight(signUpRequest.getHeight());
        user.setWeight(signUpRequest.getWeight());
        user.setActivityLevel(signUpRequest.getActivityLevel());
        user.setHealthGoal(signUpRequest.getHealthGoal());

        Set<String> strRoles = signUpRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
