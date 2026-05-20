# 🔧 Localhost Not Working - Troubleshooting Guide

## ✅ Current Status: FIXED & RUNNING!

Your server is now running on: **http://localhost:3000**

The browser should have opened automatically. If not, manually open your browser and go to:
```
http://localhost:3000
```

---

## 🚀 Server Status

✅ **Server**: Running on port 3000
✅ **Supabase**: Connected
✅ **Status**: All systems operational

---

## 🐛 Common Issues & Solutions

### Issue 1: "This site can't be reached"

**Solution:**
The server might have stopped. Restart it:

```bash
node server.js
```

You should see:
```
✅  Supabase connected
🚀  Snacks Hub running → http://localhost:3000
```

---

### Issue 2: "Port 3000 is already in use"

**Solution A - Kill the process:**
```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with the number from above)
taskkill /PID <PID> /F

# Then restart server
node server.js
```

**Solution B - Use a different port:**
```bash
# Set PORT environment variable
$env:PORT=3001
node server.js
```
Then open: http://localhost:3001

---

### Issue 3: Browser shows old/cached version

**Solution:**
Clear browser cache with a hard refresh:

- **Windows**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

Or clear cache completely:
- Press `Ctrl + Shift + Delete`
- Select "Cached images and files"
- Click "Clear data"

---

### Issue 4: "Cannot GET /"

**Solution:**
This means the server is running but routes are broken.

1. Stop the server: `Ctrl + C`
2. Check for errors in server.js
3. Restart: `node server.js`

---

### Issue 5: Server starts but immediately crashes

**Solution:**
Check for errors in the console:

```bash
node server.js
```

Look for error messages like:
- `Error: Cannot find module...` → Run `npm install`
- `SyntaxError...` → There's a syntax error in the code
- `Port already in use` → See Issue 2 above

---

## 🔍 Quick Diagnostics

### Check if server is running:
```powershell
curl http://localhost:3000 -UseBasicParsing
```

**Expected output:**
```
StatusCode: 200
```

**If you get an error:**
- Server is not running → Start it with `node server.js`

---

### Check if port 3000 is in use:
```powershell
netstat -ano | findstr :3000
```

**If you see output:**
- Port is in use → Kill the process or use different port

**If no output:**
- Port is free → Start the server

---

### Check Node.js is installed:
```bash
node --version
```

**Expected:** `v18.x.x` or higher

**If error:**
- Node.js not installed → Install from https://nodejs.org

---

## 🎯 Step-by-Step Server Start

### 1. Open Terminal/Command Prompt
- Press `Win + R`
- Type `cmd` or `powershell`
- Press Enter

### 2. Navigate to Project Folder
```bash
cd C:\Users\hp\Desktop\stitch
```

### 3. Start Server
```bash
node server.js
```

### 4. Wait for Success Message
You should see:
```
✅  Supabase connected
🚀  Snacks Hub running → http://localhost:3000
```

### 5. Open Browser
Go to: http://localhost:3000

---

## 🌐 Alternative: Use Different Browser

If Chrome doesn't work, try:
- Microsoft Edge
- Firefox
- Brave

Sometimes browser extensions or settings can block localhost.

---

## 🔒 Firewall Issues

If Windows Firewall is blocking:

1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Find "Node.js" and check both Private and Public
4. Click OK
5. Restart server

---

## 📱 Access from Phone (Same Network)

Want to test on your phone?

1. Find your computer's IP address:
```powershell
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

2. On your phone, open browser and go to:
```
http://192.168.1.100:3000
```
(Replace with your actual IP)

---

## 🛠️ Emergency Reset

If nothing works, try this:

```bash
# 1. Stop all Node processes
taskkill /F /IM node.exe

# 2. Clear npm cache
npm cache clean --force

# 3. Reinstall dependencies
npm install

# 4. Start fresh
node server.js
```

---

## ✅ Verification Checklist

- [ ] Terminal shows "🚀 Snacks Hub running → http://localhost:3000"
- [ ] No error messages in terminal
- [ ] Browser opens http://localhost:3000
- [ ] Homepage loads with Snacks Hub logo
- [ ] No 404 or connection errors
- [ ] Can click around and navigate

---

## 🎉 Success Indicators

When everything is working, you should see:

**In Terminal:**
```
✅  Supabase connected
⚠️  No Razorpay keys — payment will be simulated
🚀  Snacks Hub running → http://localhost:3000
```

**In Browser:**
- Snacks Hub homepage with 🍕 logo
- Navigation bar with Cart, Login, Sign Up
- Language buttons (🇬🇧 EN | 🇮🇳 HI | 🇪🇸 ES)
- Menu items loading
- Dark mode button (🌙) in bottom-right

---

## 📞 Still Not Working?

### Check these files exist:
- ✅ `server.js`
- ✅ `package.json`
- ✅ `.env`
- ✅ `public/index.html`

### Check Node modules installed:
```bash
npm install
```

### Check for typos in URL:
- ✅ Correct: `http://localhost:3000`
- ❌ Wrong: `http://localhost:3000/`
- ❌ Wrong: `https://localhost:3000`
- ❌ Wrong: `http://127.0.0.1:3000`

(Actually all should work, but try the first one)

---

## 🚀 Quick Start Command

Just run this:
```bash
cd C:\Users\hp\Desktop\stitch && node server.js
```

Then open: http://localhost:3000

---

Your server is running and ready! 🎊

If you see the Snacks Hub homepage, everything is working perfectly!
