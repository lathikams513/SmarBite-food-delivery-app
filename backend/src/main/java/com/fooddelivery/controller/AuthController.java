package com.fooddelivery.controller;

import com.fooddelivery.model.LoginRequest;
import com.fooddelivery.model.OtpVerificationRequest;
import com.fooddelivery.model.RegisterRequest;
import com.fooddelivery.service.AuthService;
import com.fooddelivery.util.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;

@RestController
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ApiResponse<Object> register(@Valid @RequestBody RegisterRequest request) throws SQLException {
        return new ApiResponse<>(true, "User registered successfully", authService.register(request));
    }

    @PostMapping("/register/request-otp")
    public ApiResponse<Object> requestRegisterOtp(@Valid @RequestBody RegisterRequest request) throws SQLException {
        return new ApiResponse<>(true, "OTP sent for registration", authService.requestRegistrationOtp(request));
    }

    @PostMapping("/register/verify-otp")
    public ApiResponse<Object> verifyRegisterOtp(@Valid @RequestBody OtpVerificationRequest request) throws SQLException {
        return new ApiResponse<>(true, "Registration verified successfully", authService.verifyRegistrationOtp(request));
    }

    @PostMapping("/login")
    public ApiResponse<Object> login(@Valid @RequestBody LoginRequest request) throws SQLException {
        return new ApiResponse<>(true, "Login successful", authService.login(request));
    }

    @PostMapping("/login/request-otp")
    public ApiResponse<Object> requestLoginOtp(@Valid @RequestBody LoginRequest request) throws SQLException {
        return new ApiResponse<>(true, "OTP sent for login", authService.requestLoginOtp(request));
    }

    @PostMapping("/login/verify-otp")
    public ApiResponse<Object> verifyLoginOtp(@Valid @RequestBody OtpVerificationRequest request) throws SQLException {
        return new ApiResponse<>(true, "Login verified successfully", authService.verifyLoginOtp(request));
    }
}
