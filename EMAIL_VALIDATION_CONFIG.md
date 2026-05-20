# Email Validation Configuration Guide

## Overview
Your college canteen system now has **strict email validation** to prevent fake and disposable email addresses. Only students with valid college email addresses can register.

---

## ✅ What's Implemented

### 1. College Domain Whitelist
Only emails from approved college domains are allowed to register.

### 2. Disposable Email Blacklist
Blocks temporary/fake email services like:
- tempmail.com
- guerrillamail.com
- 10minutemail.com
- mailinator.com
- And 12+ more disposable email providers

### 3. Real-time Validation
- Client-side validation (instant feedback)
- Server-side validation (security)
- Clear error messages for users

---

## 🔧 How to Configure

### Step 1: Set Your College Email Domain

**In `server.js` (line ~50):**
```javascript
const ALLOWED_EMAIL_DOMAINS = [
  'college.edu',           // Replace with your college domain
  'university.edu',        // Add alternative domains
  'student.college.edu',   // Add subdomains if needed
  'ac.in',                 // Indian colleges
];
```

**In `public/login.html` (line ~280):**
```javascript
const ALLOWED_EMAIL_DOMAINS = ['college.edu', 'university.edu', 'student.college.edu', 'ac.in'];
```

### Step 2: Update Both Files
⚠️ **IMPORTANT**: You must update the domain list in BOTH files:
1. `server.js` - Server-side validation (security)
2. `public/login.html` - Client-side validation (user experience)

---

## 📝 Examples

### Example 1: Single College Domain
```javascript
// Only allow @mycollege.edu emails
const ALLOWED_EMAIL_DOMAINS = ['mycollege.edu'];
```

**Allowed:**
- student@mycollege.edu ✅
- john.doe@mycollege.edu ✅

**Blocked:**
- student@gmail.com ❌
- fake@tempmail.com ❌
- user@othercollege.edu ❌

### Example 2: Multiple Domains
```javascript
// Allow multiple college domains
const ALLOWED_EMAIL_DOMAINS = [
  'stanford.edu',
  'student.stanford.edu',
  'alumni.stanford.edu'
];
```

### Example 3: Indian Colleges
```javascript
// Indian college domains
const ALLOWED_EMAIL_DOMAINS = [
  'iitd.ac.in',
  'student.iitd.ac.in',
  'ac.in'  // Allow any .ac.in domain
];
```

### Example 4: Allow Any Email (Not Recommended)
If you want to allow any email (not recommended for college canteen):

**In `server.js`:**
```javascript
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  const domain = email.split('@')[1].toLowerCase();

  // Still block disposable emails
  if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
    return { valid: false, error: 'Disposable email addresses are not allowed.' };
  }

  // Comment out or remove the college domain check
  // const isCollegeDomain = ALLOWED_EMAIL_DOMAINS.some(...)
  // if (!isCollegeDomain) { ... }

  return { valid: true };
}
```

---

## 🛡️ Security Features

### 1. Disposable Email Blocking
Automatically blocks 15+ disposable email services:
- tempmail.com
- guerrillamail.com
- 10minutemail.com
- throwaway.email
- mailinator.com
- maildrop.cc
- temp-mail.org
- getnada.com
- trashmail.com
- fakeinbox.com
- yopmail.com
- sharklasers.com
- guerrillamailblock.com
- spam4.me
- grr.la
- discard.email

### 2. Format Validation
- Checks proper email format (user@domain.com)
- Validates domain structure
- Case-insensitive domain matching

### 3. Dual Validation
- **Client-side**: Instant feedback, better UX
- **Server-side**: Security, prevents API bypass

---

## 🎨 User Experience

### Error Messages
Users see clear, helpful error messages:

1. **Invalid Format**
   - "Invalid email format"

2. **Disposable Email**
   - "Disposable emails not allowed. Use your college email."

3. **Wrong Domain**
   - "Please use your college email (@college.edu or @ac.in)"

4. **Already Registered**
   - "Email already registered"

### Visual Feedback
- ✅ Green border for valid email
- ❌ Red border for invalid email
- 💬 Inline error message below input
- 💡 Hint text: "Use your college email address"

---

## 🧪 Testing

### Test Valid Emails
```
student@college.edu ✅
john.doe@college.edu ✅
user123@student.college.edu ✅
```

### Test Invalid Emails
```
fake@tempmail.com ❌ (disposable)
user@gmail.com ❌ (not college domain)
invalid-email ❌ (bad format)
@college.edu ❌ (missing username)
```

---

## 🔄 Quick Setup Steps

1. **Open `server.js`**
   - Find line ~50 (ALLOWED_EMAIL_DOMAINS)
   - Replace with your college domain(s)

2. **Open `public/login.html`**
   - Find line ~280 (ALLOWED_EMAIL_DOMAINS)
   - Use the SAME domains as server.js

3. **Restart Server**
   ```bash
   npm start
   ```

4. **Test Registration**
   - Try registering with college email ✅
   - Try registering with Gmail ❌
   - Try registering with tempmail ❌

---

## 📞 Support

If you need to:
- Add more disposable email domains to block
- Change validation rules
- Allow specific non-college domains
- Implement email verification codes

Just ask and I'll help you customize it!

---

## 🎯 Current Configuration

**Allowed Domains:**
- college.edu
- university.edu
- student.college.edu
- ac.in

**Blocked Disposable Domains:**
- 16 disposable email services

**Validation:**
- ✅ Client-side (instant feedback)
- ✅ Server-side (security)
- ✅ Format checking
- ✅ Domain verification
- ✅ Disposable email blocking
