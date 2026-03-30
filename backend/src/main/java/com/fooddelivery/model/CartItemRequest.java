package com.fooddelivery.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CartItemRequest {
    @NotNull
    private Long menuId;

    @Min(1)
    private Integer quantity;

    public CartItemRequest() {
    }

    public Long getMenuId() {
        return menuId;
    }

    public void setMenuId(Long menuId) {
        this.menuId = menuId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
