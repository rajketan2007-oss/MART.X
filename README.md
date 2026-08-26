# Extrad - Modern MERN Stack E-Commerce Platform

**Extrad** is a full-stack e-commerce marketplace styled after Myntra, Flipkart, and Amazon, built with Node.js, Express.js, MongoDB (with automatic zero-config in-memory fallback), and React (Vite + Tailwind CSS).

---

## 🌟 Features Overview

### 🛍️ Shopper Experience
- **Sticky Myntra-Style Navbar**: Brand wordmark logo, uppercase categories (`MEN`, `WOMEN`, `KIDS`, `HOME`, `BEAUTY`, `GENZ`, `STUDIO`), debounced autosuggest search dropdown, wishlist count badge, and bag count badge.
- **Top Promo Strip & Coupon Drawer**: Dismissible top banner with instant coupon popup modal and floating side tab (`UPTO ₹300 OFF`) with copy-and-apply coupons (`EXTRAD300`, `WELCOME100`, `FASHION20`).
- **Hero Carousel Banner**: Auto-rotating promotional banners with brand spotlights (e.g. U.S. POLO ASSN. style).
- **6-Column Category Grid**: Handbags, Headphones & Speakers, Home Decor, Jewellery, Size-Inclusive Styles, Watches & Wearables, Sleepwear, Workwear, Eyewear, Casual Styles.
- **Product Catalog & Live Filters**: Sidebar filtering by price range slider, brand checkboxes, sizes, colors, minimum discount %, customer ratings, and gender; with instant URL sync and sorting options (Newest, Popularity, Price Low-High, Price High-Low, Discount %, Rating).
- **Product Details Page**: Interactive thumbnail gallery with zoom preview, size/color selector, stock indicator, pincode delivery checker (e.g. 560001), working **Add to Bag**, **Add to Wishlist**, **Buy Now**, customer reviews list & review submission form with star ratings, and similar products carousel.
- **Shopping Bag & Coupons**: Itemized list with live quantity steppers (+/-), remove item, move to wishlist, coupon validation engine, and price breakdown (MRP, product discount, coupon discount, free delivery indicator).
- **3-Step Checkout Flow**:
  1. Delivery Address Selection & Saved Address CRUD
  2. Payment Gateway Selection (Card, Razorpay Simulator, UPI, Cash on Delivery)
  3. Order Review & Order Creation with live tracking timeline stepper (Placed → Processing → Shipped → Delivered).
- **Account & Order History**: User profile editor, address book manager, and order tracking timeline.

### 🛡️ Admin Portal (`/admin/dashboard`)
- **Real-Time Analytics**: Dashboard with revenue metrics, order counts, product counts, registered user counts, and order status breakdown.
- **Product Management**: Create, edit, and delete products with image preview and inventory stock updater.
- **Order Management**: Update customer order fulfillment statuses (Placed, Processing, Shipped, Delivered, Cancelled).
- **User Management**: View registered users and block/remove user accounts.
- **Coupon Generator**: Create new promo discount codes with minimum order thresholds.

---

## 🔑 Demo Credentials (Seed Accounts)

| Account Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Demo Shopper** | `user@extrad.com` | `user123` | User |
| **Administrator** | `admin@extrad.com` | `admin123` | Admin |

> *Tip: The Login page includes 1-Click Demo Login buttons for instant access!*

---

## 🛠️ Project Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Backend Setup (`server`)
```bash
cd server
npm install
npm run seed  # Populates sample products, categories, coupons, and test accounts
npm start     # Starts backend API server on http://localhost:5000
```

> *Note: If a local MongoDB server is not running, the server automatically initializes an in-memory MongoDB instance (`mongodb-memory-server`) so it runs immediately out-of-the-box!*

### 2. Frontend Setup (`client`)
```bash
cd client
npm install
npm run dev   # Starts Vite dev server on http://localhost:3000
```

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/extrad
JWT_SECRET=extrad_super_secret_jwt_key_2026_fashion_ecommerce
JWT_EXPIRE=30d
NODE_ENV=development
```

---

## 📂 Architecture

```
f:\eecom\
├── server/
│   ├── seed.js                   # Seed script
│   └── src/
│       ├── config/db.js          # DB connection with in-memory fallback
│       ├── models/               # User, Product, Category, Order, Cart, Wishlist, Coupon, Review
│       ├── middleware/           # authMiddleware, adminMiddleware, errorMiddleware
│       ├── controllers/          # Business logic handlers
│       ├── routes/               # REST API endpoints
│       └── server.js             # Main Express server entry point
└── client/
    ├── src/
    │   ├── components/           # Common, Product, Cart, Admin components
    │   ├── context/              # AuthContext, CartContext, WishlistContext, UIContext
    │   ├── pages/                # HomePage, ListingPage, ProductDetailPage, CartPage, WishlistPage, CheckoutPage, ProfilePage, Admin Pages
    │   ├── services/api.js       # Central Axios API client
    │   ├── App.jsx               # React Router v6 & protected routes
    │   └── main.jsx
```
