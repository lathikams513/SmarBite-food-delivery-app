package com.fooddelivery.model;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class BudgetRequest {
    @NotNull
    private Long restaurantId;

    @NotNull
    @DecimalMin("1.0")
    private BigDecimal budget;

    public BudgetRequest() {
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }
}
