package com.fooddelivery.dao;

import com.fooddelivery.model.MenuItem;
import com.fooddelivery.model.RegisterRequest;
import com.fooddelivery.model.User;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public interface UserDao {
    User createUser(RegisterRequest request) throws SQLException;
    User saveRegistrationOtp(RegisterRequest request, String otpCode, java.time.LocalDateTime otpExpiry) throws SQLException;
    Optional<User> findByEmail(String email) throws SQLException;
    Optional<User> findById(Long userId) throws SQLException;
    void storeLoginOtp(String email, String otpCode, java.time.LocalDateTime otpExpiry) throws SQLException;
    void clearOtp(Long userId) throws SQLException;
    void updateVerification(Long userId, boolean verified) throws SQLException;
    List<MenuItem> getTopRecommendations(Long userId, int limit) throws SQLException;
    void updateUserHistory(Long userId, Long menuId, int quantity) throws SQLException;
}
