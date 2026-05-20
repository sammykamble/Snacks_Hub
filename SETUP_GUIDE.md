# 🎓 COLLEGE CANTEEN MANAGEMENT SYSTEM - COMPLETE SETUP GUIDE

## 🚀 Quick Start

Your project is running at: **http://localhost:3000**

---

## 🔐 ADMIN ACCESS

### How to Access Admin Dashboard:

1. **Go to:** http://localhost:3000/admin
2. **No login required** - Direct access to admin panel

### Admin Features:
- ✅ View Dashboard with Analytics
- ✅ Manage Menu Items (Add/Edit/Delete)
- ✅ View and Manage Orders
- ✅ Update Order Status
- ✅ View Revenue Charts
- ✅ See Top Selling Items

---

## 👨‍🎓 STUDENT FEATURES

### Registration:
1. Go to http://localhost:3000/login
2. Click "Sign Up"
3. Fill in details:
   - Name
   - Email (use college email format)
   - Password
   - Student ID (Format: 2024-CS-001)
   - Department
   - Hostel

### Login:
1. Use registered email and password
2. Access menu, cart, orders

### Order Food:
1. Browse Menu
2. Add items to cart
3. Go to Checkout
4. Fill delivery details
5. Choose payment method
6. Place order

### Track Orders:
1. Go to Dashboard
2. View all your orders
3. See real-time status updates

### Rate & Review:
1. After receiving order
2. Go to Menu
3. Click on item
4. Rate and review

---

## 📧 EMAIL NOTIFICATIONS

### Current Status:
- ✅ Email system is configured
- ⚠️ Currently in DEMO mode (logs to console)
- 📧 Emails are logged in server terminal

### What Emails Are Sent:
1. **Order Confirmation** - When order is placed
2. **Status Updates** - When order status changes
3. **Password Reset** - When user requests password reset

### To Enable Real Emails:

#### Option 1: SendGrid (Recommended)
```bash
npm install @sendgrid/mail
```

Add to `.env`:
```
SENDGRID_API_KEY=your_sendgrid_api_key
```

#### Option 2: Nodemailer with Gmail
```bash
npm install nodemailer
```

