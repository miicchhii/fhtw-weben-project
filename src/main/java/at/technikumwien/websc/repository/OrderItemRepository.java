package at.technikumwien.websc.repository;

import at.technikumwien.websc.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
