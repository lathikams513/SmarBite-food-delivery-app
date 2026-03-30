package com.fooddelivery.controller;

import com.fooddelivery.service.RestaurantService;
import com.fooddelivery.util.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;

@RestController
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping("/restaurants")
    public ApiResponse<Object> getRestaurants() throws SQLException {
        return new ApiResponse<>(true, "Restaurants fetched successfully", restaurantService.getRestaurants());
    }
}
