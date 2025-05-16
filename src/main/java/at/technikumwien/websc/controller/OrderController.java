package at.technikumwien.websc.controller;

import at.technikumwien.websc.Order;
import at.technikumwien.websc.User;
import at.technikumwien.websc.dto.OrderDTO;
import at.technikumwien.websc.dto.OrderItemDTO;
import at.technikumwien.websc.service.OrderService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<?> placeOrder(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }

        Order order = orderService.placeOrder(user);
        return ResponseEntity.ok(Map.of("orderId", order.getId()));
    }

    @GetMapping
    public ResponseEntity<?> getOrders(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }

        List<OrderDTO> orders = orderService.getOrders(user);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllOrders(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null || user.getRole() != User.Role.ROLE_ADMIN) {
            return ResponseEntity.status(403).body("Access denied");
        }

        List<OrderDTO> allOrders = orderService.getAllOrders();
        return ResponseEntity.ok(allOrders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }

        Order order = orderService.findOrderById(id);
        if (order == null) {
            return ResponseEntity.status(404).body("Order not found");
        }

        // Nur eigene Bestellung oder Admin?
        if (!order.getUser().getId().equals(user.getId()) &&
                user.getRole() != User.Role.ROLE_ADMIN) {
            return ResponseEntity.status(403).body("Access denied");
        }

        List<OrderItemDTO> items = order.getItems().stream()
                .map(item -> new OrderItemDTO(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPriceAtPurchase(),
                        item.getProduct().getId()
                ))
                .toList();

        User u = order.getUser();
        OrderDTO dto = new OrderDTO(
                order.getId(),
                order.getCreatedAt(),
                u.getUsername(),
                u.getEmail(),
                u.getFirstName(),
                u.getLastName(),
                u.getAddress(),
                items
        );

        return ResponseEntity.ok(dto);
    }


}
