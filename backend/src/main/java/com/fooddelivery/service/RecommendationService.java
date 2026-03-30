package com.fooddelivery.service;

import com.fooddelivery.dao.UserDao;
import com.fooddelivery.model.MenuItem;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;

@Service
public class RecommendationService {

    private final UserDao userDao;

    public RecommendationService(UserDao userDao) {
        this.userDao = userDao;
    }

    public List<MenuItem> getRecommendations(Long userId) throws SQLException {
        return userDao.getTopRecommendations(userId, 5);
    }
}
