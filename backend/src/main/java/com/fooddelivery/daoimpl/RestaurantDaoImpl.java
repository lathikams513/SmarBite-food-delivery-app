package com.fooddelivery.daoimpl;

import com.fooddelivery.dao.RestaurantDao;
import com.fooddelivery.model.Restaurant;
import com.fooddelivery.util.DatabaseUtil;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class RestaurantDaoImpl implements RestaurantDao {

    @Override
    public List<Restaurant> findAll() throws SQLException {
        String sql = "SELECT * FROM restaurant ORDER BY rating DESC, name ASC";
        List<Restaurant> restaurants = new ArrayList<>();
        try (Connection connection = DatabaseUtil.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                restaurants.add(new Restaurant(
                        resultSet.getLong("id"),
                        resultSet.getString("name"),
                        resultSet.getString("cuisine"),
                        resultSet.getDouble("rating"),
                        resultSet.getInt("eta_minutes"),
                        resultSet.getString("image_url"),
                        resultSet.getString("hero_image_url"),
                        resultSet.getString("location"),
                        resultSet.getString("description"),
                        resultSet.getString("offer_text"),
                        resultSet.getBigDecimal("delivery_fee"),
                        resultSet.getString("tags"),
                        resultSet.getInt("price_for_two"),
                        resultSet.getBoolean("promoted"),
                        resultSet.getString("discount_text")
                ));
            }
        }
        return restaurants;
    }
}
