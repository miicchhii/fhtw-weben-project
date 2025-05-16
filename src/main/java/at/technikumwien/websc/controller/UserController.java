package at.technikumwien.websc.controller;

import at.technikumwien.websc.User;
import at.technikumwien.websc.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;


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

    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(@RequestBody Map<String, String> updates, HttpSession session) {
        User sessionUser = (User) session.getAttribute("user");

        if (sessionUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not logged in"));
        }

        Optional<User> userOpt = userRepository.findById(sessionUser.getId());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();

        //check password correct
        String password = updates.get("password");
        if (password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password is required to update your profile."));
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(403).body(Map.of("error", "Incorrect password."));
        }

        // check unique email
        if (updates.containsKey("email")) {
            String newEmail = updates.get("email");
            if (!newEmail.equalsIgnoreCase(user.getEmail()) &&
                    userRepository.existsByEmailIgnoreCase(newEmail)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email already in use"));
            }
            user.setEmail(newEmail);
        }

        // check unique username
        if (updates.containsKey("username")) {
            String newUsername = updates.get("username");
            if (!newUsername.equalsIgnoreCase(user.getUsername()) &&
                    userRepository.existsByUsernameIgnoreCase(newUsername)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username already taken"));
            }
            user.setUsername(newUsername);
        }


        if (updates.containsKey("firstName")) user.setFirstName(updates.get("firstName"));
        if (updates.containsKey("lastName")) user.setLastName(updates.get("lastName"));
        if (updates.containsKey("address")) user.setAddress(updates.get("address"));

        // check birthday, if empty, set to null (delete)
        String birthdate = updates.get("birthdate");
        System.out.println(birthdate);
        if (!birthdate.isBlank()) {
            try {
                user.setBirthdate(java.sql.Date.valueOf(birthdate));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid birthdate format (expected: YYYY-MM-DD)"));
            }
        } else {
            user.setBirthdate(null);
        }

        userRepository.save(user);
        session.setAttribute("user", user); // Session aktualisieren

        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    @PutMapping("/{id}/active")
    public ResponseEntity<?> updateUserActiveStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> body, HttpSession session) {
        User currentUser = (User) session.getAttribute("user");
        if (currentUser == null || currentUser.getRole() != User.Role.ROLE_ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Boolean active = body.get("active");
        if (active == null) {
            return ResponseEntity.badRequest().body("Missing 'active' parameter");
        }

        User targetUser = userOpt.get();
        targetUser.setActive(active);
        userRepository.save(targetUser);

        return ResponseEntity.ok().build();
    }


}
