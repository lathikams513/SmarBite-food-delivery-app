package com.fooddelivery.controller;

import com.fooddelivery.model.BudgetRequest;
import com.fooddelivery.service.MenuService;
import com.fooddelivery.util.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;

@RestController
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping("/menu/{restaurantId}")
    public ApiResponse<Object> getMenu(@PathVariable Long restaurantId) throws SQLException {
        return new ApiResponse<>(true, "Menu fetched successfully", menuService.getMenuByRestaurant(restaurantId));
    }

    @PostMapping("/budget")
    public ApiResponse<Object> getBudgetSuggestion(@Valid @RequestBody BudgetRequest request) throws SQLException {
        return new ApiResponse<>(true, "Budget suggestions fetched", menuService.getBudgetSuggestion(request));
    }
}
