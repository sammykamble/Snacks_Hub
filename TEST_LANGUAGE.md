# 🔧 Language Switching - Troubleshooting Guide

## Issue: Language not changing

### Solution Applied:
Updated `advanced-features.js` to directly update HTML elements instead of relying on `data-translate` attributes.

---

## How to Test:

### 1. Clear Browser Cache
**Important!** The browser might be caching the old JavaScript file.

**Chrome/Edge:**
- Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
- Select "Cached images and files"
- Click "Clear data"

**Or do a Hard Refresh:**
- Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

### 2. Open the Homepage
```
http://localhost:3000
```

### 3. Look for Language Buttons
In the top navigation bar, you should see:
```
🇬🇧 EN | 🇮🇳 HI | 🇪🇸 ES
```

### 4. Click Each Language Button

**Click 🇮🇳 HI (Hindi):**
- "Cart" → "कार्ट"
- "Login" → "लॉगिन"
- "Sign Up" → "साइन अप"
- Search placeholder → "खाना खोजें..."
- "What's on your mind?" → "आप क्या चाहते हैं?"
- "Popular right now" → "अभी लोकप्रिय"

**Click 🇪🇸 ES (Spanish):**
- "Cart" → "Carrito"
- "Login" → "Iniciar sesión"
- "Sign Up" → "Registrarse"
- Search placeholder → "Buscar comida..."
- "What's on your mind?" → "¿Qué te apetece?"
- "Popular right now" → "Popular ahora"

**Click 🇬🇧 EN (English):**
- Everything back to English

---

## What Gets Translated:

✅ Navigation buttons (Cart, Login, Sign Up)
✅ Search placeholder text
✅ Section titles
✅ "View all" / "See all" links
✅ Cart drawer title
✅ Cart footer labels (Subtotal, Delivery fee, Taxes, Total)
✅ "Proceed to Checkout" button
✅ User dropdown menu items
✅ Empty cart message

---

## If It Still Doesn't Work:

### Check Browser Console:
1. Press `F12` to open Developer Tools
2. Go to "Console" tab
3. Look for any JavaScript errors (red text)
4. Take a screenshot and share

### Verify Files Are Loaded:
1. Press `F12` to open Developer Tools
2. Go to "Network" tab
3. Refresh the page
4. Look for:
   - `advanced-features.js` (should be 200 OK)
   - `advanced-features.css` (should be 200 OK)
5. Click on `advanced-features.js` and check if the file content is correct

### Manual Test in Console:
1. Press `F12` to open Developer Tools
2. Go to "Console" tab
3. Type: `changeLanguage('hi')`
4. Press Enter
5. The page should switch to Hindi

---

## Expected Behavior:

1. **Language buttons appear** in the navigation bar
2. **Clicking a language button** changes the text immediately
3. **Active language** is highlighted with red background
4. **Language preference** is saved (refresh page, language stays)
5. **Toast notification** appears: "Language changed to HI"

---

## Debug Steps:

### Step 1: Check if language selector exists
Open browser console (F12) and type:
```javascript
document.querySelector('.language-selector')
```
Should return: `<div class="language-selector">...</div>`

### Step 2: Check if changeLanguage function exists
```javascript
typeof changeLanguage
```
Should return: `"function"`

### Step 3: Manually trigger language change
```javascript
changeLanguage('hi')
```
Should change the page to Hindi

### Step 4: Check current language
```javascript
localStorage.getItem('language')
```
Should return: `"hi"` or `"es"` or `"en"`

---

## Quick Fix Commands:

If language buttons don't appear, run this in browser console:
```javascript
// Force initialize language support
initLanguageSupport();
```

If language doesn't change, run this:
```javascript
// Force apply Hindi
applyLanguage('hi');
```

---

## Alternative: Restart Server

Sometimes the server needs a restart to serve updated files:

1. Stop the server: Press `Ctrl + C` in the terminal
2. Start again: `node server.js`
3. Hard refresh browser: `Ctrl + Shift + R`

---

## Still Not Working?

### Check File Paths:
Make sure these files exist:
- ✅ `public/advanced-features.js`
- ✅ `public/advanced-features.css`

### Check HTML Files:
Open `public/index.html` and verify these lines exist before `</body>`:
```html
<script src="/features.js"></script>
<script src="/advanced-features.js"></script>
```

And in `<head>`:
```html
<link rel="stylesheet" href="/dark-mode.css">
<link rel="stylesheet" href="/advanced-features.css">
```

---

## Success Indicators:

✅ Language buttons (🇬🇧 EN | 🇮🇳 HI | 🇪🇸 ES) visible in navigation
✅ Clicking buttons changes text immediately
✅ Active button has red background
✅ Toast notification appears
✅ Language persists after page refresh
✅ Search placeholder changes
✅ Cart button text changes
✅ Login/Register buttons change

---

## Contact Points:

If you see language buttons but clicking doesn't work:
→ Check browser console for errors

If you don't see language buttons at all:
→ Hard refresh (Ctrl+Shift+R) and check Network tab

If some text changes but not all:
→ This is expected - only key UI elements are translated

---

Good luck! The language switching should work now after clearing cache! 🚀
