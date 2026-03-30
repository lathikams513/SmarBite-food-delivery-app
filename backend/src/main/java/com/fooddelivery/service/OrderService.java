package com.fooddelivery.service;

import com.fooddelivery.dao.GroupOrderDao;
import com.fooddelivery.dao.MenuDao;
import com.fooddelivery.dao.OrderDao;
import com.fooddelivery.dao.UserDao;
import com.fooddelivery.model.CartItemRequest;
import com.fooddelivery.model.MenuItem;
import com.fooddelivery.model.Order;
import com.fooddelivery.model.OrderItem;
import com.fooddelivery.model.OrderStatusRequest;
import com.fooddelivery.model.PlaceOrderRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private static final List<String> ALLOWED_STATUSES = List.of("Placed", "Preparing", "Out for Delivery", "Delivered");

    private final OrderDao orderDao;
    private final MenuDao menuDao;
    private final UserDao userDao;
    private final GroupOrderDao groupOrderDao;

    public OrderService(OrderDao orderDao, MenuDao menuDao, UserDao userDao, GroupOrderDao groupOrderDao) {
        this.orderDao = orderDao;
        this.menuDao = menuDao;
        this.userDao = userDao;
        this.groupOrderDao = groupOrderDao;
    }

    public Order previewCart(CartItemRequest request) throws SQLException {
        MenuItem item = menuDao.findById(request.getMenuId())
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found"));
        OrderItem orderItem = new OrderItem(null, null, item.getId(), request.getQuantity(), item.getPrice(), item.getName(), item.getCalories());
        BigDecimal total = item.getPrice().multiply(BigDecimal.valueOf(request.getQuantity()));
        return new Order(null, null, item.getRestaurantId(), total, "CartPreview", "", null, null, List.of(orderItem));
    }

    public Order placeOrder(PlaceOrderRequest request) throws SQLException {
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItemRequest itemRequest : request.getItems()) {
            MenuItem item = menuDao.findById(itemRequest.getMenuId())
                    .orElseThrow(() -> new IllegalArgumentException("Menu item not found: " + itemRequest.getMenuId()));
            orderItems.add(new OrderItem(null, null, item.getId(), itemRequest.getQuantity(), item.getPrice(), item.getName(), item.getCalories()));
        }

        Order order = orderDao.createOrder(request, orderItems);
        for (OrderItem item : orderItems) {
            userDao.updateUserHistory(request.getUserId(), item.getMenuId(), item.getQuantity());
        }
        if (request.getGroupOrderId() != null) {
            groupOrderDao.markGroupPlaced(request.getGroupOrderId(), order.getTotalAmount());
        }
        return order;
    }

    public List<Order> getOrdersByUser(Long userId) throws SQLException {
        return orderDao.findOrdersByUserId(userId);
    }

    public void updateOrderStatus(OrderStatusRequest request) throws SQLException {
        if (!ALLOWED_STATUSES.contains(request.getStatus())) {
            throw new IllegalArgumentException("Status must be one of: " + ALLOWED_STATUSES);
        }
        orderDao.updateStatus(request.getOrderId(), request.getStatus());
    }
}
