package com.healthmate.security.oauth2;

import com.healthmate.config.JwtUtils;
import com.healthmate.model.ERole;
import com.healthmate.model.Role;
import com.healthmate.model.User;
import com.healthmate.repository.RoleRepository;
import com.healthmate.repository.UserRepository;
import com.healthmate.service.UserDetailsImpl;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        // Log attributes for debugging
        System.out.println("OAuth2 Login Success: " + email + ", Name: " + name);

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();
        } else {
            // Register new user
            user = new User(name.replace(" ", "").toLowerCase() + "_" + System.currentTimeMillis() % 1000,
                    email,
                    encoder.encode("GoogleAuthIsSecure123!")); // Dummy password

            Set<Role> roles = new HashSet<>();
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
            user.setRoles(roles);

            // Set default stats
            user.setAge(25);
            user.setHeight(170.0);
            user.setWeight(70.0);
            user.setActivityLevel("medium");
            user.setHealthGoal("stay_fit");

            userRepository.save(user);
        }

        // Generate JWT
        String jwt = jwtUtils.generateTokenFromUsername(user.getUsername());

        // Redirection URL
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/login") // Redirect to Login page
                                                                                             // to handle token
                .queryParam("token", jwt)
                .queryParam("username", user.getUsername()) // helpful for greeting
                .queryParam("newUser", !userOptional.isPresent()) // Flag for frontend
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
