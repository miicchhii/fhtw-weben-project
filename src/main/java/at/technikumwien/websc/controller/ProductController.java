package at.technikumwien.websc.controller;

import at.technikumwien.websc.Category;
import at.technikumwien.websc.Product;
import at.technikumwien.websc.User;
import at.technikumwien.websc.repository.CategoryRepository;
import at.technikumwien.websc.repository.ProductRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import at.technikumwien.websc.dto.ProductDTO;
import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import java.io.File;
import java.io.IOException;
import java.awt.image.BufferedImage;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.geometry.Positions;

import javax.imageio.spi.IIORegistry;

import javax.imageio.ImageIO;
import javax.imageio.spi.IIORegistry;

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
        

        productRepository.save(product);

        return ResponseEntity.status(201).body(product);
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id,
                                           @Valid @RequestBody ProductDTO dto,
                                           BindingResult bindingResult,
                                           HttpSession session) {
        // Zugriffskontrolle
        User user = (User) session.getAttribute("user");
        if (user == null || user.getRole() != User.Role.ROLE_ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        // Validierung
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        }

        // Produkt aus DB holen
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }

        // Kategorie prüfen
        Optional<Category> optionalCategory = categoryRepository.findById(dto.getCategoryId());
        if (optionalCategory.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid category ID");
        }

        // Produkt aktualisieren
        Product product = optionalProduct.get();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(BigDecimal.valueOf(dto.getPrice()));
        product.setCategory(optionalCategory.get());

        productRepository.save(product);

        return ResponseEntity.ok(product);
    }

    //FILE UPLOAD

    @PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadProductImage(@PathVariable Long id,
                                                @RequestParam("image") MultipartFile imageFile) {
        // Produkt holen
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
        Product product = optionalProduct.get();

        // Bild speichern
        try {
            // Zielverzeichnis
            String uploadDir = "uploads/products";
            Files.createDirectories(Paths.get(uploadDir)); //erstellt Verzeichnis, falls nicht vorhanden
            String filename = "product_" + id + ".webp";
            Path filePath = Paths.get(uploadDir, filename);

            // Bild speichern
            imageFile.transferTo(filePath);

            // URL zum Bild generieren
            String imageUrl = "/uploads/products/" + filename;
            product.setImageUrl(imageUrl);
            productRepository.save(product);

            return ResponseEntity.ok("Image uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Image upload failed: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProductImage(@PathVariable Long id,
                                                @RequestParam("image") MultipartFile imageFile,
                                                HttpSession session) {
        // Zugriffskontrolle
        User user = (User) session.getAttribute("user");
        if (user == null || user.getRole() != User.Role.ROLE_ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        // Produkt holen
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
        Product product = optionalProduct.get();

        try {
            // Zielverzeichnis erstellen, falls es noch nicht existiert
            String uploadDir = "uploads/products";
            Files.createDirectories(Paths.get(uploadDir));

            String filename = "product_" + id + ".webp";
            Path filePath = Paths.get(uploadDir, filename);

            // Bild speichern (überschreibt ggf. bestehendes)
            imageFile.transferTo(filePath);

            // URL aktualisieren
            String imageUrl = "/uploads/products/" + filename;
            product.setImageUrl(imageUrl);
            productRepository.save(product);

            return ResponseEntity.ok("Product image updated successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Image update failed: " + e.getMessage());
        }
    }








}



