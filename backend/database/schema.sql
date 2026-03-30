CREATE DATABASE IF NOT EXISTS food_delivery_db;
USE food_delivery_db;

DROP TABLE IF EXISTS order_item;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS user_history;
DROP TABLE IF EXISTS group_order_item;
DROP TABLE IF EXISTS group_order_member;
DROP TABLE IF EXISTS group_order;
DROP TABLE IF EXISTS menu;
DROP TABLE IF EXISTS restaurant;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(120) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    otp_code VARCHAR(10),
    otp_expiry TIMESTAMP NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurant (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    cuisine VARCHAR(120) NOT NULL,
    rating DECIMAL(2,1) DEFAULT 4.0,
    eta_minutes INT DEFAULT 30,
    image_url VARCHAR(255),
    hero_image_url VARCHAR(255),
    location VARCHAR(150),
    description VARCHAR(255),
    offer_text VARCHAR(120),
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    tags VARCHAR(255),
    price_for_two INT DEFAULT 300,
    promoted BOOLEAN DEFAULT FALSE,
    discount_text VARCHAR(120)
);

CREATE TABLE menu (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id BIGINT NOT NULL,
    name VARCHAR(120) NOT NULL,
    description VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    calories INT NOT NULL,
    category VARCHAR(80),
    is_veg BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(255),
    prep_time_minutes INT DEFAULT 20,
    is_bestseller BOOLEAN DEFAULT FALSE,
    item_tag VARCHAR(80),
    discount_percent INT DEFAULT 0,
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(id)
);

CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(40) DEFAULT 'Placed',
    delivery_address VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    group_order_id BIGINT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(id)
);

CREATE TABLE order_item (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menu(id)
);

CREATE TABLE user_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    frequency INT DEFAULT 1,
    last_ordered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_menu (user_id, menu_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menu(id) ON DELETE CASCADE
);

CREATE TABLE group_order (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    group_code VARCHAR(30) NOT NULL UNIQUE,
    created_by BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,
    status VARCHAR(40) DEFAULT 'OPEN',
    total_amount DECIMAL(10,2) DEFAULT 0,
    participant_count INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(id)
);

