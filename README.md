# 🍽️ FoodieHub – Online Food Ordering System

**FoodieHub** is a modern, responsive, commercial-grade full-stack online food ordering application built with the **MERN Stack** (MongoDB, Express.js, React.js with Vite, and Node.js). Designed with a clean, minimal UI, smooth animations, and a rich user experience, it allows customers to browse culinary categories, configure dishes, manage their cart with persistent state, apply coupon discounts, place orders with simulated or cash payments, and track live status. It also features a dedicated, password-protected **Admin Dashboard** for menu, category, and order lifecycle management.

---

## 🚀 Key Features

### 👤 Customer Experience
* **Dynamic Home Page:** Hero banner, interactive category chips, promotional coupon showcase (`FOODIE30`), chef specials, bestsellers, and benefits.
* **Smart Menu & Search:** Real-time search by dish or ingredient, category filters (*Biryani, Pizza, Burgers, Indian Meals, Desserts, Beverages*), pure veg / non-veg dietary filters, and sorting by price or rating.
* **Dish Details Page:** High-definition photography, spicy/veg tags, preparation duration, ingredients breakdown, quantity selector, and related category dishes.
* **Persistent Cart (React Context API + LocalStorage):** Retains selected dishes on page refresh. Interactive quantity modifiers (`+` and `-`), instant item removal, and auto-delivery fee calculations (free above ₹500).
* **Promo Code Engine:** Apply coupon `FOODIE30` for 30% discount capped at ₹150 with live feedback.
* **Seamless Checkout:** Delivery address validation, customer phone, cooking notes, and payment mode choice (*Cash on Delivery* or *Simulated Online Payment*).
* **Live Order Tracking Stepper:** Visual status progression tracker (*Placed → Confirmed → Kitchen Preparing → On The Way → Delivered*).
* **User Authentication:** Secure JWT-based registration and login with bcryptjs password hashing.

### 🛡️ Admin Dashboard (`/admin`)
* **Executive Metrics Overview:** Total orders, total revenue, active customers, total food items, and status breakdown.
* **Manage Food (Full CRUD):** Add dishes, modify prices, update descriptions, attach image URLs, toggle pure veg/non-veg, and switch real-time in-stock availability.
* **Manage Categories:** Add and inspect food categories with dish counters.
* **Manage Orders:** Live order status dropdowns (*Placed, Confirmed, Preparing, Out for Delivery, Delivered, Cancelled*) with instant database synchronization and detailed invoice inspector.
* **Manage Users:** View customer accounts, contact details, registration timestamps, and order history counts.

### 🔒 Security & Data Integrity
* **Server-Side Price Recalculation:** The backend independently fetches current item prices from MongoDB when creating orders—**client-side prices or totals are never trusted**.
* **Role-Based Access Control:** Dual-layer route protection on both frontend (`AdminRoute`) and backend (`protect` + `admin` middlewares).
* **Zero-Setup Database Fallback:** Automatic detection of local MongoDB; if no local MongoDB service is running, it launches an embedded in-memory MongoDB instance with pre-seeded dishes automatically!

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router 6, Axios, Lucide React, Context API, Vanilla CSS |
| **Backend** | Node.js, Express.js, Mongoose, JWT (`jsonwebtoken`), bcryptjs, CORS, Dotenv |
| **Database** | MongoDB (Local Daemon, MongoDB Atlas, or Built-in Zero-Setup In-Memory Fallback) |

---

## 📂 Project Structure

```
FoodieHub/
├── backend/
│   ├── config/
│   │   ├── db.js                # MongoDB connection with automatic fallback
│   │   └── seedData.js          # 18+ dishes, categories, admin & customer seed data
│   ├── controllers/
│   │   ├── categoryController.js
│   │   ├── foodController.js
│   │   ├── orderController.js   # Server-side order total calculation
│   │   └── userController.js    # Auth & JWT issuance
│   ├── middleware/
│   │   ├── authMiddleware.js    # Protect & admin authorization
│   │   └── errorMiddleware.js   # Centralized error handlers
│   ├── models/
│   │   ├── Category.js
│   │   ├── Food.js
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes/
│   │   ├── categoryRoutes.js
│   │   ├── foodRoutes.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   ├── .env.example
│   ├── .env
│   ├── server.js                # Express app entrypoint & auto-seeder
│   └── test-api.js              # Integration test suite
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── CategoryBar.jsx
│   │   │   ├── FoodCard.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── OrderStatusTracker.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RatingStars.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx  # LocalStorage-backed cart state
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminCategories.jsx
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminFoods.jsx
│   │   │   │   ├── AdminLayout.jsx
│   │   │   │   ├── AdminOrders.jsx
│   │   │   │   └── AdminUsers.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── FoodDetails.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js           # Axios instance & token interceptors
│   │   ├── App.jsx              # Router configuration
│   │   ├── index.css            # Complete design system
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
└── package.json                 # Convenient root scripts
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** (v9 or higher)

### 2. Install Dependencies
Run the following from the root directory:
```bash
# Install both backend and frontend dependencies in one command:
npm run install:all
```
*(Or navigate to `backend` and `frontend` separately and run `npm install`)*

---

### 3. Environment Configuration
The backend comes pre-configured with a `.env` file. You can adjust it or review `.env.example`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/foodiehub
JWT_SECRET=foodiehub_super_secret_jwt_key_2025_safe_token
```
> **Note on MongoDB:** If you have MongoDB installed locally or use a MongoDB Atlas connection string, provide it in `MONGO_URI`. If no local MongoDB is detected, the server automatically starts an embedded in-memory MongoDB instance with pre-seeded data—**no installation required to run!**

