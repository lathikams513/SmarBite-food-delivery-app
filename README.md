# SmartBite Food Delivery

SmartBite is a full stack food delivery web application built with React, Tailwind CSS, Spring Boot, JDBC, and MySQL. It includes core delivery flows plus interview-ready smart features such as OTP-verified auth, personalized recommendations, budget mode, group ordering, live order status, and nutrition-aware menus in a Swiggy-style UI.

## Tech Stack

- Frontend: React, React Router, Axios, Tailwind CSS, Vite
- Backend: Spring Boot, JDBC, layered architecture
- Database: MySQL

## Smart Features

- OTP verification for login and registration
- Smart recommendation system based on `user_history`
- Budget mode that suggests menu combinations within a given budget
- Group ordering with generated group code and bill split
- Live order status workflow: `Placed -> Preparing -> Out for Delivery -> Delivered`
- Nutrition info with calories on each menu item
- Rich restaurant cards with offer text, delivery fee, and promoted badges

## Folder Structure

```text
backend/
  database/
  src/main/java/com/fooddelivery/
    config/
    controller/
    dao/
    daoimpl/
    model/
    service/
    util/
  src/main/resources/
frontend/
  public/
  src/
    components/
    pages/
    services/
    styles/
```

## Database Setup

1. Create a MySQL database or simply run the schema script.
2. Execute [backend/database/schema.sql](C:/Users/lathi/OneDrive/Documents/New%20project/backend/database/schema.sql).
3. The script recreates tables and seeds richer restaurant and menu data, so rerun it whenever you want a fresh demo database.
4. Update database credentials in [backend/src/main/resources/application.properties](C:/Users/lathi/OneDrive/Documents/New%20project/backend/src/main/resources/application.properties).

Default local config:

```properties
db.url=jdbc:mysql://localhost:3306/food_delivery_db
db.username=root
db.password=root
```

## Backend Run Steps

1. Install Java 17+ and Maven.
2. Open a terminal in `backend`.
3. Run:

```bash
mvn spring-boot:run
```

Backend starts on `http://localhost:8080`.

## Frontend Run Steps

1. Install Node.js 18+.
2. Open a terminal in `frontend`.
3. Run:

```bash
npm install
npm run dev
```

Frontend starts on `http://localhost:5173`.

## Main REST APIs

- `POST /register`
- `POST /register/request-otp`
- `POST /register/verify-otp`
- `POST /login`
- `POST /login/request-otp`
- `POST /login/verify-otp`
- `GET /restaurants`
- `GET /menu/{restaurantId}`
- `POST /cart/add`
- `POST /order/place`
- `GET /orders/{userId}`
- `GET /recommend/{userId}`
- `POST /budget`
- `POST /group/create`
- `POST /group/join`
- `PUT /order/status`

## Notes

- Cart state is maintained in the React client and persisted in local storage.
- JDBC uses `PreparedStatement` throughout DAO implementations.
- The backend returns consistent JSON using `ApiResponse`.
- Remote demo images are used so the UI looks polished immediately.
- OTP is exposed as a demo hint in API responses so the flow can be tested without SMS/email integration.

## Suggested Demo Flow

1. Register a user.
2. Browse restaurants and open a menu.
3. Use budget mode to generate a low-cost combo.
4. Add items to cart and place an order.
5. Open order history and view live status stages.
6. Create a group order and join it with another user ID.
7. Place more orders, then revisit the homepage to see recommendations.
