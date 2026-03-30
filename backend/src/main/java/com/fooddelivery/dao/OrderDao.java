package com.fooddelivery.dao;

import com.fooddelivery.model.Order;
import com.fooddelivery.model.OrderItem;
import com.fooddelivery.model.PlaceOrderRequest;

import java.sql.SQLException;
import java.util.List;

public interface OrderDao {
    Order createOrder(PlaceOrderRequest request, List<OrderItem> items) throws SQLException;
    List<Order> findOrdersByUserId(Long userId) throws SQLException;
    void updateStatus(Long orderId, String status) throws SQLException;
}
