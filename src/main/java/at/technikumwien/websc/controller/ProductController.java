package at.technikumwien.websc.controller;

import at.technikumwien.websc.Category;
import at.technikumwien.websc.Product;
import at.technikumwien.websc.User;
import at.technikumwien.websc.repository.CategoryRepository;
import at.technikumwien.websc.repository.ProductRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
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

import javax.imageio.ImageIO;

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

    @PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadProductImage(@PathVariable Long id,
                                                @RequestParam("image") MultipartFile imageFile,
                                                HttpSession session) {
        // Admin-Prüfung
        User user = (User) session.getAttribute("user");
        if (user == null || user.getRole() != User.Role.ROLE_ADMIN) {
            return ResponseEntity.status(403).body("Access denied");
        }

        // Produkt prüfen
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product product = productOpt.get();

        if (imageFile.isEmpty()) {
            return ResponseEntity.badRequest().body("No file uploaded");
        }

        try {
            // Dateiname: produktname_timestamp.webp
            String baseName = product.getName()
                    .toLowerCase()
                    .replaceAll("[^a-z0-9]", "-")
                    + "_" + System.currentTimeMillis();

            // Zielpfade
            Path root = Paths.get("app/frontend/uploads/");
            Path originals = root.resolve("originals");
            Path thumbs = root.resolve("thumbnails");

            Files.createDirectories(originals);
            Files.createDirectories(thumbs);

            // Bild laden
            BufferedImage inputImage = ImageIO.read(imageFile.getInputStream());

            // Original: max 800x800
            BufferedImage resized = Thumbnails.of(inputImage)
                    .size(800, 800)
                    .keepAspectRatio(true)
                    .asBufferedImage();

            // Thumbnail: 200x200, gecroppt
            BufferedImage thumbnail = Thumbnails.of(inputImage)
                    .size(200, 200)
                    .crop(Positions.CENTER)
                    .asBufferedImage();

            // Speicherdateien
            File originalFile = originals.resolve(baseName + ".webp").toFile();
            File thumbFile = thumbs.resolve(baseName + ".webp").toFile();

            // Speichern als WebP
            ImageIO.write(resized, "webp", originalFile);
            ImageIO.write(thumbnail, "webp", thumbFile);

            // Produkt aktualisieren
            product.setImageUrl("/uploads/originals/" + baseName + ".webp");
            productRepository.save(product);

            return ResponseEntity.ok("Image uploaded successfully");

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Image processing failed");
        }
    }







}



