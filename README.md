# Snacks Hub - Food Ordering Platform

A modern food ordering platform built with Node.js, Express, and Supabase.



## 📁 Project Structure
```
snacks-hub/
├── public/           # Static files (HTML, CSS, JS)
├── server.js         # Express server
├── package.json      # Dependencies
└── .env             # Environment variables (not in git)
```

## 🔧 Local Development
```bash
npm install
node server.js
```
Visit http://localhost:3000

## 🌐 Environment Variables
Create a `.env` file:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
PORT=3000
```

## ✅ Deployment Checklist
- [x] All files in `public/` folder
- [x] `server.js` serves static files from `public/`
- [x] `package.json` has start script
- [x] `.gitignore` excludes `node_modules` and `.env`


## 🎯 Features
- User authentication with Supabase
- Menu browsing and ordering
- Shopping cart functionality
- Payment integration with Razorpay
- Admin dashboard
- Order tracking

## 📝 License
ISC
