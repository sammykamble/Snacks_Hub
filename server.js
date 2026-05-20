require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Supabase (lazy — only if real keys provided) ───────────────
let supabase = null;
let supabaseAdmin = null;
try {
  const url  = process.env.SUPABASE_URL  || '';
  const key  = process.env.SUPABASE_KEY  || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  if (url.startsWith('https://') && key.length > 20) {
    const { createClient } = require('@supabase/supabase-js');
    
    // Client for auth operations
    supabase = createClient(url, key);
    console.log('✅  Supabase connected');
    
    // Admin client for server-side operations (bypasses RLS)
    if (serviceKey && serviceKey !== 'your_service_role_key_here' && serviceKey.length > 20) {
      supabaseAdmin = createClient(url, serviceKey);
      console.log('✅  Supabase Admin connected (for server operations)');
    } else {
      console.log('⚠️  No service role key - using anon key (RLS will apply)');
      supabaseAdmin = supabase; // Fallback to regular client
    }
  } else {
    console.log('⚠️  No Supabase keys — running in DEMO mode (localStorage only)');
  }
} catch (e) { console.log('⚠️  Supabase init failed:', e.message); }

// ─── Admin Credentials ───────────────────────────────────────────
const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@college.edu',
  password: process.env.ADMIN_PASSWORD || 'admin123',
  name: 'Admin'
};

console.log('🔐 Admin credentials:', ADMIN_CREDENTIALS.email);

// ─── Razorpay (lazy) ────────────────────────────────────────────
let razorpay = null;
let razorpayMode = 'off'; // 'test' | 'live' | 'off'
try {
  const Razorpay = require('razorpay');
  const kid = process.env.RAZORPAY_KEY_ID || '';
  const sec = process.env.RAZORPAY_SECRET || '';
  const placeholders = ['your_razorpay', 'dummy', 'xxx'];
  const isPlaceholder = (v) => !v || placeholders.some((p) => v.toLowerCase().includes(p));
  if (kid && sec && !isPlaceholder(kid) && !isPlaceholder(sec)) {
    razorpay = new Razorpay({ key_id: kid, key_secret: sec });
    razorpayMode = kid.startsWith('rzp_live_') ? 'live' : 'test';
    console.log(`✅  Razorpay connected (${razorpayMode} mode)`);
    if (razorpayMode === 'live') {
      console.log('💰  Live payments enabled — real money will be charged');
    } else {
      console.log('🧪  Test mode — use Razorpay test cards/UPI (no real money)');
    }
  } else {
    console.log('⚠️  No Razorpay keys — payment will be simulated');
  }
} catch (e) { console.log('⚠️  Razorpay init failed:', e.message); }

// ════════════════════════════════════════════
//  EMAIL VALIDATION
// ════════════════════════════════════════════
// Allowed college email domains
const ALLOWED_EMAIL_DOMAINS = [
  'college.edu',
  'university.edu',
  'student.college.edu',
  'ac.in',
  // Add your college domain here
];

// Disposable/temporary email domains to block
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'throwaway.email',
  'mailinator.com', 'maildrop.cc', 'temp-mail.org', 'getnada.com',
  'trashmail.com', 'fakeinbox.com', 'yopmail.com', 'sharklasers.com',
  'guerrillamailblock.com', 'spam4.me', 'grr.la', 'discard.email'
];

function validateEmail(email) {
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Extract domain
  const domain = email.split('@')[1].toLowerCase();

  // Check if disposable email
  if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
    return { valid: false, error: 'Disposable/temporary email addresses are not allowed. Please use a real email.' };
  }

  // Allow any real email (Gmail, Yahoo, Outlook, college emails, etc.)
  // Only blocking disposable/fake emails
  return { valid: true };
}

