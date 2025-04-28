package at.technikumwien.websc.service;

import at.technikumwien.websc.*;
import at.technikumwien.websc.repository.CartRepository;
import at.technikumwien.websc.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor // 👈 Lombok generates constructor for required fields
public class OrderService {

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public Order placeOrder(User user) {
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty!");
        }

        Order order = new Order();
        order.setUser(user);
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtPurchase(cartItem.getProduct().getPrice());
            orderItems.add(orderItem);
        }

        order.setItems(orderItems);
        orderRepository.save(order);

        // Empty the cart
        cart.getItems().clear();
        cartRepository.save(cart);

        return order;
    }
}
