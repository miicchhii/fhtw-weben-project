package at.technikumwien.websc;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    // Get all products or filter by search term
    @GetMapping
    public List<User> getUsers(@RequestParam(value = "search", required = false) String searchTerm) {
        if (searchTerm != null && !searchTerm.isEmpty()) {
            return userRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(searchTerm,searchTerm,searchTerm);
        }
        return userRepository.findAll();
    }

    // Get a product by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
