package at.technikumwien.websc;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "t_product")
@NamedEntityGraph(
        name = "Product.fetchCategory",
        attributeNodes = {
                @NamedAttributeNode("category")
        }
)
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private LocalDate creationDate;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "categoryid", nullable = false)
    private Category category;

    @Column(length = 255) //
    private String imageUrl;

    public Product(String name, String description, BigDecimal price, LocalDate creationDate, Category category) {
        this(null, name, description, price, creationDate, category, null);
    }

    public Product(String name, String description, BigDecimal price, LocalDate creationDate, Category category, String imageUrl) {
        this(null, name, description, price, creationDate, category, imageUrl);
    }


}
