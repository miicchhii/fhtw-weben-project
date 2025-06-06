package at.technikumwien.websc;

import at.technikumwien.websc.repository.CategoryRepository;
import at.technikumwien.websc.repository.ProductRepository;
import at.technikumwien.websc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class TransactionalDataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    public TransactionalDataInitializer(ProductRepository productRepository, CategoryRepository categoryRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    @Override
    public void run(String... args) {
        seedCategories();
        seedProducts();
        seedUsers();
    }

    private void seedCategories() {
        if (categoryRepository.count() > 0) return;

        List<Category> categories = List.of(
                new Category("Laptops"),
                new Category("Smartphones"),
                new Category("Tablets"),
                new Category("Cameras"),
                new Category("Gaming"),
                new Category("TVs"),
                new Category("Wearable Tech"),
                new Category("Smart Home"),
                new Category("Audio")
        );

        categoryRepository.saveAll(categories);
    }

    private void seedProducts() {
        if (productRepository.count() > 0) return;

        Map<String, Category> categoryMap = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(Category::getName, category -> category));

        List<Product> products = List.of(
                new Product("HP Spectre x360", "Convertible laptop with touchscreen", new BigDecimal("1299.99"), LocalDate.now(), categoryMap.get("Laptops"), "/uploads/products/product_1.png"),
                new Product("Dell XPS 13", "Premium ultrabook with stunning display", new BigDecimal("1399.99"), LocalDate.now(), categoryMap.get("Laptops"), "/uploads/products/product_2.png"),
                new Product("Lenovo ThinkPad X1 Carbon", "Business-class laptop with durability", new BigDecimal("1599.99"), LocalDate.now(), categoryMap.get("Laptops"), "/uploads/products/product_3.png"),
                new Product("Asus ROG Zephyrus G14", "Powerful gaming laptop with Ryzen CPU", new BigDecimal("1499.99"), LocalDate.now(), categoryMap.get("Laptops"), "/uploads/products/product_4.png"),
                new Product("MSI Stealth 15M", "Slim gaming laptop with RTX graphics", new BigDecimal("1699.99"), LocalDate.now(), categoryMap.get("Laptops"), "/uploads/products/product_5.png"),

                new Product("Samsung Galaxy Z Fold 4", "Foldable smartphone with dual displays", new BigDecimal("1799.99"), LocalDate.now(), categoryMap.get("Smartphones"), "/uploads/products/product_6.png"),
                new Product("iPhone 14 Pro Max", "Premium iPhone with advanced camera", new BigDecimal("1199.99"), LocalDate.now(), categoryMap.get("Smartphones"), "/uploads/products/product_7.png"),
                new Product("Google Pixel 7 Pro", "Pixel phone with AI-enhanced photography", new BigDecimal("899.99"), LocalDate.now(), categoryMap.get("Smartphones"), "/uploads/products/product_8.png"),
                new Product("OnePlus 10T", "Flagship killer with fast charging", new BigDecimal("749.99"), LocalDate.now(), categoryMap.get("Smartphones"), "/uploads/products/product_9.png"),
                new Product("Sony Xperia 1 IV", "High-end smartphone with 4K display", new BigDecimal("1099.99"), LocalDate.now(), categoryMap.get("Smartphones"), "/uploads/products/product_10.png"),

                new Product("Bose SoundLink Revolve+", "Portable Bluetooth speaker with 360° sound", new BigDecimal("249.99"), LocalDate.now(), categoryMap.get("Audio"), "/uploads/products/product_11.png"),
                new Product("Anker Soundcore Life Q30", "Affordable noise-cancelling headphones", new BigDecimal("89.99"), LocalDate.now(), categoryMap.get("Audio"), "/uploads/products/product_12.png"),
                new Product("Sennheiser Momentum 4", "Premium over-ear wireless headphones", new BigDecimal("349.99"), LocalDate.now(), categoryMap.get("Audio"), "/uploads/products/product_13.png"),
                new Product("Sony WF-1000XM4", "Top-tier true wireless noise-cancelling earbuds", new BigDecimal("279.99"), LocalDate.now(), categoryMap.get("Audio"), "/uploads/products/product_14.png"),
                new Product("Jabra Elite 85t", "Compact earbuds with customizable ANC", new BigDecimal("229.99"), LocalDate.now(), categoryMap.get("Audio"), "/uploads/products/product_15.png"),

                new Product("Samsung Galaxy Tab S8 Ultra", "Large-screen Android tablet", new BigDecimal("1099.99"), LocalDate.now(), categoryMap.get("Tablets"), "/uploads/products/product_16.png"),
                new Product("iPad Air 5", "Balanced performance iPad with M1 chip", new BigDecimal("599.99"), LocalDate.now(), categoryMap.get("Tablets")),
                new Product("Lenovo Yoga Tab 13", "Entertainment-focused Android tablet", new BigDecimal("699.99"), LocalDate.now(), categoryMap.get("Tablets")),
                new Product("Amazon Kindle Paperwhite", "E-ink reader with adjustable lighting", new BigDecimal("149.99"), LocalDate.now(), categoryMap.get("Tablets")),
                new Product("Microsoft Surface Go 3", "Compact Windows tablet for portability", new BigDecimal("399.99"), LocalDate.now(), categoryMap.get("Tablets")),

                new Product("Garmin Venu 2", "Fitness smartwatch with AMOLED display", new BigDecimal("399.99"), LocalDate.now(), categoryMap.get("Wearable Tech"), "/uploads/products/product_21.png"),
                new Product("Fossil Gen 6", "Classic-looking smartwatch with Wear OS", new BigDecimal("299.99"), LocalDate.now(), categoryMap.get("Wearable Tech")),
                new Product("TicWatch Pro 3 Ultra", "Durable smartwatch with dual-layer display", new BigDecimal("249.99"), LocalDate.now(), categoryMap.get("Wearable Tech")),
                new Product("Fitbit Sense 2", "Health-focused smartwatch with stress tracking", new BigDecimal("229.99"), LocalDate.now(), categoryMap.get("Wearable Tech")),
                new Product("Huawei Watch GT 3", "Long battery life smartwatch", new BigDecimal("199.99"), LocalDate.now(), categoryMap.get("Wearable Tech")),

                new Product("Sony A7 IV", "Full-frame mirrorless camera with 4K video", new BigDecimal("2499.99"), LocalDate.now(), categoryMap.get("Cameras"), "/uploads/products/product_26.png"),
                new Product("Panasonic Lumix GH6", "Micro Four Thirds camera for video creators", new BigDecimal("2199.99"), LocalDate.now(), categoryMap.get("Cameras")),
                new Product("DJI Osmo Pocket 2", "Compact gimbal-stabilized camera", new BigDecimal("349.99"), LocalDate.now(), categoryMap.get("Cameras")),
                new Product("Canon EOS 90D", "DSLR with fast autofocus and great ergonomics", new BigDecimal("1199.99"), LocalDate.now(), categoryMap.get("Cameras")),
                new Product("Olympus OM-D E-M1 Mark III", "Lightweight mirrorless camera for travel", new BigDecimal("1599.99"), LocalDate.now(), categoryMap.get("Cameras")),

                new Product("Steam Deck", "Handheld gaming PC from Valve", new BigDecimal("399.99"), LocalDate.now(), categoryMap.get("Gaming"), "/uploads/products/product_31.png"),
                new Product("Xbox Series S", "Compact and budget-friendly gaming console", new BigDecimal("299.99"), LocalDate.now(), categoryMap.get("Gaming")),
                new Product("Logitech G Pro X", "Wireless gaming headset with surround sound", new BigDecimal("199.99"), LocalDate.now(), categoryMap.get("Gaming")),
                new Product("Asus ROG Phone 6", "Gaming smartphone with advanced cooling", new BigDecimal("1099.99"), LocalDate.now(), categoryMap.get("Gaming")),
                new Product("Meta Quest Pro", "Advanced VR headset with mixed reality", new BigDecimal("1499.99"), LocalDate.now(), categoryMap.get("Gaming")),

                new Product("LG OLED C1", "4K OLED TV with stunning picture quality", new BigDecimal("1499.99"), LocalDate.now(), categoryMap.get("TVs"), "/uploads/products/product_36.png"),
                new Product("Samsung QN90A", "High-end QLED TV with Mini-LED tech", new BigDecimal("1799.99"), LocalDate.now(), categoryMap.get("TVs")),
                new Product("Sony A80J", "Premium OLED TV with great motion handling", new BigDecimal("1899.99"), LocalDate.now(), categoryMap.get("TVs")),
                new Product("TCL 6-Series", "Budget-friendly 4K TV with Dolby Vision", new BigDecimal("899.99"), LocalDate.now(), categoryMap.get("TVs")),
                new Product("Hisense U8G", "Affordable TV with great HDR performance", new BigDecimal("749.99"), LocalDate.now(), categoryMap.get("TVs")),

                new Product("Google Nest Hub Max", "Smart home display with built-in camera", new BigDecimal("229.99"), LocalDate.now(), categoryMap.get("Smart Home"), "/uploads/products/product_41.png"),
                new Product("Amazon Echo Show 10", "Smart display with rotating screen", new BigDecimal("249.99"), LocalDate.now(), categoryMap.get("Smart Home")),
                new Product("Philips Hue Starter Kit", "Smart lighting system with color changing bulbs", new BigDecimal("179.99"), LocalDate.now(), categoryMap.get("Smart Home")),
                new Product("Arlo Pro 4", "Wireless home security camera with 2K video", new BigDecimal("199.99"), LocalDate.now(), categoryMap.get("Smart Home")),
                new Product("August Smart Lock Pro", "Smart lock with auto-unlock feature", new BigDecimal("249.99"), LocalDate.now(), categoryMap.get("Smart Home"))
        );

        productRepository.saveAll(products);
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;
        userRepository.save(new User("Hans", "Müller", "hans.mueller@gmail.com", "admin", passwordEncoder.encode("admin"), User.Role.ROLE_ADMIN));
        userRepository.save(new User("Anna", "Schmidt", "anna.schmidt@gmail.com", "customer", passwordEncoder.encode("customer"), User.Role.ROLE_CUSTOMER));
    }

}
