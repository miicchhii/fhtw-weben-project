package at.technikumwien.websc.controller;

import at.technikumwien.websc.User;
import at.technikumwien.websc.repository.UserRepository;
import at.technikumwien.websc.dto.LoginRequest;
import at.technikumwien.websc.dto.RegisterRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        String loginInput = loginRequest.login();
        String password = loginRequest.passwordHash();

        User user = userRepository.findByEmailIgnoreCase(loginInput);
        if (user == null) {
            user = userRepository.findByUsernameIgnoreCase(loginInput);
        }

        if (user == null || !user.getPassword().equals(password)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        var authorities = List.of(new SimpleGrantedAuthority(user.getRole().name()));
        var authToken = new UsernamePasswordAuthenticationToken(user.getEmail(), null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authToken);

        // ✅ Store SecurityContext in session
        request.getSession().setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

        // Optional: store user object separately
        request.getSession().setAttribute("user", user);

        return ResponseEntity.ok(Map.of("message", "Login successful"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
        }

        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not logged in"));
        }

        return ResponseEntity.ok(user);


    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already in use"));
        }

        if (userRepository.existsByUsernameIgnoreCase(request.username())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already taken"));
        }

        User newUser = new User(
                request.firstName(),
                request.lastName(),
                request.email(),
                request.username(),
                request.passwordHash(), // 🛡 Optional: hash this later
                User.Role.ROLE_CUSTOMER
        );

        userRepository.save(newUser);
        return ResponseEntity.ok(Map.of("message", "Registration successful"));
    }

    //PASSWORD

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> payload, HttpSession session) {

        User user = (User) session.getAttribute("user");

        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not logged in"));
        }

        String oldPassword = payload.get("oldPassword");
        String newPassword = payload.get("newPassword");


        if (oldPassword == null || oldPassword.isBlank() || newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Old and new password must be provided"));
        }


        if (!user.getPassword().equals(oldPassword)) {
            return ResponseEntity.status(400).body(Map.of("error", "Old password is incorrect"));
        }


        user.setPassword(newPassword); // 🛡 später: Hier PasswordEncoder verwenden!

        userRepository.save(user);


        session.setAttribute("user", user);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }



}
