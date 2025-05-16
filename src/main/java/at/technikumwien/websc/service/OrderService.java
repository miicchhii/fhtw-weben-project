package at.technikumwien.websc.service;

import at.technikumwien.websc.*;
import at.technikumwien.websc.dto.OrderDTO;
import at.technikumwien.websc.dto.OrderItemDTO;
import at.technikumwien.websc.repository.CartRepository;
import at.technikumwien.websc.repository.OrderItemRepository;
import at.technikumwien.websc.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor // 👈 Lombok generates constructor for required fields
public class OrderService {

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final
    OrderItemRepository orderItemRepository;

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

    public List<OrderDTO> getOrders(User user) {
        List<Order> orders = orderRepository.findByUser(user);

        return orders.stream().map(order -> {
            List<OrderItemDTO> itemDTOs = order.getItems().stream()
                    .map(item -> new OrderItemDTO(
                            item.getProduct().getId(),
                            item.getProduct().getName(),
                            item.getQuantity(),
                            item.getPriceAtPurchase(),
                            item.getProduct().getId()
                    ))
                    .toList();

            User u = order.getUser();

            return new OrderDTO(
                    order.getId(),
                    order.getCreatedAt(),
                    u.getUsername(),
                    u.getEmail(),
                    u.getFirstName(),
                    u.getLastName(),
                    u.getAddress(),
                    itemDTOs
            );
        }).toList();
    }

    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();

        return orders.stream().map(order -> {
            List<OrderItemDTO> items = order.getItems().stream()
                    .map(item -> new OrderItemDTO(
                            item.getId(),
                            item.getProduct().getName(),
                            item.getQuantity(),
                            item.getPriceAtPurchase(),
                            item.getProduct().getId()
                    ))
                    .toList();


            User u = order.getUser();

            return new OrderDTO(
                    order.getId(),
                    order.getCreatedAt(),
                    u.getUsername(),
                    u.getEmail(),
                    u.getFirstName(),
                    u.getLastName(),
                    u.getAddress(),
                    items);
        }).toList();
    }

    public Order findOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public boolean deleteOrderItem(Long orderItemId) {
        Optional<OrderItem> optional = orderItemRepository.findById(orderItemId);
        if (optional.isEmpty()) return false;

        orderItemRepository.delete(optional.get());
        return true;
    }

}
