package com.fooddelivery.dao;

import com.fooddelivery.model.Restaurant;

import java.sql.SQLException;
import java.util.List;

public interface RestaurantDao {
    List<Restaurant> findAll() throws SQLException;
}
