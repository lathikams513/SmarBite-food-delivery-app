package com.fooddelivery.model;

import jakarta.validation.constraints.NotNull;

public class GroupCreateRequest {
    @NotNull
    private Long createdBy;

    @NotNull
    private Long restaurantId;

    public GroupCreateRequest() {
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }
}
