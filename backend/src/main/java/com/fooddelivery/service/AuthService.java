package com.fooddelivery.service;

import com.fooddelivery.dao.UserDao;
import com.fooddelivery.model.LoginRequest;
import com.fooddelivery.model.OtpSessionResponse;
import com.fooddelivery.model.OtpVerificationRequest;
import com.fooddelivery.model.RegisterRequest;
import com.fooddelivery.model.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;
import java.sql.SQLException;

@Service
public class AuthService {

    private final UserDao userDao;

    public AuthService(UserDao userDao) {
        this.userDao = userDao;
    }

    public User register(RegisterRequest request) throws SQLException {
        if (userDao.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = userDao.createUser(request);
        user.setPassword(null);
        return user;
    }

    public OtpSessionResponse requestRegistrationOtp(RegisterRequest request) throws SQLException {
        User existingUser = userDao.findByEmail(request.getEmail()).orElse(null);
        if (existingUser != null && Boolean.TRUE.equals(existingUser.getVerified())) {
            throw new IllegalArgumentException("Email already registered. Please sign in.");
        }
        String otp = generateOtp();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);
        userDao.saveRegistrationOtp(request, otp, expiry);
        return new OtpSessionResponse(request.getEmail(), otp, "5 minutes", "REGISTER");
    }

    public User verifyRegistrationOtp(OtpVerificationRequest request) throws SQLException {
        User user = validateOtp(request);
        userDao.updateVerification(user.getId(), true);
        userDao.clearOtp(user.getId());
        User verifiedUser = userDao.findById(user.getId()).orElseThrow(() -> new IllegalArgumentException("User not found"));
        verifiedUser.setPassword(null);
        return verifiedUser;
    }

    public OtpSessionResponse requestLoginOtp(LoginRequest request) throws SQLException {
        User user = userDao.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        if (!Boolean.TRUE.equals(user.getVerified())) {
            throw new IllegalArgumentException("Please verify your account before login");
        }
        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        String otp = generateOtp();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);
        userDao.storeLoginOtp(request.getEmail(), otp, expiry);
        return new OtpSessionResponse(request.getEmail(), otp, "5 minutes", "LOGIN");
    }

    public User verifyLoginOtp(OtpVerificationRequest request) throws SQLException {
        User user = validateOtp(request);
        if (!Boolean.TRUE.equals(user.getVerified())) {
            throw new IllegalArgumentException("Account verification is pending");
        }
        userDao.clearOtp(user.getId());
        user.setPassword(null);
        return user;
    }

    public User login(LoginRequest request) throws SQLException {
        User user = userDao.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        if (!Boolean.TRUE.equals(user.getVerified())) {
            throw new IllegalArgumentException("Please verify your account before login");
        }
        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        user.setPassword(null);
        return user;
    }

    private User validateOtp(OtpVerificationRequest request) throws SQLException {
        User user = userDao.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));
        if (user.getOtpCode() == null || !user.getOtpCode().equals(request.getOtp())) {
            throw new IllegalArgumentException("Invalid OTP");
        }
        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP expired. Please request a new one.");
        }
        return user;
    }

    private String generateOtp() {
        return String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
    }
}
