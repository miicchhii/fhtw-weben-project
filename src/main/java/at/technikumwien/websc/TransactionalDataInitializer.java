package at.technikumwien.websc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class TransactionalDataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public TransactionalDataInitializer(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            // Add categories (all electronics-related)
            Category category1 = new Category("Laptops");
            Category category2 = new Category("Smartphones");
            Category category3 = new Category("Headphones");
            Category category4 = new Category("Tablets");
            Category category5 = new Category("Smartwatches");
            Category category6 = new Category("Cameras");
            Category category7 = new Category("Gaming Consoles");
            Category category8 = new Category("TVs");
            Category category9 = new Category("Home Audio");
            Category category10 = new Category("Computer Accessories");
            Category category11 = new Category("Smart Home Devices");
            Category category12 = new Category("Virtual Reality");
            Category category13 = new Category("Wearable Tech");
            Category category14 = new Category("PC Components");
            Category category15 = new Category("Chargers & Batteries");

            categoryRepository.save(category1);
            categoryRepository.save(category2);
            categoryRepository.save(category3);
            categoryRepository.save(category4);
            categoryRepository.save(category5);
            categoryRepository.save(category6);
            categoryRepository.save(category7);
            categoryRepository.save(category8);
            categoryRepository.save(category9);
            categoryRepository.save(category10);
            categoryRepository.save(category11);
            categoryRepository.save(category12);
            categoryRepository.save(category13);
            categoryRepository.save(category14);
            categoryRepository.save(category15);

            // Add products (50 in total)
            productRepository.save(new Product("Laptop 15\"", "High-performance laptop for gaming", new BigDecimal("999.99"), LocalDate.now(), category1));
            productRepository.save(new Product("Laptop 13\"", "Portable laptop for work and school", new BigDecimal("799.99"), LocalDate.now(), category1));
            productRepository.save(new Product("Laptop 17\"", "Large screen laptop for creative professionals", new BigDecimal("1299.99"), LocalDate.now(), category1));
            productRepository.save(new Product("MacBook Pro", "Apple's premium laptop for professionals", new BigDecimal("2299.99"), LocalDate.now(), category1));
            productRepository.save(new Product("Gaming Laptop", "High-performance laptop with GTX graphics", new BigDecimal("1499.99"), LocalDate.now(), category1));

            productRepository.save(new Product("iPhone 14", "Latest iPhone with powerful camera", new BigDecimal("999.99"), LocalDate.now(), category2));
            productRepository.save(new Product("Samsung Galaxy S22", "Flagship Android phone with AMOLED display", new BigDecimal("899.99"), LocalDate.now(), category2));
            productRepository.save(new Product("OnePlus 9 Pro", "High-speed 5G smartphone", new BigDecimal("799.99"), LocalDate.now(), category2));
            productRepository.save(new Product("Google Pixel 6", "Smartphone with stock Android experience", new BigDecimal("599.99"), LocalDate.now(), category2));
            productRepository.save(new Product("Xiaomi Mi 11", "Affordable flagship smartphone", new BigDecimal("549.99"), LocalDate.now(), category2));

            productRepository.save(new Product("Sony WH-1000XM4", "Noise-cancelling over-ear headphones", new BigDecimal("349.99"), LocalDate.now(), category3));
            productRepository.save(new Product("Bose QuietComfort 35 II", "Wireless noise-cancelling headphones", new BigDecimal("299.99"), LocalDate.now(), category3));
            productRepository.save(new Product("Apple AirPods Pro", "Premium true wireless earbuds", new BigDecimal("249.99"), LocalDate.now(), category3));
            productRepository.save(new Product("JBL Charge 5", "Portable Bluetooth speaker with deep bass", new BigDecimal("179.99"), LocalDate.now(), category3));
            productRepository.save(new Product("Beats Studio3", "Wireless noise-cancelling over-ear headphones", new BigDecimal("279.99"), LocalDate.now(), category3));

            productRepository.save(new Product("Apple iPad Pro", "12.9-inch tablet for professionals", new BigDecimal("1099.99"), LocalDate.now(), category4));
            productRepository.save(new Product("Samsung Galaxy Tab S7", "High-performance Android tablet", new BigDecimal("649.99"), LocalDate.now(), category4));
            productRepository.save(new Product("Amazon Fire HD 10", "Budget-friendly tablet for entertainment", new BigDecimal("149.99"), LocalDate.now(), category4));
            productRepository.save(new Product("Microsoft Surface Pro", "Windows tablet with detachable keyboard", new BigDecimal("799.99"), LocalDate.now(), category4));
            productRepository.save(new Product("Lenovo Tab P11", "Mid-range Android tablet for daily tasks", new BigDecimal("299.99"), LocalDate.now(), category4));

            productRepository.save(new Product("Apple Watch Series 7", "Fitness-focused smartwatch with large display", new BigDecimal("399.99"), LocalDate.now(), category5));
            productRepository.save(new Product("Samsung Galaxy Watch 4", "Smartwatch with health monitoring features", new BigDecimal("249.99"), LocalDate.now(), category5));
            productRepository.save(new Product("Fitbit Charge 5", "Fitness tracker with advanced health metrics", new BigDecimal("179.99"), LocalDate.now(), category5));
            productRepository.save(new Product("Garmin Fenix 6", "Rugged GPS smartwatch for athletes", new BigDecimal("499.99"), LocalDate.now(), category5));
            productRepository.save(new Product("Amazfit GTR 3", "Affordable yet feature-rich smartwatch", new BigDecimal("149.99"), LocalDate.now(), category5));

            productRepository.save(new Product("Sony A7 III", "Full-frame mirrorless camera for professionals", new BigDecimal("1999.99"), LocalDate.now(), category6));
            productRepository.save(new Product("Canon EOS R5", "High-end mirrorless camera with 8K video", new BigDecimal("3899.99"), LocalDate.now(), category6));
            productRepository.save(new Product("Nikon Z6 II", "Mirrorless camera with excellent image quality", new BigDecimal("1699.99"), LocalDate.now(), category6));
            productRepository.save(new Product("GoPro HERO10", "Action camera with 5.3K video", new BigDecimal("399.99"), LocalDate.now(), category6));
            productRepository.save(new Product("Fujifilm X-T4", "Compact mirrorless camera with great autofocus", new BigDecimal("1699.99"), LocalDate.now(), category6));

            // Continue with more products for other categories (Gaming Consoles, TVs, etc.)
            // (Repeat the same pattern for other categories: Gaming Consoles, TVs, etc.)

            productRepository.save(new Product("PlayStation 5", "Latest gaming console from Sony", new BigDecimal("499.99"), LocalDate.now(), category7));
            productRepository.save(new Product("Xbox Series X", "Powerful gaming console from Microsoft", new BigDecimal("499.99"), LocalDate.now(), category7));
            productRepository.save(new Product("Nintendo Switch", "Hybrid gaming console for on-the-go gaming", new BigDecimal("299.99"), LocalDate.now(), category7));
            productRepository.save(new Product("Razer Blade Stealth", "Portable gaming laptop with high refresh rate", new BigDecimal("1799.99"), LocalDate.now(), category7));
            productRepository.save(new Product("Oculus Quest 2", "Standalone VR headset for immersive gaming", new BigDecimal("299.99"), LocalDate.now(), category12));
        }
    }
}
