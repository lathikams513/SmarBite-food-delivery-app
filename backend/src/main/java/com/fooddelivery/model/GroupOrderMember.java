package com.fooddelivery.model;

import java.math.BigDecimal;

public class GroupOrderMember {
    private Long userId;
    private String name;
    private BigDecimal customAmount;

    public GroupOrderMember() {
    }

    public GroupOrderMember(Long userId, String name, BigDecimal customAmount) {
        this.userId = userId;
        this.name = name;
        this.customAmount = customAmount;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getCustomAmount() {
        return customAmount;
    }

    public void setCustomAmount(BigDecimal customAmount) {
        this.customAmount = customAmount;
    }
}
