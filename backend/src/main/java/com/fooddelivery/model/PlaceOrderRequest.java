package com.fooddelivery.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class PlaceOrderRequest {
    @NotNull
    private Long userId;

    @NotNull
    private Long restaurantId;

    @NotBlank
    private String deliveryAddress;

    private Long groupOrderId;

    @NotEmpty
    private List<CartItemRequest> items;

    public PlaceOrderRequest() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public Long getGroupOrderId() {
        return groupOrderId;
    }

    public void setGroupOrderId(Long groupOrderId) {
        this.groupOrderId = groupOrderId;
    }

    public List<CartItemRequest> getItems() {
        return items;
    }

    public void setItems(List<CartItemRequest> items) {
        this.items = items;
    }
}
