package com.fooddelivery.util;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Component
public class DatabaseUtil {

    private static String url;
    private static String username;
    private static String password;
    private static String driver;

    @Value("${db.url}")
    private String configuredUrl;

    @Value("${db.username}")
    private String configuredUsername;

    @Value("${db.password}")
    private String configuredPassword;

    @Value("${db.driver}")
    private String configuredDriver;

    @PostConstruct
    public void init() {
        url = configuredUrl;
        username = configuredUsername;
        password = configuredPassword;
        driver = configuredDriver;
    }

    public static Connection getConnection() throws SQLException {
        try {
            Class.forName(driver);
            return DriverManager.getConnection(url, username, password);
        } catch (ClassNotFoundException exception) {
            throw new SQLException("Unable to load database driver", exception);
        }
    }
}
