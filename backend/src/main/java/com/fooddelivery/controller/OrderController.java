package com.fooddelivery.controller;

import com.fooddelivery.model.CartItemRequest;
import com.fooddelivery.model.OrderStatusRequest;
import com.fooddelivery.model.PlaceOrderRequest;
import com.fooddelivery.service.OrderService;
import com.fooddelivery.util.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;

@RestController
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/cart/add")
    public ApiResponse<Object> addToCart(@Valid @RequestBody CartItemRequest request) throws SQLException {
        return new ApiResponse<>(true, "Cart preview created", orderService.previewCart(request));
    }

    @PostMapping("/order/place")
    public ApiResponse<Object> placeOrder(@Valid @RequestBody PlaceOrderRequest request) throws SQLException {
        return new ApiResponse<>(true, "Order placed successfully", orderService.placeOrder(request));
    }

    @GetMapping("/orders/{userId}")
    public ApiResponse<Object> getOrders(@PathVariable Long userId) throws SQLException {
        return new ApiResponse<>(true, "Order history fetched", orderService.getOrdersByUser(userId));
    }

    @PutMapping("/order/status")
    public ApiResponse<Object> updateOrderStatus(@Valid @RequestBody OrderStatusRequest request) throws SQLException {
        orderService.updateOrderStatus(request);
        return new ApiResponse<>(true, "Order status updated", null);
    }
}
