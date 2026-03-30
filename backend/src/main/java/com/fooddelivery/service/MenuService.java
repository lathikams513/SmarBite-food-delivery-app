package com.fooddelivery.service;

import com.fooddelivery.dao.MenuDao;
import com.fooddelivery.model.BudgetRequest;
import com.fooddelivery.model.BudgetSuggestion;
import com.fooddelivery.model.MenuItem;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class MenuService {

    private final MenuDao menuDao;

    public MenuService(MenuDao menuDao) {
        this.menuDao = menuDao;
    }

    public List<MenuItem> getMenuByRestaurant(Long restaurantId) throws SQLException {
        return menuDao.findByRestaurantId(restaurantId);
    }

    public MenuItem getMenuItem(Long menuId) throws SQLException {
        return menuDao.findById(menuId)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found"));
    }

    public BudgetSuggestion getBudgetSuggestion(BudgetRequest request) throws SQLException {
        List<MenuItem> menuItems = new ArrayList<>(menuDao.findByRestaurantId(request.getRestaurantId()));
        menuItems.sort(Comparator.comparing(MenuItem::getPrice));

        List<MenuItem> selectedItems = new ArrayList<>();
        BigDecimal runningTotal = BigDecimal.ZERO;

        // Greedy selection gives a simple interview-friendly combination strategy.
        for (MenuItem item : menuItems) {
            if (runningTotal.add(item.getPrice()).compareTo(request.getBudget()) <= 0) {
                selectedItems.add(item);
                runningTotal = runningTotal.add(item.getPrice());
            }
        }

        return new BudgetSuggestion(request.getBudget(), runningTotal, selectedItems);
    }
}
