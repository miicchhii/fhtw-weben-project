package at.technikumwien.websc.controller;

import at.technikumwien.websc.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    // GET /api/users – Only Admins
    @GetMapping
    public ResponseEntity<?> getUsers(@RequestParam(value = "search", required = false) String searchTerm) {
        if (!hasRole("ADMIN")) {
            return ResponseEntity.status(403).body(Map.of(
                    "error", "Access Denied",
                    "reason", "You must be an admin to access this resource."
            ));
        }

        if (searchTerm != null && !searchTerm.isEmpty()) {
            return ResponseEntity.ok(
                    userRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                            searchTerm, searchTerm, searchTerm
                    )
            );
        }

        return ResponseEntity.ok(userRepository.findAll());
    }

    // GET /api/users/{id} – Admins or the user themselves
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        String currentUserEmail = getCurrentUserEmail();

        return userRepository.findById(id)
                .map(user -> {
                    if (hasRole("ADMIN") || user.getEmail().equalsIgnoreCase(currentUserEmail)) {
                        return ResponseEntity.ok(user);
                    } else {
                        return ResponseEntity.status(403).body(Map.of(
                                "error", "Access Denied",
                                "reason", "Only admins or the user themself can access this resource."
                        ));

                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private boolean hasRole(String role) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_" + role));
    }

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
