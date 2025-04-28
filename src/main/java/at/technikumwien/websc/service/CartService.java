package at.technikumwien.websc.service;

import at.technikumwien.websc.Cart;
import at.technikumwien.websc.CartItem;
import at.technikumwien.websc.Product;
import at.technikumwien.websc.User;
import at.technikumwien.websc.repository.CartItemRepository;
import at.technikumwien.websc.repository.CartRepository;
import at.technikumwien.websc.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public Cart getOrCreateCartForUser(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    @Transactional
    public Cart addOrUpdateCartItem(User user, Long productId, int quantity) {
        Cart cart = getOrCreateCartForUser(user);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existingItemOpt = cartItemRepository.findByCartAndProduct(cart, product);

        if (existingItemOpt.isPresent()) {
            CartItem item = existingItemOpt.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem(null, cart, product, quantity);
            cartItemRepository.save(newItem);
        }

        return cartRepository.findById(cart.getId()).orElse(cart); // ensure items list is updated
    }

    @Transactional
    public void removeCartItem(User user, Long productId) {
        Cart cart = getOrCreateCartForUser(user);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        cartItemRepository.findByCartAndProduct(cart, product)
                .ifPresent(cartItemRepository::delete);
    }

    @Transactional
    public void emptyCart(User user) {
        Cart cart = getOrCreateCartForUser(user);
        if (cart.getItems() != null) {
            cart.getItems().clear();  // Clear all cart items
            cartRepository.save(cart);
        }
    }

}
