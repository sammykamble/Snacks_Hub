# 🍕 Snacks Hub - Demo Guide

## ✅ Your Project is Running!

**Server URL:** http://localhost:3000

---

## 🎯 Key Features to Demonstrate

### 1. **Login & Registration with Validation** ✨
- **URL:** http://localhost:3000/login
- **Features:**
  - ✅ Email validation (must be valid email format)
  - ✅ Password validation (minimum 6 characters)
  - ✅ Real-time field validation on blur
  - ✅ Password strength indicators (uppercase, number, length)
  - ✅ Password visibility toggle
  - ✅ Error messages for invalid inputs
  - ✅ Success messages after registration
  - ✅ Tab switching between Login/Register
  - ✅ **Forgot Password functionality** (NEW!)

**Test Credentials (Demo Mode):**
- Email: `test@example.com`
- Password: `Test123` (any password 6+ chars works in demo mode)

**Forgot Password:**
- Click "Forgot password?" link
- Enter email address
- Get reset link (in demo mode, check server console)

### 2. **Home Page**
- **URL:** http://localhost:3000
- Beautiful hero section with search
- Category browsing
- Popular menu items
- Promotional banners
- How it works section

### 3. **Menu Browsing**
- **URL:** http://localhost:3000/menu
- Filter by categories (Burgers, Drinks, Snacks, Healthy, etc.)
- Search functionality
- Add items to cart
- Wishlist feature

### 4. **Shopping Cart**
- Click cart icon in navigation
- Add/remove items
- Update quantities
- View subtotal, delivery fee, and taxes
- Proceed to checkout

### 5. **Dashboard** (After Login)
- **URL:** http://localhost:3000/dashboard
- View order history
- Track order status

### 6. **Admin Panel**
- **URL:** http://localhost:3000/admin
- Add new menu items
- Edit existing items
- Delete items
- Manage orders

---

## 🚀 How to Run

```bash
# Start the server
node server.js
```

The server will start on **http://localhost:3000**

---

## 📋 Demo Flow Suggestion

1. **Start at Home Page** (http://localhost:3000)
   - Show the beautiful UI and navigation

2. **Go to Login Page** (http://localhost:3000/login)
   - Click "Sign Up" tab
   - Try submitting empty form → Show validation errors
   - Enter invalid email → Show email validation
   - Enter short password → Show password validation
   - Fill valid data and register → Show success message
   - Switch to Login tab and login
   - **NEW:** Click "Forgot password?" → Show modal with email validation

3. **Browse Menu** (http://localhost:3000/menu)
   - Filter by categories
   - Use search
   - Add items to cart

4. **View Cart**
   - Click cart icon
   - Update quantities
   - Show total calculation

5. **Show Dashboard** (http://localhost:3000/dashboard)
   - View orders (if any)

6. **Show Admin Panel** (http://localhost:3000/admin)
   - Add a new menu item
   - Show it appears in the menu

---

## 🎨 Validation Features Highlighted

### Registration Form Validations:
- ✅ **Full Name:** Required, minimum 2 characters
- ✅ **Student ID:** Required field
- ✅ **Email:** Required, must be valid email format
- ✅ **Password:** 
  - Minimum 6 characters
  - Must contain uppercase letter
  - Must contain number
  - Real-time strength indicator

### Login Form Validations:
- ✅ **Email:** Required, valid format
- ✅ **Password:** Required

### Visual Feedback:
- ✅ Red border for errors
- ✅ Green border for valid fields
- ✅ Error messages with icons
- ✅ Success messages
- ✅ Loading states on buttons
- ✅ Modal popup for forgot password
- ✅ Smooth animations and transitions

---

## 🔧 Current Mode

Your project is running in **DEMO MODE** because:
- No Supabase keys configured (uses localStorage)
- No Razorpay keys configured (simulated payments)

This is perfect for your demo! Everything works without external dependencies.

---

## 💡 Tips for Demo

1. **Open in a clean browser** (or incognito) to show fresh experience
2. **Have the login page ready** to demonstrate validations
3. **Prepare test data** (name, email, password) beforehand
4. **Show both success and error cases** for validations
5. **Highlight the real-time validation** as you type

---

## 🐛 If Something Goes Wrong

1. **Server not starting?**
   ```bash
   npm install
   node server.js
   ```

2. **Port 3000 already in use?**
   - Kill the process or change PORT in .env

3. **Page not loading?**
   - Check console for errors
   - Refresh the page
   - Clear browser cache

---

## 📱 Responsive Design

The project is fully responsive! You can also demo it on mobile view:
- Right-click → Inspect → Toggle device toolbar
- Show mobile navigation
- Show responsive layout

---

## ✨ Bonus Features to Mention

- 🎨 Modern, professional UI design
- 🚀 Fast and smooth animations
- 📱 Fully responsive
- ♿ Accessible forms
- 🔒 Secure password handling
- 💾 Persistent cart (localStorage)
- 🎯 Real-time search and filtering
- 📊 Order tracking system
- 👨‍💼 Admin panel for management

---

## Good Luck with Your Demo! 🎉

Your project is ready and working perfectly. Just run `node server.js` and open http://localhost:3000
