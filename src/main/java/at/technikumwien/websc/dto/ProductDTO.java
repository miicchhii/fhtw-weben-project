package at.technikumwien.websc.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDTO {

    @NotBlank(message = "Name is required")
    private String name;

    // description is optional
    private String description;

    @NotNull(message = "Price is required")
    @Min(value = 1, message = "Price must be greater than 0")
    private Double price;

    // img is optional
    //private String imageUrl;

    @NotNull(message = "Category ID is required")
    private Long categoryId;
}
