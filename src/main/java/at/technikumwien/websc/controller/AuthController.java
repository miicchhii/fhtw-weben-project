package at.technikumwien.websc.controller;

import at.technikumwien.websc.LoginRequest;
import at.technikumwien.websc.User;
import at.technikumwien.websc.UserRepository;
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
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not logged in"));
        }
        return ResponseEntity.ok(user);
    }

}
