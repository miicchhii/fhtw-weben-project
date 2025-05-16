package at.technikumwien.websc;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @Column(nullable = false, unique = true)
    private String username;

    @JsonIgnore
    @Column(nullable = false)
    private String password;  // Hashed password storage



    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Role role;

    @Column(length = 255)
    private String address;

    @Column
    private java.sql.Date birthdate;

    @Column(nullable = false)
    private boolean active = true;


    public User(String firstName, String lastName, String email, String username, String passwordHash, Role role) {
        this(null, firstName, lastName, email, username, passwordHash, role, null, null, true);
    }

    public User(String firstName, String lastName, String email, String username, String passwordHash) {
        this(null, firstName, lastName, email, username, passwordHash, Role.ROLE_CUSTOMER, null, null, true);
    }



    public Object getPassword() {
        return password;
    }



    public enum Role {
        ROLE_CUSTOMER,
        ROLE_ADMIN
    }



}
