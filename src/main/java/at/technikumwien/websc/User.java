package at.technikumwien.websc;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "t_user", uniqueConstraints = {@UniqueConstraint(columnNames = "email")})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String firstName;

    @Column(nullable = false, length = 30)
    private String lastName;

    @Column(nullable = false, length = 50, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;  // Hashed password storage

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Role role;

    public User(String firstName, String lastName, String email, String passwordHash, Role role) {
        this(null, firstName, lastName, email, passwordHash, role);
    }

    public User(String firstName, String lastName, String email, String passwordHash) {
        this(null, firstName, lastName, email, passwordHash, Role.CUSTOMER);
    }


    public enum Role {
        CUSTOMER,
        ADMIN
    }
}