CREATE TABLE group_order_member (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    group_order_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    custom_amount DECIMAL(10,2) NULL,
    UNIQUE KEY unique_group_member (group_order_id, user_id),
    FOREIGN KEY (group_order_id) REFERENCES group_order(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE group_order_item (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    group_order_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    UNIQUE KEY unique_group_menu (group_order_id, menu_id),
    FOREIGN KEY (group_order_id) REFERENCES group_order(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menu(id) ON DELETE CASCADE
);

INSERT INTO restaurant (name, cuisine, rating, eta_minutes, image_url, hero_image_url, location, description, offer_text, delivery_fee, tags, price_for_two, promoted, discount_text) VALUES
('Swad Express', 'Biryani, North Indian', 4.7, 24, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', 'Chennai', 'Dum biryanis, kebabs, and rich curries inspired by premium delivery kitchens.', '50% OFF up to Rs.120', 25, 'Bestseller,Fast Delivery,Top Rated', 350, TRUE, 'Flat Rs.125 OFF'),
('Burger Mile', 'Burgers, American, Fast Food', 4.5, 18, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', 'https://images.unsplash.com/photo-1550547660-d9450f859349', 'Coimbatore', 'Loaded burgers, fries, wings, and shakes in a late-night comfort format.', 'Buy 1 Get 1 on Burgers', 19, 'Late Night,Fast Delivery,Snacks', 280, TRUE, 'Free fries above Rs.249'),
('Chowringhee Wok', 'Chinese, Asian, Noodles', 4.4, 26, 'https://images.unsplash.com/photo-1512058564366-18510be2db19', 'https://images.unsplash.com/photo-1512058564366-18510be2db19', 'Bengaluru', 'Street-style noodles, fried rice, dimsums, and spicy wok tosses.', 'Extra 20% OFF', 30, 'Spicy,Combo Deals,Top Rated', 320, FALSE, 'Combo festival'),
('Pizza District', 'Italian, Pizza, Pasta', 4.6, 30, 'https://images.unsplash.com/photo-1513104890138-7c749659a591', 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143', 'Hyderabad', 'Wood-fired pizzas, creamy pastas, and garlic sides with cafe-style plating.', 'Free dessert on orders above Rs.399', 35, 'Cheesy,Bestseller,Family Meals', 420, TRUE, 'Dessert combo'),
('Healthy Bowl Co.', 'Healthy, Salads, Bowls', 4.3, 21, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', 'Pune', 'Protein bowls, salads, smoothies, and calorie-counted wholesome meals.', '15% OFF on protein meals', 20, 'Healthy,Calorie Smart,Gym Picks', 360, FALSE, 'High protein combo'),
('Madras Tiffin Hub', 'South Indian, Breakfast', 4.8, 20, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc', 'Chennai', 'Iconic dosas, pongal, idli platters, and filter coffee combos.', 'Flat Rs.75 OFF', 15, 'Breakfast,Classic,Value Meals', 220, TRUE, 'Morning special');

INSERT INTO menu (restaurant_id, name, description, price, calories, category, is_veg, image_url, prep_time_minutes, is_bestseller, item_tag, discount_percent) VALUES
(1, 'Paneer Dum Biryani', 'Long grain basmati layered with saffron, paneer tikka, and dum spices.', 219, 560, 'Biryani', TRUE, 'https://images.unsplash.com/photo-1701579231371-f22131414e58', 24, TRUE, 'Bestseller', 20),
(1, 'Hyderabadi Chicken Biryani', 'Classic spicy chicken biryani with raita and salan.', 249, 690, 'Biryani', FALSE, 'https://images.unsplash.com/photo-1633945274309-2c16c9682a8b', 26, TRUE, 'Chef Special', 15),
(1, 'Tandoori Chicken Combo', 'Half tandoori chicken, rumali roti, onion salad, and mint dip.', 299, 610, 'Combos', FALSE, 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f', 22, FALSE, 'Combo', 10),
(1, 'Butter Naan', 'Soft butter naan finished in a clay oven.', 49, 170, 'Breads', TRUE, 'https://images.unsplash.com/photo-1601050690597-df0568f70950', 12, FALSE, 'Add-on', 0),
(1, 'Gulab Jamun Duo', 'Two soft gulab jamuns with warm syrup.', 89, 280, 'Desserts', TRUE, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7', 8, FALSE, 'Sweet Tooth', 0),

(2, 'Smash Classic Burger', 'Double patty burger with cheese, onion jam, and house sauce.', 189, 640, 'Burgers', FALSE, 'https://images.unsplash.com/photo-1550547660-d9450f859349', 18, TRUE, 'Bestseller', 25),
(2, 'Crispy Veg Burger', 'Crunchy veg patty burger with peri-peri mayo.', 149, 490, 'Burgers', TRUE, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', 15, FALSE, 'Value Pick', 20),
(2, 'Loaded Fries Bucket', 'Cheesy loaded fries with jalapenos and chipotle drizzle.', 159, 530, 'Snacks', TRUE, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877', 14, TRUE, 'Shareable', 10),
(2, 'Hot Wings 6 Pc', 'Crispy spicy wings served with ranch dip.', 219, 470, 'Snacks', FALSE, 'https://images.unsplash.com/photo-1562967914-608f82629710', 18, FALSE, 'Spicy', 0),
(2, 'Choco Thick Shake', 'Chocolate shake finished with brownie crumbs.', 129, 360, 'Beverages', TRUE, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699', 8, FALSE, 'Coolers', 0),

(3, 'Schezwan Noodles', 'Fiery wok-tossed noodles with vegetables and chili oil.', 179, 520, 'Noodles', TRUE, 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841', 16, TRUE, 'Spicy', 15),
(3, 'Chicken Hakka Noodles', 'Street-style Hakka noodles with chicken strips and scallions.', 209, 610, 'Noodles', FALSE, 'https://images.unsplash.com/photo-1512058564366-18510be2db19', 17, TRUE, 'Bestseller', 15),
(3, 'Veg Fried Rice', 'Wok-fried jasmine rice with vegetables and soy glaze.', 169, 480, 'Rice', TRUE, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b', 15, FALSE, 'Value Pick', 10),
(3, 'Chicken Manchurian', 'Crispy fried chicken in Indo-Chinese Manchurian sauce.', 239, 540, 'Starters', FALSE, 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7', 18, FALSE, 'Party Starter', 0),
(3, 'Veg Momos 8 Pc', 'Steamed momos served with red chili chutney.', 139, 260, 'Dimsums', TRUE, 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41', 12, FALSE, 'Lite Bite', 0),

(4, 'Margherita Pizza', 'Classic tomato, mozzarella, and basil wood-fired pizza.', 229, 650, 'Pizza', TRUE, 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143', 20, TRUE, 'Bestseller', 20),
(4, 'Farmhouse Pizza', 'Onion, capsicum, tomato, mushroom, and mozzarella.', 289, 740, 'Pizza', TRUE, 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e', 22, FALSE, 'Veg Feast', 15),
(4, 'Pepperoni Pizza', 'Loaded pepperoni with melting mozzarella and herbs.', 329, 790, 'Pizza', FALSE, 'https://images.unsplash.com/photo-1628840042765-356cda07504e', 22, TRUE, 'Meat Lovers', 15),
(4, 'Creamy Alfredo Pasta', 'White sauce penne with herbs and parmesan.', 219, 580, 'Pasta', TRUE, 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9', 18, FALSE, 'Comfort Bowl', 10),
(4, 'Garlic Breadsticks', 'Toasted garlic breadsticks with cheese dip.', 129, 310, 'Sides', TRUE, 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c', 10, FALSE, 'Add-on', 0),

(5, 'Mediterranean Power Bowl', 'Brown rice, hummus, paneer, greens, and olive dressing.', 249, 430, 'Bowls', TRUE, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', 14, TRUE, 'High Protein', 15),
(5, 'Chicken Quinoa Bowl', 'Grilled chicken, quinoa, avocado, and roasted veggies.', 279, 510, 'Bowls', FALSE, 'https://images.unsplash.com/photo-1546793665-c74683f339c1', 16, TRUE, 'Gym Pick', 15),
(5, 'Greek Salad', 'Crunchy vegetables, feta, olives, and lemon dressing.', 189, 290, 'Salads', TRUE, 'https://images.unsplash.com/photo-1540420773420-3366772f4999', 10, FALSE, 'Calorie Smart', 10),
(5, 'Avocado Toast', 'Sourdough toast with smashed avocado and chili flakes.', 159, 280, 'Breakfast', TRUE, 'https://images.unsplash.com/photo-1525351484163-7529414344d8', 9, FALSE, 'Lite Bite', 0),
(5, 'Berry Protein Smoothie', 'Mixed berries, banana, oats, and whey protein blend.', 149, 240, 'Beverages', TRUE, 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc', 6, FALSE, 'Fitness', 0),

(6, 'Masala Dosa', 'Golden dosa with potato masala, chutneys, and sambar.', 99, 320, 'Dosa', TRUE, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976', 12, TRUE, 'Classic', 10),
(6, 'Ghee Pongal', 'Creamy pongal with pepper, cumin, and ghee tempering.', 119, 340, 'Breakfast', TRUE, 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e3', 10, FALSE, 'Comfort', 0),
(6, 'Mini Idli Sambar', 'Soft mini idlis soaked in hot sambar.', 89, 210, 'Breakfast', TRUE, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc', 10, FALSE, 'Lite Bite', 0),
(6, 'Podi Idli', 'Idlis tossed in gunpowder spice and sesame oil.', 109, 260, 'Breakfast', TRUE, 'https://images.unsplash.com/photo-1630383249896-424e482df921', 10, FALSE, 'Spicy', 0),
(6, 'Filter Coffee', 'Traditional South Indian filter coffee.', 59, 120, 'Beverages', TRUE, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93', 5, FALSE, 'Must Try', 0);
