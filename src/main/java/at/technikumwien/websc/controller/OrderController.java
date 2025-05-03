package at.technikumwien.websc.controller;

import at.technikumwien.websc.Order;
import at.technikumwien.websc.User;
import at.technikumwien.websc.dto.OrderDTO;
import at.technikumwien.websc.service.OrderService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
