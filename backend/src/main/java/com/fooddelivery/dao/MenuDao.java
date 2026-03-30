package com.fooddelivery.dao;

import com.fooddelivery.model.MenuItem;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public interface MenuDao {
    List<MenuItem> findByRestaurantId(Long restaurantId) throws SQLException;
    Optional<MenuItem> findById(Long id) throws SQLException;
}