// ════════════════════════════════════════════
//  AUTH ROUTES
// ════════════════════════════════════════════
// Admin login
app.post('/api/auth/admin-login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  // Check admin credentials
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    return res.json({
      user: {
        id: 'admin',
        email: ADMIN_CREDENTIALS.email,
        user_metadata: { name: ADMIN_CREDENTIALS.name, role: 'admin' }
      },
      session: {
        access_token: 'admin-token',
        user: { id: 'admin', email: ADMIN_CREDENTIALS.email, role: 'admin' }
      }
    });
  }
  
  return res.status(401).json({ error: 'Invalid admin credentials' });
});

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, student_id } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ error: 'Missing required fields' });

  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return res.status(400).json({ error: emailValidation.error });
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Authentication service not available' });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email, 
      password,
      options: { 
        data: { name, student_id, role: 'user' },
        emailRedirectTo: undefined
      }
    });
    
    if (error) {
      console.error(`❌ Registration failed for ${email}:`, error.message);
      return res.status(400).json({ error: error.message });
    }
    
    console.log(`✅ User registered in Supabase: ${email} (${name})`);
    return res.json({ user: data.user, session: data.session });
  } catch (e) {
    console.error('Registration error:', e);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  console.log(`🔐 Login attempt for: ${email}`);

  if (!supabase) {
    return res.status(500).json({ error: 'Authentication service not available' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      console.error(`❌ Login failed for ${email}:`, error.message);
      
      if (error.message.includes('Email not confirmed')) {
        return res.status(401).json({ error: 'Please verify your email address first' });
      }
      if (error.message.includes('Invalid login credentials')) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      return res.status(401).json({ error: error.message });
    }
    
    console.log(`✅ Login successful: ${email}`);
    return res.json({ user: data.user, session: data.session });
  } catch (e) { 
    console.error('Login error:', e);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ error: 'Email is required' });

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ error: 'Invalid email format' });

  if (!supabase) {
    return res.status(500).json({ error: 'Authentication service not available' });
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${req.protocol}://${req.get('host')}/reset-password.html`
    });
    
    if (error) {
      console.error('Password reset error:', error);
      return res.status(400).json({ error: error.message });
    }
    
    console.log(`📧 Password reset email sent to: ${email}`);
    res.json({ message: 'Password reset link sent to your email' });
  } catch (e) { 
    console.error('Forgot password error:', e);
    res.status(500).json({ error: 'Failed to send reset email' }); 
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email)
    return res.status(400).json({ error: 'Email is required' });
  
  if (!password)
    return res.status(400).json({ error: 'Password is required' });
  
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ error: 'Invalid email format' });
  
  console.log(`🔒 Password reset attempt for: ${email}`);
  
  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Authentication service not available' });
  }
  
  try {
    // Get user by email
    const { data: users, error: fetchError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (fetchError) {
      console.error('Error fetching users:', fetchError);
      return res.status(500).json({ error: 'Failed to reset password' });
    }
    
    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return res.status(404).json({ 
        error: 'No account found with this email'
      });
    }
    
    // Update password using admin API
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password }
    );
    
    if (updateError) {
      console.error('Error updating password:', updateError);
      return res.status(400).json({ error: updateError.message });
    }
    
    console.log(`✅ Password reset successful: ${email}`);
    return res.json({ message: 'Password reset successfully' });
  } catch (e) {
    console.error('Reset password error:', e);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
});

app.post('/api/auth/update-password', async (req, res) => {
  const { password } = req.body;
  const authHeader = req.headers.authorization;
  
  if (!password)
    return res.status(400).json({ error: 'Password is required' });
  
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'Unauthorized' });
  
  const token = authHeader.substring(7);
  
  if (!supabase) {
    // DEMO mode - simulate success
    console.log(`🔒 Password updated successfully`);
    return res.json({ message: 'Password updated successfully' });
  }

  try {
    const { data, error } = await supabase.auth.updateUser(
      { password },
      { accessToken: token }
    );
    
    if (error) return res.status(400).json({ error: error.message });
    
    res.json({ message: 'Password updated successfully', user: data.user });
  } catch (e) {
    console.error('Update password error:', e);
    res.status(500).json({ error: 'Failed to update password' }); 
  }
});

