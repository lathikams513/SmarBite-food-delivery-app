package com.fooddelivery.daoimpl;

import com.fooddelivery.dao.UserDao;
import com.fooddelivery.model.MenuItem;
import com.fooddelivery.model.RegisterRequest;
import com.fooddelivery.model.User;
import com.fooddelivery.util.DatabaseUtil;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class UserDaoImpl implements UserDao {

    @Override
    public User createUser(RegisterRequest request) throws SQLException {
        String sql = "INSERT INTO users(name, email, password, phone, address, is_verified) VALUES (?, ?, ?, ?, ?, TRUE)";
        try (Connection connection = DatabaseUtil.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            statement.setString(1, request.getName());
            statement.setString(2, request.getEmail());
            statement.setString(3, request.getPassword());
            statement.setString(4, request.getPhone());
            statement.setString(5, request.getAddress());
            statement.executeUpdate();

            try (ResultSet keys = statement.getGeneratedKeys()) {
                if (keys.next()) {
                    return findById(keys.getLong(1)).orElseThrow(() -> new SQLException("Unable to fetch created user"));
                }
            }
        }
        throw new SQLException("Failed to create user");
    }

    @Override
    public User saveRegistrationOtp(RegisterRequest request, String otpCode, java.time.LocalDateTime otpExpiry) throws SQLException {
        Optional<User> existingUser = findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            String updateSql = """
                    UPDATE users
                    SET name = ?, password = ?, phone = ?, address = ?, otp_code = ?, otp_expiry = ?, is_verified = FALSE
                    WHERE email = ?
                    """;
            try (Connection connection = DatabaseUtil.getConnection();
                 PreparedStatement statement = connection.prepareStatement(updateSql)) {
                statement.setString(1, request.getName());
                statement.setString(2, request.getPassword());
                statement.setString(3, request.getPhone());
                statement.setString(4, request.getAddress());
                statement.setString(5, otpCode);
                statement.setTimestamp(6, java.sql.Timestamp.valueOf(otpExpiry));
                statement.setString(7, request.getEmail());
                statement.executeUpdate();
            }
            return findByEmail(request.getEmail()).orElseThrow(() -> new SQLException("Unable to load pending user"));
        }

        String insertSql = """
                INSERT INTO users(name, email, password, phone, address, otp_code, otp_expiry, is_verified)
                VALUES (?, ?, ?, ?, ?, ?, ?, FALSE)
                """;
        try (Connection connection = DatabaseUtil.getConnection();
             PreparedStatement statement = connection.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS)) {
            statement.setString(1, request.getName());
            statement.setString(2, request.getEmail());
            statement.setString(3, request.getPassword());
            statement.setString(4, request.getPhone());
            statement.setString(5, request.getAddress());
            statement.setString(6, otpCode);
            statement.setTimestamp(7, java.sql.Timestamp.valueOf(otpExpiry));
            statement.executeUpdate();

            try (ResultSet keys = statement.getGeneratedKeys()) {
                if (keys.next()) {
                    return findById(keys.getLong(1)).orElseThrow(() -> new SQLException("Unable to fetch pending user"));
                }
            }
        }
        throw new SQLException("Failed to save OTP session");
    }

    @Override
    public Optional<User> findByEmail(String email) throws SQLException {
        String sql = "SELECT * FROM users WHERE email = ?";
        try (Connection connection = DatabaseUtil.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, email);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next() ? Optional.of(mapUser(resultSet)) : Optional.empty();
            }
        }
    }

    @Override
    public Optional<User> findById(Long userId) throws SQLException {
        String sql = "SELECT * FROM users WHERE id = ?";
        try (Connection connection = DatabaseUtil.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, userId);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next() ? Optional.of(mapUser(resultSet)) : Optional.empty();
            }
        }
    }

    @Override
    public void storeLoginOtp(String email, String otpCode, java.time.LocalDateTime otpExpiry) throws SQLException {
        String sql = "UPDATE users SET otp_code = ?, otp_expiry = ? WHERE email = ?";
        try (Connection connection = DatabaseUtil.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, otpCode);
            statement.setTimestamp(2, java.sql.Timestamp.valueOf(otpExpiry));
            statement.setString(3, email);
            if (statement.executeUpdate() == 0) {
                throw new IllegalArgumentException("User not found");
            }
        }
    }

    @Override
    public void clearOtp(Long userId) throws SQLException {
        String sql = "UPDATE users SET otp_code = NULL, otp_expiry = NULL WHERE id = ?";
        try (Connection connection = DatabaseUtil.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, userId);
            statement.executeUpdate();
        }
    }

    @Override
    public void updateVerification(Long userId, boolean verified) throws SQLException {
        String sql = "UPDATE users SET is_verified = ? WHERE id = ?";
        try (Connection connection = DatabaseUtil.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setBoolean(1, verified);
            statement.setLong(2, userId);
            statement.executeUpdate();
        }
    }

    @Override
    public List<MenuItem> getTopRecommendations(Long userId, int limit) throws SQLException {
        String sql = """
                SELECT m.*, uh.frequency
                FROM user_history uh
                JOIN menu m ON m.id = uh.menu_id
                WHERE uh.user_id = ?
                ORDER BY uh.frequency DESC, uh.last_ordered DESC
                LIMIT ?
                """;

        List<MenuItem> items = new ArrayList<>();
        try (Connection connection = DatabaseUtil.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, userId);
            statement.setInt(2, limit);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    items.add(mapMenuItem(resultSet));
                }
            }
        }
        return items;
    }

    @Override
    public void updateUserHistory(Long userId, Long menuId, int quantity) throws SQLException {
        String sql = """
                INSERT INTO user_history(user_id, menu_id, frequency, last_ordered)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                ON DUPLICATE KEY UPDATE
                    frequency = frequency + VALUES(frequency),
                    last_ordered = CURRENT_TIMESTAMP
                """;
        try (Connection connection = DatabaseUtil.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, userId);
            statement.setLong(2, menuId);
            statement.setInt(3, quantity);
            statement.executeUpdate();
        }
    }

    private User mapUser(ResultSet resultSet) throws SQLException {
        return new User(
                resultSet.getLong("id"),
                resultSet.getString("name"),
                resultSet.getString("email"),
                resultSet.getString("password"),
                resultSet.getString("phone"),
                resultSet.getString("address"),
                resultSet.getString("otp_code"),
                resultSet.getTimestamp("otp_expiry") == null ? null : resultSet.getTimestamp("otp_expiry").toLocalDateTime(),
                resultSet.getBoolean("is_verified"),
                resultSet.getTimestamp("created_at").toLocalDateTime()
        );
    }

    private MenuItem mapMenuItem(ResultSet resultSet) throws SQLException {
        return new MenuItem(
                resultSet.getLong("id"),
                resultSet.getLong("restaurant_id"),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getBigDecimal("price"),
                resultSet.getInt("calories"),
                resultSet.getString("category"),
                resultSet.getBoolean("is_veg"),
                resultSet.getString("image_url"),
                resultSet.getInt("prep_time_minutes"),
                resultSet.getBoolean("is_bestseller"),
                resultSet.getString("item_tag"),
                resultSet.getInt("discount_percent")
        );
    }
}
