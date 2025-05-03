package at.technikumwien.websc.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private LocalDateTime createdAt;
    private String userName;
    private String userEmail;
    private List<OrderItemDTO> items;

    public OrderDTO(Long id, LocalDateTime createdAt, List<OrderItemDTO> items) {
        this.id = id;
        this.createdAt = createdAt;
        this.items = items;
        this.userName = null;
        this.userEmail = null;
    }
}
