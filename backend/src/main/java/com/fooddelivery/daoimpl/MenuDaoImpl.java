package com.fooddelivery.daoimpl;

import com.fooddelivery.dao.MenuDao;
import com.fooddelivery.model.MenuItem;
import com.fooddelivery.util.DatabaseUtil;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class MenuDaoImpl implements MenuDao {

    @Override
    public List<MenuItem> findByRestaurantId(Long restaurantId) throws SQLException {
        String sql = "SELECT * FROM menu WHERE restaurant_id = ? ORDER BY category, price ASC";
        List<MenuItem> items = new ArrayList<>();
        try (Connection connection = DatabaseUtil.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, restaurantId);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    items.add(mapItem(resultSet));
                }
            }
        }
        return items;
    }

    @Override
    public Optional<MenuItem> findById(Long id) throws SQLException {
        String sql = "SELECT * FROM menu WHERE id = ?";
        try (Connection connection = DatabaseUtil.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next() ? Optional.of(mapItem(resultSet)) : Optional.empty();
            }
        }
    }

    private MenuItem mapItem(ResultSet resultSet) throws SQLException {
        return new MenuItem(
                resultSet.getLong("id"),
                resultSet.getLong("restaurant_id"),
                resultSet.getString("name"),
                resultSet.getString("description"),
                resultSet.getBigDecimal("price"),
                resultSet.getInt("calories"),
                resultSet.getString("category"),
                resultSet.getBoolean("is_veg"),
                resultSet.getString("image_url"),
                resultSet.getInt("prep_time_minutes"),
                resultSet.getBoolean("is_bestseller"),
                resultSet.getString("item_tag"),
                resultSet.getInt("discount_percent")
        );
    }
}
