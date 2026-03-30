package com.fooddelivery.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class OrderStatusRequest {
    @NotNull
    private Long orderId;

    @NotBlank
    private String status;

    public OrderStatusRequest() {
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
