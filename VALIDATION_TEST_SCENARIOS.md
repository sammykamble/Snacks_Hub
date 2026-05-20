# 🧪 Validation Test Scenarios for Demo

## Registration Form Tests

### ✅ Test 1: Empty Form Submission
**Steps:**
1. Go to http://localhost:3000/login
2. Click "Create Account" tab
3. Click "Create Account" button without filling anything
**Expected:** Error messages appear for all required fields

### ✅ Test 2: Invalid Email
**Steps:**
1. Enter Name: "John Doe"
2. Enter Student ID: "U2024-001"
3. Enter Email: "invalidemail" (no @ or domain)
4. Enter Password: "Test123"
5. Click outside email field
**Expected:** "Enter a valid email address" error appears

### ✅ Test 3: Short Password
**Steps:**
1. Fill all fields correctly
2. Enter Password: "12345" (only 5 characters)
3. Click outside password field
**Expected:** "Minimum 6 characters required" error appears

### ✅ Test 4: Password Strength Indicators
**Steps:**
1. Click in password field
2. Type: "test" → See red indicators
3. Type: "Test" → See uppercase indicator turn green
4. Type: "Test1" → See number indicator turn green
5. Type: "Test123" → All indicators green
**Expected:** Real-time visual feedback as you type

### ✅ Test 5: Successful Registration
**Steps:**
1. Name: "Alex Johnson"
2. Student ID: "U2024-100"
3. Email: "alex@university.edu"
4. Password: "Test123"
5. Click "Create Account"
**Expected:** 
- Success message appears
- Automatically switches to Login tab after 1.5 seconds

---

## Login Form Tests

### ✅ Test 6: Empty Login
**Steps:**
1. Go to Login tab
2. Click "Sign In" without filling fields
**Expected:** Error messages for email and password

### ✅ Test 7: Invalid Email Format
**Steps:**
1. Enter Email: "notanemail"
2. Click outside field
**Expected:** "Enter a valid email address" error

### ✅ Test 8: Successful Login
**Steps:**
1. Email: "test@example.com"
2. Password: "Test123"
3. Click "Sign In"
**Expected:**
- Button shows "Signing in..." with loading icon
- Redirects to home page
- Navigation shows user menu instead of Login/Sign Up buttons

---

## Forgot Password Tests

### ✅ Test 9: Open Forgot Password Modal
**Steps:**
1. Go to Login tab
2. Click "Forgot password?" link
**Expected:** Modal appears with email input field

### ✅ Test 10: Empty Email in Forgot Password
**Steps:**
1. Open forgot password modal
2. Click "Send Reset Link" without entering email
**Expected:** "Email is required" error appears

### ✅ Test 11: Invalid Email in Forgot Password
**Steps:**
1. Open forgot password modal
2. Enter: "notanemail"
3. Click outside field
**Expected:** "Enter a valid email address" error

### ✅ Test 12: Successful Password Reset Request
**Steps:**
1. Open forgot password modal
2. Enter: "test@example.com"
3. Click "Send Reset Link"
**Expected:**
- Button shows "Sending..." with loading icon
- Success message: "✅ Reset link sent! Check your email."
- Modal closes after 2 seconds
- In demo mode: Check server console for reset link

### ✅ Test 13: Close Modal
**Steps:**
1. Open forgot password modal
2. Click X button or click outside modal
**Expected:** Modal closes smoothly

---

## Visual Validation Features

### ✅ Field States
- **Default:** Gray border
- **Focus:** Red border with shadow
- **Error:** Red border + error message
- **Valid:** Green border

### ✅ Password Toggle
- Click eye icon to show/hide password
- Icon changes between "visibility" and "visibility_off"

### ✅ Real-time Validation
- Validation triggers on blur (when you click outside field)
- Password hints update as you type
- No page refresh needed

---

## Quick Demo Script

**"Let me show you the validation features:"**

1. **"First, let's try submitting an empty form..."**
   - Click Create Account → Show errors

2. **"Now let's enter an invalid email..."**
   - Type "test" in email → Show error

3. **"Watch the password strength indicators..."**
   - Type password slowly, showing each indicator

4. **"Here's a successful registration..."**
   - Fill valid data → Show success

5. **"And now login with those credentials..."**
   - Login → Show redirect

6. **"Let me show you the forgot password feature..."**
   - Click "Forgot password?" → Show modal
   - Try empty email → Show error
   - Enter valid email → Show success

---

## Common Issues & Solutions

### Issue: "Email already exists"
**Solution:** Use a different email or clear localStorage:
```javascript
// Open browser console (F12) and run:
localStorage.clear()
```

### Issue: Form not submitting
**Solution:** Check browser console for errors, refresh page

### Issue: Validation not showing
**Solution:** Make sure to click outside the field (blur event)

---

## Browser Console Commands (For Testing)

```javascript
// Clear all data
localStorage.clear()

// Check current session
JSON.parse(localStorage.getItem('sh_session'))

// Check cart
JSON.parse(localStorage.getItem('sh_cart'))
```

---

## Validation Rules Summary

| Field | Rules |
|-------|-------|
| Full Name | Required, min 2 characters |
| Student ID | Required |
| Email | Required, valid email format |
| Password | Required, min 6 characters, 1 uppercase, 1 number |

---

## Pro Tips for Demo

1. **Type slowly** when showing password validation
2. **Point out** the visual feedback (colors, icons)
3. **Show both** error and success states
4. **Mention** that it's all client-side validation (fast!)
5. **Highlight** the user experience improvements

---

Good luck! 🚀
