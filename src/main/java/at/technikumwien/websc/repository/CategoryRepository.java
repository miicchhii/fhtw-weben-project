package at.technikumwien.websc.repository;

import at.technikumwien.websc.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // You can add custom queries here if needed. For example:
    // Optional<Category> findByName(String name);
}
