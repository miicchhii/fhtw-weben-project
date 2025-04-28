package at.technikumwien.websc.controller;

import at.technikumwien.websc.*;
import at.technikumwien.websc.dto.CartItemDTO;
import at.technikumwien.websc.dto.CartItemRequest;
import at.technikumwien.websc.dto.CartResponse;
import at.technikumwien.websc.repository.UserRepository;
import at.technikumwien.websc.service.CartService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getCart(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }

        Cart cart = cartService.getOrCreateCartForUser(user);
        List<CartItemDTO> items = cart.getItems().stream()
                .map(item -> new CartItemDTO(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getPrice(),
                        item.getQuantity()
                ))
                .toList();

        CartResponse response = new CartResponse(items, items.size());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/items")
    public ResponseEntity<?> addOrUpdateItem(@RequestBody CartItemRequest request, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }

        Cart cart = cartService.addOrUpdateCartItem(user, request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<?> removeItem(@PathVariable Long productId, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }

        cartService.removeCartItem(user, productId);
        return ResponseEntity.noContent().build();
    }
}