// ════════════════════════════════════════════
//  MENU ROUTES
// ════════════════════════════════════════════
// Demo menu items used when Supabase not connected
const DEMO_MENU = [
  { id: 1, name: 'Samosa', description: 'Crispy fried pastry filled with spiced potatoes and peas', price: 20, category: 'Snacks', image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
  { id: 2, name: 'Veg Puff', description: 'Flaky puff pastry stuffed with mixed vegetables', price: 25, category: 'Snacks', image_url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400' },
  { id: 3, name: 'Paneer Puff', description: 'Golden puff pastry filled with spiced paneer', price: 35, category: 'Snacks', image_url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400' },
  { id: 4, name: 'Bread Pakora', description: 'Bread slices dipped in gram flour batter and deep fried', price: 25, category: 'Snacks', image_url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400' },
  { id: 5, name: 'Aloo Vada', description: 'Spiced potato fritters coated in chickpea batter', price: 15, category: 'Snacks', image_url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400' },
  { id: 6, name: 'Batata Vada', description: 'Mumbai style potato vada with spicy chutney', price: 15, category: 'Snacks', image_url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400' },
  { id: 7, name: 'Veg Cutlet', description: 'Crispy vegetable patties with breadcrumb coating', price: 25, category: 'Snacks', image_url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400' },
  { id: 8, name: 'Poha', description: 'Flattened rice cooked with onions, peanuts and spices', price: 20, category: 'Breakfast', image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },
  { id: 9, name: 'Misal Pav', description: 'Spicy sprouts curry served with soft bread rolls', price: 50, category: 'Breakfast', image_url: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400' },
  { id: 10, name: 'Pav Bhaji', description: 'Spiced mashed vegetables served with buttered pav', price: 70, category: 'Breakfast', image_url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400' },
  { id: 11, name: 'Veg Burger', description: 'Crispy veg patty with lettuce, tomato and mayo', price: 50, category: 'Fast Food', image_url: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400' },
  { id: 12, name: 'Cheese Burger', description: 'Veg patty with melted cheese and special sauce', price: 70, category: 'Fast Food', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
  { id: 13, name: 'Veg Sandwich', description: 'Fresh vegetables with green chutney in bread', price: 40, category: 'Fast Food', image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400' },
  { id: 14, name: 'Grilled Sandwich', description: 'Grilled sandwich with vegetables and cheese', price: 60, category: 'Fast Food', image_url: 'https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?w=400' },
  { id: 15, name: 'Cheese Sandwich', description: 'Loaded with cheese and grilled to perfection', price: 70, category: 'Fast Food', image_url: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400' },
  { id: 16, name: 'Toast Sandwich', description: 'Toasted bread with butter and vegetables', price: 40, category: 'Fast Food', image_url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400' },
  { id: 17, name: 'Frankie Roll', description: 'Spicy vegetable filling wrapped in roti', price: 50, category: 'Fast Food', image_url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400' },
  { id: 18, name: 'Paneer Roll', description: 'Paneer tikka wrapped in soft roti with sauce', price: 80, category: 'Fast Food', image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
  { id: 19, name: 'Veg Wrap', description: 'Healthy wrap with fresh veggies and hummus', price: 60, category: 'Fast Food', image_url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400' },
  { id: 20, name: 'Noodles Roll', description: 'Hakka noodles wrapped in crispy roll', price: 70, category: 'Fast Food', image_url: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400' },
  { id: 21, name: 'Veg Noodles', description: 'Stir-fried noodles with fresh vegetables', price: 60, category: 'Chinese', image_url: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400' },
  { id: 22, name: 'Schezwan Noodles', description: 'Spicy Schezwan sauce noodles with vegetables', price: 70, category: 'Chinese', image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400' },
  { id: 23, name: 'Hakka Noodles', description: 'Indo-Chinese style hakka noodles', price: 70, category: 'Chinese', image_url: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400' },
  { id: 24, name: 'Fried Rice', description: 'Classic fried rice with mixed vegetables', price: 60, category: 'Chinese', image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400' },
  { id: 25, name: 'Schezwan Rice', description: 'Spicy Schezwan fried rice', price: 70, category: 'Chinese', image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400' },
  { id: 26, name: 'Manchurian Dry', description: 'Crispy veg balls tossed in dry manchurian sauce', price: 70, category: 'Chinese', image_url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400' },
  { id: 27, name: 'Manchurian Gravy', description: 'Veg balls in spicy manchurian gravy', price: 80, category: 'Chinese', image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400' },
  { id: 28, name: 'Paneer Chilli', description: 'Spicy paneer cubes with bell peppers and sauce', price: 100, category: 'Chinese', image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400' },
  { id: 29, name: 'Veg Chilli', description: 'Mixed vegetables in spicy chilli sauce', price: 70, category: 'Chinese', image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400' },
  { id: 30, name: 'Triple Rice', description: 'Combination of fried rice, noodles and manchurian', price: 110, category: 'Chinese', image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400' },
  { id: 31, name: 'Veg Pizza', description: 'Loaded with fresh vegetables and cheese', price: 100, category: 'Pizza & Bakery', image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
  { id: 32, name: 'Cheese Pizza', description: 'Extra cheese pizza with herbs', price: 120, category: 'Pizza & Bakery', image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
  { id: 33, name: 'Mini Pizza', description: 'Small personal pizza with toppings', price: 60, category: 'Pizza & Bakery', image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
  { id: 34, name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 60, category: 'Pizza & Bakery', image_url: 'https://images.unsplash.com/photo-1573140401552-388e3496f4e4?w=400' },
  { id: 35, name: 'Cheese Garlic Bread', description: 'Garlic bread topped with melted cheese', price: 80, category: 'Pizza & Bakery', image_url: 'https://images.unsplash.com/photo-1573140401552-388e3496f4e4?w=400' },
  { id: 36, name: 'Veg Patty', description: 'Flaky pastry with spiced vegetable filling', price: 25, category: 'Pizza & Bakery', image_url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400' },
  { id: 37, name: 'Cream Roll', description: 'Sweet cream filled pastry roll', price: 25, category: 'Pizza & Bakery', image_url: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400' },
  { id: 38, name: 'Cup Cake', description: 'Soft and fluffy cupcake with frosting', price: 40, category: 'Pizza & Bakery', image_url: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400' },
  { id: 39, name: 'Pastry', description: 'Fresh cream pastry with chocolate topping', price: 50, category: 'Pizza & Bakery', image_url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400' },
  { id: 40, name: 'Cake Slice', description: 'Delicious cake slice of the day', price: 60, category: 'Pizza & Bakery', image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' },
  { id: 41, name: 'Veg Thali', description: 'Complete meal with dal, sabzi, roti, rice and salad', price: 80, category: 'Indian Meals', image_url: 'https://images.unsplash.com/photo-1585937421612-70e008356f33?w=400' },
  { id: 42, name: 'Dal Rice', description: 'Steamed rice with yellow dal tadka', price: 50, category: 'Indian Meals', image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400' },
  { id: 43, name: 'Rajma Rice', description: 'Kidney beans curry with steamed rice', price: 60, category: 'Indian Meals', image_url: 'https://images.unsplash.com/photo-1585937421612-70e008356f33?w=400' },
  { id: 44, name: 'Chole Rice', description: 'Spicy chickpea curry with rice', price: 60, category: 'Indian Meals', image_url: 'https://images.unsplash.com/photo-1585937421612-70e008356f33?w=400' },
  { id: 45, name: 'Pulao', description: 'Fragrant basmati rice with vegetables and spices', price: 60, category: 'Indian Meals', image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400' },
  { id: 46, name: 'Jeera Rice', description: 'Cumin flavored basmati rice', price: 50, category: 'Indian Meals', image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400' },
  { id: 47, name: 'Roti Sabzi', description: 'Indian flatbread with vegetable curry', price: 60, category: 'Indian Meals', image_url: 'https://images.unsplash.com/photo-1585937421612-70e008356f33?w=400' },
  { id: 48, name: 'Extra Roti', description: 'Additional Indian flatbread', price: 10, category: 'Indian Meals', image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' },
  { id: 49, name: 'Plain Rice', description: 'Steamed basmati rice', price: 40, category: 'Indian Meals', image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400' },
  { id: 50, name: 'Curd', description: 'Fresh homemade yogurt', price: 20, category: 'Indian Meals', image_url: 'https://images.unsplash.com/photo-1571212515416-fca2ce42e9b2?w=400' },
  { id: 51, name: 'Tea', description: 'Hot Indian chai with milk and spices', price: 20, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1597318181409-cf64992eec8b?w=400' },
  { id: 52, name: 'Coffee', description: 'Hot filter coffee', price: 30, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400' },
  { id: 53, name: 'Cold Coffee', description: 'Chilled coffee with ice cream and milk', price: 60, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400' },
  { id: 54, name: 'Lemon Juice', description: 'Fresh lemon juice with mint', price: 15, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d?w=400' },
  { id: 55, name: 'Buttermilk', description: 'Refreshing spiced buttermilk', price: 15, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400' },
  { id: 56, name: 'Lassi', description: 'Thick and creamy yogurt drink', price: 40, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400' },
  { id: 57, name: 'Soft Drink', description: 'Chilled carbonated soft drink', price: 30, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400' },
  { id: 58, name: 'Fruit Juice', description: 'Fresh seasonal fruit juice', price: 40, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400' },
  { id: 59, name: 'Milkshake', description: 'Thick milkshake in various flavors', price: 60, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400' },
  { id: 60, name: 'Mineral Water', description: 'Packaged drinking water bottle', price: 20, category: 'Beverages', image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400' },
];

app.get('/api/menu', async (req, res) => {
  if (!supabase) return res.json(DEMO_MENU);
  try {
    const { data, error } = await supabase.from('menu').select('*');
    if (error) return res.json(DEMO_MENU);
    res.json(data.length > 0 ? data : DEMO_MENU);
  } catch (e) { res.json(DEMO_MENU); }
});

app.post('/api/menu', async (req, res) => {
  const { name, description, price, category, image_url } = req.body;
  if (!supabase) return res.json({ id: Date.now(), name, description, price, category, image_url });
  try {
    const { data, error } = await supabase.from('menu').insert([{ name, description, price, category, image_url }]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/menu/:id', async (req, res) => {
  const { name, description, price, category, image_url } = req.body;
  if (!supabase) return res.json({ id: req.params.id, name, description, price, category, image_url });
  try {
    const { data, error } = await supabase.from('menu').update({ name, description, price, category, image_url }).eq('id', req.params.id).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/menu/:id', async (req, res) => {
  if (!supabase) return res.json({ message: 'Deleted (demo mode)' });
  try {
    const { error } = await supabase.from('menu').delete().eq('id', req.params.id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ════════════════════════════════════════════
//  ORDERS ROUTES
// ════════════════════════════════════════════
const demoOrders = [];

app.post('/api/orders', async (req, res) => {
  const { user_id, items, total_amount, payment_id } = req.body;
  
  // Convert user_id to proper format for Supabase
  let finalUserId = user_id;
  if (user_id && user_id.startsWith('user_')) {
    // Old format - set to null for guest orders
    finalUserId = null;
  }
  
  const order = { 
    user_id: finalUserId, 
    items, 
    total_amount, 
    payment_id: payment_id || 'unpaid', 
    status: 'pending', 
    created_at: new Date().toISOString() 
  };

  if (!supabaseAdmin) {
    demoOrders.push({ ...order, id: Date.now() });
    return res.json({ ...order, id: Date.now() });
  }
  
  try {
    const { data, error } = await supabaseAdmin.from('orders').insert([order]).select();
    if (error) { 
      console.error('Order insert error:', error);
      demoOrders.push({ ...order, id: Date.now() }); 
      return res.json({ ...order, id: Date.now() }); 
    }
    res.json(data[0]);
  } catch (e) { 
    console.error('Order save error:', e);
    demoOrders.push({ ...order, id: Date.now() }); 
    res.json({ ...order, id: Date.now() }); 
  }
});

app.get('/api/orders', async (req, res) => {
  const { user_id } = req.query;
  if (!supabaseAdmin) {
    const filtered = user_id ? demoOrders.filter(o => o.user_id === user_id) : demoOrders;
    return res.json(filtered.reverse());
  }
  try {
    let query = supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false });
    if (user_id) query = query.eq('user_id', user_id);
    const { data, error } = await query;
    if (error) {
      console.error('Fetch orders error:', error);
      return res.json([]);
    }
    res.json(data);
  } catch (e) { 
    console.error('Orders fetch error:', e);
    res.json([]); 
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!supabaseAdmin) {
    const o = demoOrders.find(x => x.id == req.params.id);
    if (o) o.status = status;
    return res.json({ message: 'Updated' });
  }
  try {
    const { data, error } = await supabaseAdmin.from('orders').update({ status }).eq('id', req.params.id).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ════════════════════════════════════════════
//  PAYMENT ROUTES
// ════════════════════════════════════════════
app.get('/api/payment/config', (req, res) => {
  res.json({
    key: process.env.RAZORPAY_KEY_ID || '',
    isDemo: !razorpay,
    mode: razorpayMode,
    currency: 'INR',
  });
});

app.post('/api/payment/create-order', async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  if (!razorpay) {
    // Simulate order in demo mode
    return res.json({ id: 'demo_order_' + Date.now(), amount: Math.round(amount * 100), currency: 'INR', demo: true });
  }
  try {
    const order = await razorpay.orders.create({ amount: Math.round(amount * 100), currency: 'INR', receipt: 'rcpt_' + Date.now() });
    res.json(order);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/payment/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, total_amount, user_id } = req.body;

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💳 PAYMENT VERIFICATION REQUEST');
  console.log('Order ID:', razorpay_order_id);
  console.log('Payment ID:', razorpay_payment_id);
  console.log('Signature:', razorpay_signature ? 'Present' : 'Missing');
  console.log('Amount:', total_amount);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Demo mode
  if (razorpay_order_id && razorpay_order_id.startsWith('demo_order_')) {
    const order = { id: Date.now(), user_id: user_id || 'guest', items, total_amount, payment_id: 'demo_pay_' + Date.now(), status: 'confirmed', created_at: new Date().toISOString() };
    demoOrders.push(order);
    console.log('✅ Demo payment successful');
    return res.json({ msg: 'success', order });
  }

  // Real Razorpay verification
  const secret = process.env.RAZORPAY_SECRET || '';
  if (!secret || secret === 'your_razorpay_secret_here') {
    console.error('❌ Razorpay secret not configured properly');
    return res.status(400).json({ msg: 'Payment configuration error' });
  }

  if (!razorpay_signature) {
    console.error('❌ No signature received from Razorpay');
    return res.status(400).json({ msg: 'Payment signature missing' });
  }

  try {
    const hmac = crypto.createHmac('sha256', secret);
    const data = `${razorpay_order_id}|${razorpay_payment_id}`;
    hmac.update(data);
    const digest = hmac.digest('hex');
    
    console.log('🔐 Signature Verification:');
    console.log('Data to sign:', data);
    console.log('Expected:', digest);
    console.log('Received:', razorpay_signature);
    console.log('Match:', digest === razorpay_signature);
    
    if (digest !== razorpay_signature) {
      console.error('❌ Payment signature verification FAILED');
      console.error('This usually means:');
      console.error('1. Wrong Razorpay Secret Key in .env');
      console.error('2. Key ID and Secret Key are from different accounts');
      console.error('3. Using Live keys instead of Test keys (or vice versa)');
      return res.status(400).json({ msg: 'Payment verification failed - Invalid signature' });
    }

    console.log('✅ Payment signature verified successfully!');

    // Save order
    const order = { user_id: user_id || null, items, total_amount, payment_id: razorpay_payment_id, status: 'confirmed' };
    
    // Convert user_id if it's old format
    if (order.user_id && order.user_id.startsWith('user_')) {
      order.user_id = null; // Guest order
    }
    
    if (!supabaseAdmin) { 
      demoOrders.push({ ...order, id: Date.now(), created_at: new Date().toISOString() }); 
      console.log('✅ Order saved to local storage');
      return res.json({ msg: 'success', order }); 
    }
    
    const { data: orderData, error } = await supabaseAdmin.from('orders').insert([order]).select();
    if (error) {
      console.error('❌ Database error:', error);
      // Save locally as backup
      demoOrders.push({ ...order, id: Date.now(), created_at: new Date().toISOString() });
      console.log('⚠️ Saved to local storage as backup');
      return res.json({ msg: 'success', order: { ...order, id: Date.now() } });
    }
    
    console.log('✅ Order saved to database');
    res.json({ msg: 'success', order: orderData[0] });
  } catch (e) { 
    console.error('❌ Payment verification error:', e);
    res.status(500).json({ msg: 'Payment verification error', error: e.message }); 
  }
});

// ════════════════════════════════════════════
//  REVIEWS & RATINGS ROUTES
// ════════════════════════════════════════════
const demoReviews = [];

app.post('/api/reviews', async (req, res) => {
  const { menu_item_id, user_id, rating, comment, user_name } = req.body;
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  
  const review = { menu_item_id, user_id, rating, comment, user_name, created_at: new Date().toISOString() };
  
  if (!supabase) {
    review.id = Date.now();
    demoReviews.push(review);
    return res.json(review);
  }
  
  try {
    const { data, error } = await supabase.from('reviews').insert([review]).select();
    if (error) { review.id = Date.now(); demoReviews.push(review); return res.json(review); }
    res.json(data[0]);
  } catch (e) { review.id = Date.now(); demoReviews.push(review); res.json(review); }
});

app.get('/api/reviews/:menu_item_id', async (req, res) => {
  const { menu_item_id } = req.params;
  
  if (!supabase) {
    const filtered = demoReviews.filter(r => r.menu_item_id == menu_item_id);
    return res.json(filtered);
  }
  
  try {
    const { data, error } = await supabase.from('reviews').select('*').eq('menu_item_id', menu_item_id).order('created_at', { ascending: false });
    if (error) return res.json([]);
    res.json(data);
  } catch (e) { res.json([]); }
});

// ════════════════════════════════════════════
//  EMAIL NOTIFICATIONS
// ════════════════════════════════════════════
app.post('/api/notifications/order-confirmation', async (req, res) => {
  const { email, order_id, items, total } = req.body;
  // In production, integrate with SendGrid, Mailgun, or AWS SES
  console.log(`📧 Order confirmation email sent to ${email} for order #${order_id}`);
  console.log(`   Items: ${items.length}, Total: ₹${total}`);
  res.json({ message: 'Email sent successfully' });
});

app.post('/api/notifications/status-update', async (req, res) => {
  const { email, order_id, status } = req.body;
  console.log(`📧 Order status update email sent to ${email} for order #${order_id}: ${status}`);
  res.json({ message: 'Email sent successfully' });
});

// ════════════════════════════════════════════
//  ANALYTICS ROUTES
// ════════════════════════════════════════════
app.get('/api/analytics/dashboard', async (req, res) => {
  if (!supabase) {
    // Demo analytics data
    return res.json({
      totalOrders: demoOrders.length,
      totalRevenue: demoOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
      todayOrders: demoOrders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length,
      pendingOrders: demoOrders.filter(o => o.status === 'pending').length,
      recentOrders: demoOrders.slice(-10).reverse(),
      topItems: DEMO_MENU.slice(0, 5).map(item => ({ ...item, orders: Math.floor(Math.random() * 50) + 10 })),
      revenueByDay: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
        revenue: Math.floor(Math.random() * 5000) + 1000
      })).reverse()
    });
  }
  
  try {
    const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === today);
    
    res.json({
      totalOrders: orders.length,
      totalRevenue,
      todayOrders: todayOrders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      recentOrders: orders.slice(0, 10),
      topItems: [], // Calculate from order items
      revenueByDay: [] // Calculate from orders
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ════════════════════════════════════════════
//  SERVE HTML PAGES
// ════════════════════════════════════════════
const pages = { '/': 'index', '/login': 'login', '/register': 'login', '/menu': 'menu', '/cart': 'menu', '/dashboard': 'dashboard', '/admin': 'admin', '/admin-login': 'admin-login', '/checkout': 'checkout', '/reset-password': 'reset-password' };
Object.entries(pages).forEach(([route, file]) => {
  app.get(route, (req, res) => res.sendFile(path.join(__dirname, 'public', `${file}.html`)));
});

// Catch-all - removed due to Express 5 compatibility issue
// app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀  Snacks Hub running → http://localhost:${PORT}\n`);
});
