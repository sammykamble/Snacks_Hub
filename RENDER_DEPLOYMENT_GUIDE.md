# 🚀 Deploy Snacks Hub to Render

## Why Render?
- ✅ Free tier available
- ✅ Easy deployment from GitHub
- ✅ Automatic HTTPS
- ✅ Environment variables support
- ✅ Auto-deploy on git push

---

## 📋 Step-by-Step Deployment Guide

### Step 1: Prepare Your Project

Make sure you have:
- ✅ `package.json` with start script
- ✅ `server.js` as entry point
- ✅ `.gitignore` excluding `node_modules` and `.env`
- ✅ Code pushed to GitHub

---

### Step 2: Create Render Account

1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with:
   - GitHub (recommended)
   - GitLab
   - Email

---

### Step 3: Create New Web Service

1. Click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub account (if not already)
4. Select your **snacks-hub** repository

---

### Step 4: Configure Service

Fill in the following:

**Basic Settings:**
- **Name**: `snacks-hub` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (unless in subdirectory)

**Build & Deploy:**
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

**Instance Type:**
- Select **"Free"** (or paid plan if needed)

---

### Step 5: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
ADMIN_EMAIL=admin@college.edu
ADMIN_PASSWORD=admin123
PORT=3000
```

**Important:**
- Replace with your actual Supabase credentials
- Replace with your actual Razorpay credentials
- Change admin credentials for security

---

### Step 6: Deploy

1. Click **"Create Web Service"**
2. Render will:
   - Clone your repository
   - Install dependencies
   - Start your server
   - Assign a URL

**Deployment takes 2-5 minutes**

---

### Step 7: Get Your Live URL

After deployment completes:
- Your app will be live at: `https://snacks-hub-xxxx.onrender.com`
- Click the URL to open your app

---

## 🔧 Post-Deployment Configuration

### Update Supabase Redirect URLs

1. Go to Supabase Dashboard
2. Authentication → URL Configuration
3. Add your Render URL:
   ```
   https://your-app.onrender.com
   ```

### Test Your Deployment

1. Open your Render URL
2. Test registration
3. Test login
4. Test menu browsing
5. Test cart and checkout

---

## 🔄 Auto-Deploy on Git Push

Render automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Render will detect the push and redeploy automatically!

---

## 🐛 Troubleshooting

### Build Failed?
- Check **"Logs"** tab in Render dashboard
- Verify `package.json` has all dependencies
- Make sure `node server.js` works locally

### App Not Loading?
- Check if PORT environment variable is set
- Verify server is listening on `process.env.PORT`
- Check logs for errors

### Environment Variables Not Working?
- Go to Render dashboard → Your service → Environment
- Verify all variables are added
- Click **"Manual Deploy"** → **"Deploy latest commit"**

### Database Connection Failed?
- Verify Supabase URL and KEY are correct
- Check Supabase project is active
- Test connection locally first

### 404 Errors?
- Make sure `public` folder is committed to git
- Verify `server.js` serves static files correctly
- Check file paths are correct

---

## 💡 Tips for Production

### 1. Use Custom Domain (Optional)
- Go to Settings → Custom Domain
- Add your domain
- Update DNS records

### 2. Enable Auto-Deploy
- Already enabled by default
- Disable in Settings if needed

### 3. Monitor Your App
- Check **"Metrics"** tab for performance
- View **"Logs"** for errors
- Set up **"Notifications"** for failures

### 4. Scale Your App
- Upgrade to paid plan for:
  - More resources
  - Faster builds
  - No sleep on free tier

---

## 📊 Free Tier Limitations

Render Free Tier:
- ✅ 750 hours/month
- ✅ Automatic HTTPS
- ✅ Auto-deploy from git
- ⚠️ Spins down after 15 min inactivity
- ⚠️ Cold start delay (10-30 seconds)

**For production**: Consider upgrading to paid plan ($7/month)

---

## 🔐 Security Checklist

Before going live:
- [ ] Change default admin credentials
- [ ] Use strong passwords
- [ ] Enable HTTPS (automatic on Render)
- [ ] Don't commit `.env` file
- [ ] Use environment variables for secrets
- [ ] Enable Supabase Row Level Security

---

## 📱 Testing Your Live App

### Test URLs:
- **Homepage**: `https://your-app.onrender.com/`
- **Login**: `https://your-app.onrender.com/login`
- **Menu**: `https://your-app.onrender.com/menu`
- **Dashboard**: `https://your-app.onrender.com/dashboard`
- **Admin**: `https://your-app.onrender.com/admin`

### Test Checklist:
- [ ] Homepage loads
- [ ] Can register new account
- [ ] Can login
- [ ] Menu items display
- [ ] Can add to cart
- [ ] Checkout works
- [ ] Admin panel accessible
- [ ] Dark mode works
- [ ] Language switching works

---

## 🎉 Success!

Your Snacks Hub is now live on the internet!

**Share your app:**
- Copy the Render URL
- Share with friends/classmates
- Add to your portfolio
- Demo for your project

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Check Logs**: Render Dashboard → Logs tab

---

## 🚀 Next Steps

1. ✅ Test all features on live URL
2. ✅ Share with users
3. ✅ Monitor logs for errors
4. ✅ Collect feedback
5. ✅ Iterate and improve

---

Made with ❤️ for easy deployment!
