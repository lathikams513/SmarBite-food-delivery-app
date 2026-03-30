package com.fooddelivery.daoimpl;

import com.fooddelivery.dao.GroupOrderDao;
import com.fooddelivery.model.GroupOrder;
import com.fooddelivery.model.GroupOrderMember;
import com.fooddelivery.model.OrderItem;
import com.fooddelivery.util.DatabaseUtil;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class GroupOrderDaoImpl implements GroupOrderDao {

    @Override
    public GroupOrder createGroup(Long createdBy, Long restaurantId) throws SQLException {
        String sql = "INSERT INTO group_order(group_code, created_by, restaurant_id, total_amount, participant_count) VALUES (?, ?, ?, 0, 1)";
        String code = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        try (Connection connection = DatabaseUtil.getConnection()) {
            connection.setAutoCommit(false);
            try (PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                statement.setString(1, code);
                statement.setLong(2, createdBy);
                statement.setLong(3, restaurantId);
                statement.executeUpdate();
                Long groupId;
                try (ResultSet keys = statement.getGeneratedKeys()) {
                    if (!keys.next()) {
                        throw new SQLException("Unable to create group order");
                    }
                    groupId = keys.getLong(1);
                }
                addMember(connection, groupId, createdBy);
                syncGroupMeta(connection, groupId);
                connection.commit();
                return findByCode(code).orElseThrow(() -> new SQLException("Unable to fetch group order"));
            } catch (SQLException exception) {
                connection.rollback();
                throw exception;
            } finally {
                connection.setAutoCommit(true);
            }
        }
    }

    @Override
    public Optional<GroupOrder> findByCode(String groupCode) throws SQLException {
        String sql = "SELECT * FROM group_order WHERE group_code = ?";
        try (Connection connection = DatabaseUtil.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, groupCode);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return Optional.empty();
                }
                GroupOrder group = mapGroup(resultSet);
                hydrateGroup(connection, group);
                return Optional.of(group);
            }
        }
    }

    @Override
    public Optional<GroupOrder> findById(Long groupOrderId) throws SQLException {
        String sql = "SELECT * FROM group_order WHERE id = ?";
        try (Connection connection = DatabaseUtil.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, groupOrderId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return Optional.empty();
                }
                GroupOrder group = mapGroup(resultSet);
                hydrateGroup(connection, group);
                return Optional.of(group);
            }
        }
    }

    @Override
    public GroupOrder joinGroup(String groupCode, Long userId) throws SQLException {
        try (Connection connection = DatabaseUtil.getConnection()) {
            connection.setAutoCommit(false);
            try {
                GroupOrder group = getOpenGroup(connection, groupCode);
                addMember(connection, group.getId(), userId);
                syncGroupMeta(connection, group.getId());
                connection.commit();
                return findByCode(groupCode).orElseThrow(() -> new IllegalArgumentException("Group order not found"));
            } catch (SQLException exception) {
                connection.rollback();
                throw exception;
            } finally {
                connection.setAutoCommit(true);
            }
        }
    }

    @Override
    public GroupOrder addGroupItem(String groupCode, Long menuId, Integer quantity) throws SQLException {
        try (Connection connection = DatabaseUtil.getConnection()) {
            connection.setAutoCommit(false);
            try {
                GroupOrder group = getOpenGroup(connection, groupCode);
                if (quantity <= 0) {
                    removeGroupItem(connection, group.getId(), menuId);
                } else if (hasGroupItem(connection, group.getId(), menuId)) {
                    updateGroupItemQuantity(connection, group.getId(), menuId, quantity);
                } else {
                    insertGroupItem(connection, group.getId(), menuId, quantity);
                }
                syncGroupMeta(connection, group.getId());
                connection.commit();
                return findByCode(groupCode).orElseThrow(() -> new IllegalArgumentException("Group order not found"));
            } catch (SQLException exception) {
                connection.rollback();
                throw exception;
            } finally {
                connection.setAutoCommit(true);
            }
        }
    }

    @Override
    public GroupOrder updateMemberSplit(String groupCode, Long userId, BigDecimal amount) throws SQLException {
        String sql = "UPDATE group_order_member SET custom_amount = ? WHERE group_order_id = ? AND user_id = ?";
        try (Connection connection = DatabaseUtil.getConnection()) {
            connection.setAutoCommit(false);
            try {
                GroupOrder group = getOpenGroup(connection, groupCode);
                try (PreparedStatement statement = connection.prepareStatement(sql)) {
                    statement.setBigDecimal(1, amount);
                    statement.setLong(2, group.getId());
                    statement.setLong(3, userId);
                    if (statement.executeUpdate() == 0) {
                        throw new IllegalArgumentException("User is not part of this split order");
                    }
                }
                syncGroupMeta(connection, group.getId());
                connection.commit();
                return findByCode(groupCode).orElseThrow(() -> new IllegalArgumentException("Group order not found"));
            } catch (SQLException exception) {
                connection.rollback();
                throw exception;
            } finally {
                connection.setAutoCommit(true);
            }
        }
    }

    @Override
    public void markGroupPlaced(Long groupOrderId, BigDecimal totalAmount) throws SQLException {
        String updateGroupSql = "UPDATE group_order SET status = 'PLACED', total_amount = ? WHERE id = ?";
        String clearItemsSql = "DELETE FROM group_order_item WHERE group_order_id = ?";
        try (Connection connection = DatabaseUtil.getConnection()) {
            connection.setAutoCommit(false);
            try (PreparedStatement updateStatement = connection.prepareStatement(updateGroupSql);
                 PreparedStatement clearItemsStatement = connection.prepareStatement(clearItemsSql)) {
                updateStatement.setBigDecimal(1, totalAmount);
                updateStatement.setLong(2, groupOrderId);
                updateStatement.executeUpdate();
                clearItemsStatement.setLong(1, groupOrderId);
                clearItemsStatement.executeUpdate();
                connection.commit();
            } catch (SQLException exception) {
                connection.rollback();
                throw exception;
            } finally {
                connection.setAutoCommit(true);
            }
        }
    }

    private GroupOrder getOpenGroup(Connection connection, String groupCode) throws SQLException {
        String sql = "SELECT * FROM group_order WHERE group_code = ? AND status = 'OPEN'";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, groupCode);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    throw new IllegalArgumentException("Group order not found or already placed");
                }
                return mapGroup(resultSet);
            }
        }
    }

    private void addMember(Connection connection, Long groupId, Long userId) throws SQLException {
        String existsSql = "SELECT 1 FROM group_order_member WHERE group_order_id = ? AND user_id = ?";
        try (PreparedStatement existsStatement = connection.prepareStatement(existsSql)) {
            existsStatement.setLong(1, groupId);
            existsStatement.setLong(2, userId);
            try (ResultSet resultSet = existsStatement.executeQuery()) {
                if (resultSet.next()) {
                    return;
                }
            }
        }
        String insertSql = "INSERT INTO group_order_member(group_order_id, user_id) VALUES (?, ?)";
        try (PreparedStatement insertStatement = connection.prepareStatement(insertSql)) {
            insertStatement.setLong(1, groupId);
            insertStatement.setLong(2, userId);
            insertStatement.executeUpdate();
        }
    }

    private boolean hasGroupItem(Connection connection, Long groupId, Long menuId) throws SQLException {
        String sql = "SELECT quantity FROM group_order_item WHERE group_order_id = ? AND menu_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, groupId);
            statement.setLong(2, menuId);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next();
            }
        }
    }

    private void insertGroupItem(Connection connection, Long groupId, Long menuId, Integer quantity) throws SQLException {
        String sql = "INSERT INTO group_order_item(group_order_id, menu_id, quantity) VALUES (?, ?, ?)";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, groupId);
            statement.setLong(2, menuId);
            statement.setInt(3, quantity);
            statement.executeUpdate();
        }
    }

    private void updateGroupItemQuantity(Connection connection, Long groupId, Long menuId, Integer quantityDelta) throws SQLException {
        String sql = "UPDATE group_order_item SET quantity = quantity + ? WHERE group_order_id = ? AND menu_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, quantityDelta);
            statement.setLong(2, groupId);
            statement.setLong(3, menuId);
            statement.executeUpdate();
        }
        String cleanupSql = "DELETE FROM group_order_item WHERE group_order_id = ? AND menu_id = ? AND quantity <= 0";
        try (PreparedStatement cleanupStatement = connection.prepareStatement(cleanupSql)) {
            cleanupStatement.setLong(1, groupId);
            cleanupStatement.setLong(2, menuId);
            cleanupStatement.executeUpdate();
        }
    }

    private void removeGroupItem(Connection connection, Long groupId, Long menuId) throws SQLException {
        String sql = "DELETE FROM group_order_item WHERE group_order_id = ? AND menu_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, groupId);
            statement.setLong(2, menuId);
            statement.executeUpdate();
        }
    }

    private void syncGroupMeta(Connection connection, Long groupId) throws SQLException {
        BigDecimal total = BigDecimal.ZERO;
        int participantCount = 0;

        String totalSql = "SELECT COALESCE(SUM(goi.quantity * m.price), 0) AS total_amount FROM group_order_item goi JOIN menu m ON m.id = goi.menu_id WHERE goi.group_order_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(totalSql)) {
            statement.setLong(1, groupId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    total = resultSet.getBigDecimal("total_amount");
                }
            }
        }

        String countSql = "SELECT COUNT(*) AS member_count FROM group_order_member WHERE group_order_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(countSql)) {
            statement.setLong(1, groupId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    participantCount = resultSet.getInt("member_count");
                }
            }
        }

        String updateSql = "UPDATE group_order SET total_amount = ?, participant_count = ? WHERE id = ?";
        try (PreparedStatement statement = connection.prepareStatement(updateSql)) {
            statement.setBigDecimal(1, total);
            statement.setInt(2, participantCount);
            statement.setLong(3, groupId);
            statement.executeUpdate();
        }
    }

    private void hydrateGroup(Connection connection, GroupOrder group) throws SQLException {
        group.setMembers(loadMembers(connection, group.getId()));
        group.setItems(loadItems(connection, group.getId()));
        int participantCount = group.getMembers() == null ? 0 : group.getMembers().size();
        if (participantCount > 0) {
            group.setParticipantCount(participantCount);
            group.setSplitAmount(group.getTotalAmount().divide(BigDecimal.valueOf(participantCount), 2, RoundingMode.HALF_UP));
        } else {
            group.setSplitAmount(BigDecimal.ZERO);
        }
    }

    private List<GroupOrderMember> loadMembers(Connection connection, Long groupId) throws SQLException {
        String sql = "SELECT gom.user_id, u.name, gom.custom_amount FROM group_order_member gom JOIN users u ON u.id = gom.user_id WHERE gom.group_order_id = ? ORDER BY gom.id ASC";
        List<GroupOrderMember> members = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, groupId);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    members.add(new GroupOrderMember(
                            resultSet.getLong("user_id"),
                            resultSet.getString("name"),
                            resultSet.getBigDecimal("custom_amount")
                    ));
                }
            }
        }
        return members;
    }

    private List<OrderItem> loadItems(Connection connection, Long groupId) throws SQLException {
        String sql = "SELECT goi.id, goi.menu_id, goi.quantity, m.price, m.name, m.calories FROM group_order_item goi JOIN menu m ON m.id = goi.menu_id WHERE goi.group_order_id = ? ORDER BY goi.id ASC";
        List<OrderItem> items = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, groupId);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    items.add(new OrderItem(
                            resultSet.getLong("id"),
                            null,
                            resultSet.getLong("menu_id"),
                            resultSet.getInt("quantity"),
                            resultSet.getBigDecimal("price"),
                            resultSet.getString("name"),
                            resultSet.getInt("calories")
                    ));
                }
            }
        }
        return items;
    }

    private GroupOrder mapGroup(ResultSet resultSet) throws SQLException {
        BigDecimal total = resultSet.getBigDecimal("total_amount");
        int participantCount = resultSet.getInt("participant_count");
        return new GroupOrder(
                resultSet.getLong("id"),
                resultSet.getString("group_code"),
                resultSet.getLong("created_by"),
                resultSet.getLong("restaurant_id"),
                resultSet.getString("status"),
                total,
                participantCount,
                resultSet.getTimestamp("created_at").toLocalDateTime(),
                participantCount == 0 ? BigDecimal.ZERO : total.divide(BigDecimal.valueOf(participantCount), 2, RoundingMode.HALF_UP)
        );
    }
}
