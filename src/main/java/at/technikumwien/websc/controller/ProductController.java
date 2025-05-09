package at.technikumwien.websc.controller;

import at.technikumwien.websc.Category;
import at.technikumwien.websc.Product;
import at.technikumwien.websc.User;
import at.technikumwien.websc.repository.CategoryRepository;
import at.technikumwien.websc.repository.ProductRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import at.technikumwien.websc.dto.ProductDTO;
import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    // Constructor
    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    // Get all products or filter by search term
    @GetMapping
    public List<Product> getProducts(@RequestParam(value = "search", required = false) String searchTerm) {
        if (searchTerm != null && !searchTerm.isEmpty()) {
            return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(searchTerm, searchTerm);
        }
        return productRepository.findAll();
    }

    // Get a product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get a product by Category
    @GetMapping("/filter")
    public List<Product> getProductsByCategory(@RequestParam(required = false) Long categoryId) {
        if (categoryId != null) {
            return productRepository.findByCategoryId(categoryId);
        } else {
            return productRepository.findAll();
        }
    }

    // Delete a product by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null || user.getRole() != User.Role.ROLE_ADMIN) {
            return ResponseEntity.status(403).body("Access denied");
        }

        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        productRepository.deleteById(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductDTO dto,
                                           BindingResult bindingResult,
                                           HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null || user.getRole() != User.Role.ROLE_ADMIN) {
            return ResponseEntity.status(403).body("Access denied");
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        }

        // Hole Category aus der Datenbank
        var optionalCategory = categoryRepository.findById(dto.getCategoryId());
        if (optionalCategory.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid category ID");
        }

        // Erstelle Product
        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(BigDecimal.valueOf(dto.getPrice())); // DTO liefert Double, Entity erwartet BigDecimal
        product.setCreationDate(LocalDate.now());
        product.setCategory(optionalCategory.get());
        //product.setImageUrl(dto.getImageUrl()); // falls dein Model das Feld hat

        productRepository.save(product);

        return ResponseEntity.status(201).body(product);
    }





}



