package com.fooddelivery.service;

import com.fooddelivery.dao.RestaurantDao;
import com.fooddelivery.model.Restaurant;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;

@Service
public class RestaurantService {

    private final RestaurantDao restaurantDao;

    public RestaurantService(RestaurantDao restaurantDao) {
        this.restaurantDao = restaurantDao;
    }

    public List<Restaurant> getRestaurants() throws SQLException {
        return restaurantDao.findAll();
    }
}
