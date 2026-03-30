package com.fooddelivery.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class GroupItemRequest {
    @NotBlank
    private String groupCode;

    @NotNull
    private Long menuId;

    @NotNull
    private Integer quantity;

    public GroupItemRequest() {
    }

    public String getGroupCode() {
        return groupCode;
    }

    public void setGroupCode(String groupCode) {
        this.groupCode = groupCode;
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
