package com.fooddelivery.controller;

import com.fooddelivery.service.RecommendationService;
import com.fooddelivery.util.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;

@RestController
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/recommend/{userId}")
    public ApiResponse<Object> getRecommendations(@PathVariable Long userId) throws SQLException {
        return new ApiResponse<>(true, "Recommendations fetched", recommendationService.getRecommendations(userId));
    }
}
