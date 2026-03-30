package com.fooddelivery.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class GroupJoinRequest {
    @NotBlank
    private String groupCode;

    @NotNull
    private Long userId;

    public GroupJoinRequest() {
    }

    public String getGroupCode() {
        return groupCode;
    }

    public void setGroupCode(String groupCode) {
        this.groupCode = groupCode;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