---

### 4. Seed Sample Data (Optional)
The database auto-populates on first server start if empty, but you can also manually seed anytime:
```bash
npm run seed
```

---

### 5. Start the Application

#### Start the Backend Server:
```bash
# In a terminal:
npm run dev:backend
# Or: cd backend && npm run dev
```
Backend will be live on: `http://localhost:5000`

#### Start the Frontend App:
```bash
# In a separate terminal:
npm run dev:frontend
# Or: cd frontend && npm run dev
```
Frontend will be live on: `http://localhost:5173`

Open `http://localhost:5173` in your browser.

---

## 🔑 Demo Credentials

For quick evaluation, pre-configured accounts are provided on the Login page with one-click autofill:

| Account Type | Email | Password | Role | Access |
|---|---|---|---|---|
| **Administrator** | `admin@foodiehub.com` | `admin123` | `admin` | Full Store + Admin Dashboard (`/admin`) |
| **Customer** | `customer@foodiehub.com` | `customer123` | `customer` | Storefront, Cart, Checkout, Order History |

---

## 🧪 Running Automated Tests

To run the backend integration test suite:
```bash
npm test
```
This tests:
1. Food fetching & filtering
2. Category listings
3. Customer JWT login
4. Admin JWT login & role validation
5. Order placement with server-side price recalculation & coupon deductions
6. Customer order history fetching
7. Admin metrics overview
8. Admin order status updating

---

## 📡 REST API Reference

### Food APIs
* `GET /api/foods` - Fetch all foods (supports `?category=`, `?search=`, `?sort=`, `?featured=true`, `?bestSeller=true`)
* `GET /api/foods/:id` - Fetch single food details
* `POST /api/foods` - Add new food *(Admin only)*
* `PUT /api/foods/:id` - Update food details / stock *(Admin only)*
* `DELETE /api/foods/:id` - Delete food *(Admin only)*

### Category APIs
* `GET /api/categories` - Fetch all categories with dish count
* `POST /api/categories` - Create new category *(Admin only)*
* `DELETE /api/categories/:id` - Remove category *(Admin only)*

### Auth APIs
* `POST /api/users/register` - Create new user account & return JWT
* `POST /api/users/login` - Authenticate user & return JWT
* `GET /api/users/profile` - Get logged-in user profile *(Private)*
* `GET /api/users` - Get all users with total order counts *(Admin only)*

### Order APIs
* `POST /api/orders` - Place new order (Server recalculates prices and totals) *(Private)*
* `GET /api/orders/myorders` - Get current customer's order history *(Private)*
* `GET /api/orders/:id` - Get specific order details *(Private)*
* `GET /api/orders` - Get all customer orders *(Admin only)*
* `PUT /api/orders/:id/status` - Update order status *(Admin only)*
* `GET /api/orders/admin/stats` - Get dashboard statistics *(Admin only)*

---

## 🎨 UI/UX Design System Highlights

* **Primary Palette:** `#FF6B35` (Foodie Orange), `#FFFFFF` (Card/Page White), `#222222` (High-contrast typography)
* **Secondary Accents:** `#FFF2EC` (Warm light peach), `#10B981` (Fresh emerald green for veg & completed orders)
* **Visual Polish:** Soft multi-layer shadows (`0 4px 20px rgba(0,0,0,0.06)`), 18px rounded food cards, floating order pills, and responsive layout across desktop, tablet, and mobile devices.

---

## 📄 License
This project is open-source and intended for academic demonstration and modern MERN stack development learning.

