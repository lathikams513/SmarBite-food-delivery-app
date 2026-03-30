package com.fooddelivery.dao;

import com.fooddelivery.model.GroupOrder;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.Optional;

public interface GroupOrderDao {
    GroupOrder createGroup(Long createdBy, Long restaurantId) throws SQLException;
    Optional<GroupOrder> findByCode(String groupCode) throws SQLException;
    Optional<GroupOrder> findById(Long groupOrderId) throws SQLException;
    GroupOrder joinGroup(String groupCode, Long userId) throws SQLException;
    GroupOrder addGroupItem(String groupCode, Long menuId, Integer quantity) throws SQLException;
    GroupOrder updateMemberSplit(String groupCode, Long userId, BigDecimal amount) throws SQLException;
    void markGroupPlaced(Long groupOrderId, BigDecimal totalAmount) throws SQLException;
}
