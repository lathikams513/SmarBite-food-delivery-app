package com.fooddelivery.model;

import java.time.LocalDateTime;

public class UserHistory {
    private Long id;
    private Long userId;
    private Long menuId;
    private Integer frequency;
    private LocalDateTime lastOrdered;

    public UserHistory() {
    }

    public UserHistory(Long id, Long userId, Long menuId, Integer frequency, LocalDateTime lastOrdered) {
        this.id = id;
        this.userId = userId;
        this.menuId = menuId;
        this.frequency = frequency;
        this.lastOrdered = lastOrdered;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getMenuId() {
        return menuId;
    }

    public void setMenuId(Long menuId) {
        this.menuId = menuId;
    }

    public Integer getFrequency() {
        return frequency;
    }

    public void setFrequency(Integer frequency) {
        this.frequency = frequency;
    }

    public LocalDateTime getLastOrdered() {
        return lastOrdered;
    }

    public void setLastOrdered(LocalDateTime lastOrdered) {
        this.lastOrdered = lastOrdered;
    }
}
