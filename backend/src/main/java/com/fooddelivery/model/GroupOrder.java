package com.fooddelivery.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class GroupOrder {
    private Long id;
    private String groupCode;
    private Long createdBy;
    private Long restaurantId;
    private String status;
    private BigDecimal totalAmount;
    private Integer participantCount;
    private LocalDateTime createdAt;
    private BigDecimal splitAmount;
    private List<GroupOrderMember> members;
    private List<OrderItem> items;

    public GroupOrder() {
    }

    public GroupOrder(Long id, String groupCode, Long createdBy, Long restaurantId, String status,
                      BigDecimal totalAmount, Integer participantCount, LocalDateTime createdAt, BigDecimal splitAmount) {
        this.id = id;
        this.groupCode = groupCode;
        this.createdBy = createdBy;
        this.restaurantId = restaurantId;
        this.status = status;
        this.totalAmount = totalAmount;
        this.participantCount = participantCount;
        this.createdAt = createdAt;
        this.splitAmount = splitAmount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGroupCode() {
        return groupCode;
    }

    public void setGroupCode(String groupCode) {
        this.groupCode = groupCode;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Integer getParticipantCount() {
        return participantCount;
    }

    public void setParticipantCount(Integer participantCount) {
        this.participantCount = participantCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public BigDecimal getSplitAmount() {
        return splitAmount;
    }

    public void setSplitAmount(BigDecimal splitAmount) {
        this.splitAmount = splitAmount;
    }

    public List<GroupOrderMember> getMembers() {
        return members;
    }

    public void setMembers(List<GroupOrderMember> members) {
        this.members = members;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }
}
