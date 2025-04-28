package at.technikumwien.websc.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class CartItemDTO {
    private Long productId;
    private String productName;
    private BigDecimal productPrice;
    private int quantity;
}
