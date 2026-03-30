package com.fooddelivery.daoimpl;

import com.fooddelivery.dao.OrderDao;
import com.fooddelivery.model.Order;
import com.fooddelivery.model.OrderItem;
import com.fooddelivery.model.PlaceOrderRequest;
import com.fooddelivery.util.DatabaseUtil;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Repository
public class OrderDaoImpl implements OrderDao {

    @Override
    public Order createOrder(PlaceOrderRequest request, List<OrderItem> items) throws SQLException {
        String orderSql = """
                INSERT INTO orders(user_id, restaurant_id, total_amount, status, delivery_address, group_order_id)
                VALUES (?, ?, ?, 'Placed', ?, ?)
                """;
        String itemSql = "INSERT INTO order_item(order_id, menu_id, quantity, price) VALUES (?, ?, ?, ?)";

        BigDecimal total = items.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        try (Connection connection = DatabaseUtil.getConnection()) {
            connection.setAutoCommit(false);
            try (PreparedStatement orderStatement = connection.prepareStatement(orderSql, Statement.RETURN_GENERATED_KEYS)) {
                orderStatement.setLong(1, request.getUserId());
                orderStatement.setLong(2, request.getRestaurantId());
                orderStatement.setBigDecimal(3, total);
                orderStatement.setString(4, request.getDeliveryAddress());
                if (request.getGroupOrderId() == null) {
                    orderStatement.setNull(5, java.sql.Types.BIGINT);
                } else {
                    orderStatement.setLong(5, request.getGroupOrderId());
                }
                orderStatement.executeUpdate();

                Long orderId;
                try (ResultSet keys = orderStatement.getGeneratedKeys()) {
                    if (!keys.next()) {
                        throw new SQLException("Failed to create order");
                    }
                    orderId = keys.getLong(1);
                }

                try (PreparedStatement itemStatement = connection.prepareStatement(itemSql)) {
                    for (OrderItem item : items) {
                        itemStatement.setLong(1, orderId);
                        itemStatement.setLong(2, item.getMenuId());
                        itemStatement.setInt(3, item.getQuantity());
                        itemStatement.setBigDecimal(4, item.getPrice());
                        itemStatement.addBatch();
                    }
                    itemStatement.executeBatch();
                }

                connection.commit();
                return new Order(orderId, request.getUserId(), request.getRestaurantId(), total, "Placed",
                        request.getDeliveryAddress(), null, request.getGroupOrderId(), items);
            } catch (SQLException exception) {
                connection.rollback();
                throw exception;
            } finally {
                connection.setAutoCommit(true);
            }
        }
    }

    @Override
    public List<Order> findOrdersByUserId(Long userId) throws SQLException {
        String sql = """
                SELECT o.id AS order_id, o.user_id, o.restaurant_id, o.total_amount, o.status, o.delivery_address, o.created_at, o.group_order_id,
                       oi.id AS order_item_id, oi.menu_id, oi.quantity, oi.price,
                       m.name AS menu_name, m.calories
                FROM orders o
                LEFT JOIN group_order_member gom ON gom.group_order_id = o.group_order_id AND gom.user_id = ?
                LEFT JOIN order_item oi ON oi.order_id = o.id
                LEFT JOIN menu m ON m.id = oi.menu_id
                WHERE o.user_id = ? OR gom.user_id IS NOT NULL
                ORDER BY o.created_at DESC, oi.id ASC
                """;

        Map<Long, Order> orders = new LinkedHashMap<>();
        try (Connection connection = DatabaseUtil.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, userId);
            statement.setLong(2, userId);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    Long orderId = resultSet.getLong("order_id");
                    Order order = orders.computeIfAbsent(orderId, ignored -> {
                        try {
                            return new Order(
                                    resultSet.getLong("order_id"),
                                    resultSet.getLong("user_id"),
                                    resultSet.getLong("restaurant_id"),
                                    resultSet.getBigDecimal("total_amount"),
                                    resultSet.getString("status"),
                                    resultSet.getString("delivery_address"),
                                    resultSet.getTimestamp("created_at").toLocalDateTime(),
                                    resultSet.getLong("group_order_id") == 0 ? null : resultSet.getLong("group_order_id"),
                                    new ArrayList<>()
                            );
                        } catch (SQLException exception) {
                            throw new RuntimeException(exception);
                        }
                    });

                    Long orderItemId = resultSet.getLong("order_item_id");
                    if (!resultSet.wasNull()) {
                        order.getItems().add(new OrderItem(
                                orderItemId,
                                orderId,
                                resultSet.getLong("menu_id"),
                                resultSet.getInt("quantity"),
                                resultSet.getBigDecimal("price"),
                                resultSet.getString("menu_name"),
                                resultSet.getInt("calories")
                        ));
                    }
                }
            }
        } catch (RuntimeException exception) {
            if (exception.getCause() instanceof SQLException sqlException) {
                throw sqlException;
            }
            throw exception;
        }
        return new ArrayList<>(orders.values());
    }

    @Override
    public void updateStatus(Long orderId, String status) throws SQLException {
        String sql = "UPDATE orders SET status = ? WHERE id = ?";
        try (Connection connection = DatabaseUtil.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, status);
            statement.setLong(2, orderId);
            if (statement.executeUpdate() == 0) {
                throw new IllegalArgumentException("Order not found");
            }
        }
    }
}
