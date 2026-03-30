package com.fooddelivery.model;

import java.math.BigDecimal;

public class OrderItem {
    private Long id;
    private Long orderId;
    private Long menuId;
    private Integer quantity;
    private BigDecimal price;
    private String menuName;
    private Integer calories;

    public OrderItem() {
    }

    public OrderItem(Long id, Long orderId, Long menuId, Integer quantity, BigDecimal price, String menuName, Integer calories) {
        this.id = id;
        this.orderId = orderId;
        this.menuId = menuId;
        this.quantity = quantity;
        this.price = price;
        this.menuName = menuName;
        this.calories = calories;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getMenuName() {
        return menuName;
    }

    public void setMenuName(String menuName) {
        this.menuName = menuName;
    }

    public Integer getCalories() {
        return calories;
    }

    public void setCalories(Integer calories) {
        this.calories = calories;
    }
}