Add to `.env`:
```
EMAIL_USER=your-college-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## 🔄 FORGOT PASSWORD FLOW

### How It Works:

1. **User clicks "Forgot Password"** on login page
2. **Enters email address**
3. **System sends reset link** to email
4. **User clicks link** in email
5. **Redirected to reset page**
6. **Enters new password**
7. **Password updated** ✅

### Current Implementation:
- ✅ Forgot password link on login page
- ✅ Email validation
- ✅ Reset password page
- ✅ Password confirmation
- ⚠️ Email sending in demo mode (check console)

---

## ⭐ REVIEWS & RATINGS

### How to Test:

1. **Login as a student**
2. **Go to Menu page**
3. **Click on any food item**
4. **Click "Rate this item" button**
5. **Select stars (1-5)**
6. **Write review (optional)**
7. **Submit**

### Features:
- ✅ 5-star rating system
- ✅ Written reviews
- ✅ User name displayed
- ✅ Average rating calculation
- ✅ Review count
- ✅ Beautiful modal UI

### Validation:
- ✅ Must be logged in to review
- ✅ Rating required (1-5 stars)
- ✅ Comment optional
- ✅ One review per user per item

---

## 📦 ORDER TRACKING

### How It Works:

1. **Place an order**
2. **Go to Dashboard**
3. **Click on order**
4. **See live tracking**

### Order Stages:
1. 🟡 **Pending** - Order received (2-3 min)
2. 🟢 **Confirmed** - Canteen confirmed (10-15 min)
3. 🟠 **Preparing** - Food being prepared (5-10 min)
4. 🟣 **Ready** - Ready for pickup
5. ✅ **Delivered** - Order completed

### Admin Can Update Status:
1. Go to `/admin`
2. Click "Orders" tab
3. Change status dropdown
4. Student sees update in real-time

---

## 🎓 COLLEGE-SPECIFIC FEATURES

### 1. Student ID Validation
- Format: YEAR-DEPT-ROLLNO
- Example: 2024-CS-001
- Validated on registration

### 2. Department Selection
- Computer Science
- Electronics
- Mechanical
- Civil
- Electrical
- Information Technology
- Other

### 3. Hostel/Residence
- Boys Hostel 1
- Boys Hostel 2
- Girls Hostel 1
- Girls Hostel 2
- Day Scholar

### 4. Canteen Timings
- Breakfast: 7:00 AM - 10:00 AM
- Lunch: 12:00 PM - 3:00 PM
- Snacks: 3:00 PM - 6:00 PM
- Dinner: 7:00 PM - 10:00 PM

### 5. Today's Special
- Different special for each day
- Displayed on homepage
- Limited stock badge

### 6. Mess Card (Optional)
- Virtual balance system
- Recharge option
- Pay with mess card

---

## 🎨 CUSTOMIZATION

### Change College Name:
Edit `public/college-canteen.js`:
```javascript
collegeName: 'Your College Name Here'
```

### Change Canteen Location:
```javascript
location: 'Your Canteen Location'
```

### Add More Departments:
```javascript
departments: [
  'Your Department 1',
  'Your Department 2',
  // Add more...
]
```

### Change Timings:
```javascript
timings: {
  breakfast: '7:00 AM - 10:00 AM',
  lunch: '12:00 PM - 3:00 PM',
  // Modify as needed
}
```

---

## 🐛 TROUBLESHOOTING

### Issue: Admin page not loading
**Solution:** Go directly to http://localhost:3000/admin

### Issue: Can't login
**Solution:** 
1. Check if you registered first
2. Verify email and password
3. Check browser console for errors

### Issue: Reviews not showing
**Solution:**
1. Make sure you're logged in
2. Refresh the page
3. Check if reviews.js is loaded

### Issue: Order tracking redirects to login
**Solution:**
1. Login first
2. Then go to dashboard
3. Session should be saved

### Issue: Emails not sending
**Solution:**
- Check server console for email logs
- Emails are in demo mode (console only)
- Setup SendGrid for real emails

---

## 📊 DATABASE SETUP (Supabase)

### Tables Needed:

#### 1. Users Table (Already exists via Supabase Auth)

#### 2. Menu Table:
```sql
CREATE TABLE menu (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. Orders Table:
```sql
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4. Reviews Table:
```sql
CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  menu_item_id BIGINT REFERENCES menu(id),
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🚀 DEPLOYMENT CHECKLIST

### Before Deploying:

- [ ] Update college name and branding
- [ ] Add real menu items with images
- [ ] Setup email service (SendGrid)
- [ ] Add Razorpay keys for payments
- [ ] Create Supabase tables
- [ ] Test all features locally
- [ ] Update environment variables
- [ ] Push to GitHub
- [ ] Deploy to Render
- [ ] Test on production

---

## 📱 MOBILE RESPONSIVE

All features work on:
- ✅ Desktop (1280px+)
- ✅ Tablet (768px - 1280px)
- ✅ Mobile (< 768px)

---

## 🎯 TESTING CHECKLIST

### Student Flow:
- [ ] Register with student ID
- [ ] Login successfully
- [ ] Browse menu
- [ ] Add items to cart
- [ ] Place order
- [ ] Track order
- [ ] Rate and review items

### Admin Flow:
- [ ] Access admin dashboard
- [ ] View analytics
- [ ] Add menu item
- [ ] Edit menu item
- [ ] Delete menu item
- [ ] View orders
- [ ] Update order status

### Email Flow:
- [ ] Register → Check console for welcome email
- [ ] Place order → Check console for confirmation
- [ ] Forgot password → Check console for reset link
- [ ] Status update → Check console for notification

---

## 💡 TIPS

1. **Test with multiple users** to see how it works
2. **Add real food images** for better look
3. **Customize colors** to match your college
4. **Add college logo** in the header
5. **Test on mobile** devices
6. **Setup real payments** before going live
7. **Enable email service** for production

---

## 📞 SUPPORT

If you face any issues:
1. Check server console for errors
2. Check browser console (F12)
3. Verify environment variables
4. Check this guide again
5. Test API endpoints manually

---

## 🎉 YOU'RE ALL SET!

Your College Canteen Management System is ready to use!

**Access Points:**
- Homepage: http://localhost:3000
- Menu: http://localhost:3000/menu
- Login: http://localhost:3000/login
- Admin: http://localhost:3000/admin
- Dashboard: http://localhost:3000/dashboard

**Happy Coding!** 🚀
