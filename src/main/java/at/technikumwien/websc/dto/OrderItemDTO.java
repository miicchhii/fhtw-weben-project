package at.technikumwien.websc.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class OrderItemDTO {
    private String productName;
    private int quantity;
    private BigDecimal priceAtPurchase;
    private long productId;
}
