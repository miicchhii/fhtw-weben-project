package at.technikumwien.websc.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class CartResponse {
    private List<CartItemDTO> items;
    private int totalItems;
}
