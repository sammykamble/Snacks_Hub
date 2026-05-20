// ═══════════════════════════════════════════════════════════
// ADVANCED FEATURES FOR SNACKS HUB
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// 1. MULTI-LANGUAGE SUPPORT
// ═══════════════════════════════════════════════════════════

const translations = {
  en: {
    welcome: "Welcome",
    menu: "Menu",
    cart: "Cart",
    checkout: "Checkout",
    login: "Login",
    register: "Sign Up",
    search: "Search for food, dishes...",
    addToCart: "Add",
    total: "Total",
    orderNow: "Order Now",
    myOrders: "My Orders",
    logout: "Logout",
    categories: "What's on your mind?",
    popular: "Popular right now",
    viewAll: "View all",
    emptyCart: "Your cart is empty",
    browseMenu: "Browse Menu",
    subtotal: "Subtotal",
    deliveryFee: "Delivery fee",
    taxes: "Taxes (5%)",
    proceedToCheckout: "Proceed to Checkout",
    reorder: "Reorder",
    orderPlaced: "Order Placed",
    preparing: "Preparing",
    ready: "Ready",
    delivered: "Delivered"
  },
  hi: {
    welcome: "स्वागत है",
    menu: "मेनू",
    cart: "कार्ट",
    checkout: "चेकआउट",
    login: "लॉगिन",
    register: "साइन अप",
    search: "खाना खोजें...",
    addToCart: "जोड़ें",
    total: "कुल",
    orderNow: "अभी ऑर्डर करें",
    myOrders: "मेरे ऑर्डर",
    logout: "लॉगआउट",
    categories: "आप क्या चाहते हैं?",
    popular: "अभी लोकप्रिय",
    viewAll: "सभी देखें",
    emptyCart: "आपकी कार्ट खाली है",
    browseMenu: "मेनू देखें",
    subtotal: "उप-योग",
    deliveryFee: "डिलीवरी शुल्क",
    taxes: "कर (5%)",
    proceedToCheckout: "चेकआउट पर जाएं",
    reorder: "फिर से ऑर्डर करें",
    orderPlaced: "ऑर्डर दिया गया",
    preparing: "तैयार हो रहा है",
    ready: "तैयार",
    delivered: "डिलीवर किया गया"
  },
  es: {
    welcome: "Bienvenido",
    menu: "Menú",
    cart: "Carrito",
    checkout: "Pagar",
    login: "Iniciar sesión",
    register: "Registrarse",
    search: "Buscar comida...",
    addToCart: "Añadir",
    total: "Total",
    orderNow: "Ordenar ahora",
    myOrders: "Mis pedidos",
    logout: "Cerrar sesión",
    categories: "¿Qué te apetece?",
    popular: "Popular ahora",
    viewAll: "Ver todo",
    emptyCart: "Tu carrito está vacío",
    browseMenu: "Ver menú",
    subtotal: "Subtotal",
    deliveryFee: "Tarifa de entrega",
    taxes: "Impuestos (5%)",
    proceedToCheckout: "Proceder al pago",
    reorder: "Reordenar",
    orderPlaced: "Pedido realizado",
    preparing: "Preparando",
    ready: "Listo",
    delivered: "Entregado"
  }
};

let currentLanguage = localStorage.getItem('language') || 'en';

function initLanguageSupport() {
  // Create language selector
  const langSelector = document.createElement('div');
  langSelector.className = 'language-selector';
  langSelector.innerHTML = `
    <button class="lang-btn" onclick="changeLanguage('en')" title="English">🇬🇧 EN</button>
    <button class="lang-btn" onclick="changeLanguage('hi')" title="हिंदी">🇮🇳 HI</button>
    <button class="lang-btn" onclick="changeLanguage('es')" title="Español">🇪🇸 ES</button>
  `;
  
  // Add to navigation
  const navActions = document.querySelector('.nav-actions');
  if (navActions) {
    navActions.insertBefore(langSelector, navActions.firstChild);
  }
  
  // Apply saved language
  applyLanguage(currentLanguage);
}

function changeLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  applyLanguage(lang);
  console.log(`✅ Language changed to ${lang.toUpperCase()}`);
  showToast(`Language changed to ${lang.toUpperCase()}`);
}

function applyLanguage(lang) {
  const t = translations[lang] || translations.en;
  
  // Update navigation elements
  const navSearch = document.getElementById('navSearch');
  if (navSearch) navSearch.placeholder = t.search;
  
  const heroSearch = document.getElementById('heroSearch');
  if (heroSearch) heroSearch.placeholder = t.search;
  
  // Update cart button
  const cartBtn = document.querySelector('.cart-btn span:not(.ms):not(.cart-badge)');
  if (cartBtn) cartBtn.textContent = t.cart;
  
  // Update login/register buttons
  const loginBtn = document.querySelector('#guestBtns a[href="/login"] button');
  if (loginBtn) loginBtn.textContent = t.login;
  
  const registerBtn = document.querySelector('#guestBtns a[href="/login#register"] button');
  if (registerBtn) registerBtn.textContent = t.register;
  
  // Update user dropdown
  const myOrdersLink = document.querySelector('.user-dropdown a[href="/dashboard"]');
  if (myOrdersLink) {
    const textNode = Array.from(myOrdersLink.childNodes).find(node => node.nodeType === 3);
    if (textNode) textNode.textContent = t.myOrders;
  }
  
  const browseMenuLink = document.querySelector('.user-dropdown a[href="/menu"]');
  if (browseMenuLink) {
    const textNode = Array.from(browseMenuLink.childNodes).find(node => node.nodeType === 3);
    if (textNode) textNode.textContent = t.browseMenu;
  }
  
  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    const textNode = Array.from(logoutLink.childNodes).find(node => node.nodeType === 3);
    if (textNode) textNode.textContent = t.logout;
  }
  
  // Update section titles
  const sectionTitles = document.querySelectorAll('.section-title');
  sectionTitles.forEach(title => {
    if (title.textContent.includes("What's on your mind")) {
      title.textContent = t.categories;
    } else if (title.textContent.includes('Popular')) {
      title.textContent = `🔥 ${t.popular}`;
    }
  });
  
  // Update "See all" links
  document.querySelectorAll('.see-all').forEach(link => {
    if (link.textContent.includes('See all') || link.textContent.includes('View all')) {
      const arrow = link.querySelector('.ms');
      link.innerHTML = `${t.viewAll} ${arrow ? arrow.outerHTML : ''}`;
    }
  });
  
  // Update cart drawer
  const cartHead = document.querySelector('.cart-head h2');
  if (cartHead) cartHead.textContent = `🛒 ${t.cart}`;
  
  const emptyCartText = document.querySelector('.cart-empty-state h3');
  if (emptyCartText) emptyCartText.textContent = t.emptyCart;
  
  const browseMenuBtn = document.querySelector('.cart-empty-state button');
  if (browseMenuBtn) browseMenuBtn.textContent = t.browseMenu;
  
  // Update cart footer labels
  const cartRows = document.querySelectorAll('.cart-row');
  cartRows.forEach(row => {
    const label = row.querySelector('span:first-child');
    if (label) {
      if (label.textContent.includes('Subtotal')) label.textContent = t.subtotal;
      else if (label.textContent.includes('Delivery')) label.textContent = t.deliveryFee;
      else if (label.textContent.includes('Taxes')) label.textContent = t.taxes;
      else if (label.textContent.includes('Total')) label.textContent = t.total;
    }
  });
  
  const checkoutBtn = document.querySelector('.go-checkout-btn span:first-child');
  if (checkoutBtn) checkoutBtn.textContent = t.proceedToCheckout;
  
  // Highlight active language button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.querySelector(`.lang-btn[onclick*="${lang}"]`);
  if (activeBtn) activeBtn.classList.add('active');
  
  // Update "Add to Cart" buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    const textSpan = Array.from(btn.childNodes).find(node => node.nodeType === 3 || (node.nodeType === 1 && !node.classList.contains('ms')));
    if (textSpan && textSpan.nodeType === 3) {
      textSpan.textContent = t.addToCart.replace('Add to Cart', 'Add');
    }
  });
}

function t(key) {
  return translations[currentLanguage][key] || key;
}

// ═══════════════════════════════════════════════════════════
// 2. SOCIAL SHARING
// ═══════════════════════════════════════════════════════════

function shareOnSocial(itemId, platform) {
  let item = null;
  if (typeof allItems !== 'undefined') {
    item = allItems.find(i => i.id === itemId);
  }
  if (!item) return;

  const url = window.location.origin;
  const text = `Check out ${item.name} at Snacks Hub! Only ₹${item.price}`;
  
  let shareUrl = '';
  
  if (platform === 'whatsapp') {
    shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
  }
  
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
}

function addShareButtons(itemId) {
  const item = allItems.find(i => i.id === itemId);
  if (!item) return;
  
  const modal = document.createElement('div');
  modal.className = 'share-modal-overlay';
  modal.innerHTML = `
    <div class="share-modal">
      <div class="share-modal-header">
        <h3>Share ${item.name}</h3>
        <button onclick="this.closest('.share-modal-overlay').remove()">✕</button>
      </div>
      <div class="share-modal-body">
        <img src="${item.image_url}" alt="${item.name}" style="width:100%;border-radius:12px;margin-bottom:16px">
        <p style="color:var(--gray);margin-bottom:20px">${item.description}</p>
        <div class="share-buttons">
          <button class="share-btn whatsapp" onclick="shareOnSocial(${item.id}, 'whatsapp')">
            <span style="font-size:24px">📱</span> WhatsApp
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════════════════════════
// 3. MEAL CUSTOMIZATION
// ═══════════════════════════════════════════════════════════

const customizationOptions = {
  toppings: [
    { name: 'Extra Cheese', price: 1.50 },
    { name: 'Bacon', price: 2.00 },
    { name: 'Mushrooms', price: 1.00 },
    { name: 'Olives', price: 1.00 },
    { name: 'Jalapeños', price: 0.75 },
    { name: 'Onions', price: 0.50 }
  ],
  remove: [
    'No Onions',
    'No Tomatoes',
    'No Lettuce',
    'No Pickles',
    'No Sauce'
  ],
  spiceLevel: ['Mild', 'Medium', 'Spicy', 'Extra Spicy'],
  size: [
    { name: 'Small', multiplier: 0.8 },
    { name: 'Regular', multiplier: 1.0 },
    { name: 'Large', multiplier: 1.3 }
  ]
};

function openCustomization(item) {
  const modal = document.createElement('div');
  modal.className = 'customize-modal-overlay';
  modal.innerHTML = `
    <div class="customize-modal">
      <div class="customize-header">
        <h3>Customize ${item.name}</h3>
        <button onclick="this.closest('.customize-modal-overlay').remove()">✕</button>
      </div>
      <div class="customize-body">
        <img src="${item.image_url}" alt="${item.name}" style="width:100%;border-radius:12px;margin-bottom:16px">
        
        <!-- Size Selection -->
        <div class="customize-section">
          <h4>Size</h4>
          <div class="size-options">
            ${customizationOptions.size.map(s => `
              <label class="size-option">
                <input type="radio" name="size" value="${s.multiplier}" ${s.multiplier === 1.0 ? 'checked' : ''}>
                <span>${s.name}</span>
              </label>
            `).join('')}
          </div>
        </div>
        
        <!-- Toppings -->
        <div class="customize-section">
          <h4>Add Toppings</h4>
          <div class="toppings-grid">
            ${customizationOptions.toppings.map((t, i) => `
              <label class="topping-option">
                <input type="checkbox" name="topping" value="${i}">
                <span>${t.name} (+₹${t.price})</span>
              </label>
            `).join('')}
          </div>
        </div>
        
        <!-- Remove Items -->
        <div class="customize-section">
          <h4>Remove</h4>
          <div class="remove-grid">
            ${customizationOptions.remove.map(r => `
              <label class="remove-option">
                <input type="checkbox" name="remove" value="${r}">
                <span>${r}</span>
              </label>
            `).join('')}
          </div>
        </div>
        
        <!-- Spice Level -->
        <div class="customize-section">
          <h4>Spice Level</h4>
          <select class="spice-select" name="spice">
            ${customizationOptions.spiceLevel.map(s => `<option value="${s}">${s}</option>`).join('')}
          </select>
        </div>
        
        <!-- Special Instructions -->
        <div class="customize-section">
          <h4>Special Instructions</h4>
          <textarea class="special-instructions" placeholder="Any special requests?"></textarea>
        </div>
        
        <!-- Price and Add Button -->
        <div class="customize-footer">
          <div class="custom-price">
            <span>Total:</span>
            <span id="customPrice">₹${item.price.toFixed(2)}</span>
          </div>
          <button class="add-custom-btn" onclick="addCustomizedItem(${item.id})">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  // Update price on changes
  modal.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('change', () => updateCustomPrice(item.price));
  });
}

function updateCustomPrice(basePrice) {
  let total = basePrice;
  
  // Size multiplier
  const size = document.querySelector('input[name="size"]:checked');
  if (size) total *= parseFloat(size.value);
  
  // Toppings
  document.querySelectorAll('input[name="topping"]:checked').forEach(el => {
    const topping = customizationOptions.toppings[parseInt(el.value)];
    total += topping.price;
  });
  
  document.getElementById('customPrice').textContent = `₹${total.toFixed(2)}`;
}

function addCustomizedItem(itemId) {
  const item = allItems.find(i => i.id === itemId);
  if (!item) return;
  
  const modal = document.querySelector('.customize-modal-overlay');
  
  // Collect customizations
  const size = document.querySelector('input[name="size"]:checked');
  const toppings = Array.from(document.querySelectorAll('input[name="topping"]:checked'))
    .map(el => customizationOptions.toppings[parseInt(el.value)].name);
  const remove = Array.from(document.querySelectorAll('input[name="remove"]:checked'))
    .map(el => el.value);
  const spice = document.querySelector('.spice-select').value;
  const instructions = document.querySelector('.special-instructions').value;
  
  // Calculate final price
  let finalPrice = item.price * parseFloat(size.value);
  document.querySelectorAll('input[name="topping"]:checked').forEach(el => {
    finalPrice += customizationOptions.toppings[parseInt(el.value)].price;
  });
  
  // Create customized item
  const customItem = {
    ...item,
    price: finalPrice,
    customizations: {
      size: size.nextElementSibling.textContent,
      toppings,
      remove,
      spice,
      instructions
    }
  };
  
  Cart.add(customItem);
  modal.remove();
  openCart();
}

// ═══════════════════════════════════════════════════════════
// 4. GROUP ORDERS
// ═══════════════════════════════════════════════════════════

function createGroupOrder() {
  const groupId = 'group_' + Date.now();
  const groupUrl = `${window.location.origin}?group=${groupId}`;
  
  localStorage.setItem(`group_${groupId}`, JSON.stringify({
    id: groupId,
    creator: sess?.user?.email || 'Guest',
    created_at: new Date().toISOString(),
    participants: [],
    items: []
  }));
  
  const modal = document.createElement('div');
  modal.className = 'group-modal-overlay';
  modal.innerHTML = `
    <div class="group-modal">
      <div class="group-header">
        <h3>🎉 Group Order Created!</h3>
        <button onclick="this.closest('.group-modal-overlay').remove()">✕</button>
      </div>
      <div class="group-body">
        <p style="margin-bottom:16px">Share this link with your friends to order together:</p>
        <div class="group-link-box">
          <input type="text" value="${groupUrl}" readonly id="groupLink">
          <button onclick="copyGroupLink()">📋 Copy</button>
        </div>
        <div class="share-buttons" style="margin-top:20px">
          <button class="share-btn whatsapp" onclick="shareGroupOrder('whatsapp', '${groupUrl}')">
            📱 WhatsApp
          </button>
        </div>
        <button class="view-group-btn" onclick="viewGroupOrder('${groupId}')">
          View Group Order
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function copyGroupLink() {
  const input = document.getElementById('groupLink');
  input.select();
  navigator.clipboard.writeText(input.value);
  showToast('✅ Link copied!');
}

function shareGroupOrder(platform, url) {
  const text = 'Join my group order at Snacks Hub! 🍕';
  let shareUrl = '';
  
  if (platform === 'whatsapp') {
    shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
  }
  
  window.open(shareUrl, '_blank');
}

function viewGroupOrder(groupId) {
  window.location.href = `/?group=${groupId}`;
}

// Check if joining a group order
function checkGroupOrder() {
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get('group');
  
  if (groupId) {
    const group = JSON.parse(localStorage.getItem(`group_${groupId}`) || 'null');
    if (group) {
      showToast(`🎉 Joined group order!`);
      // Show group order UI
      showGroupOrderUI(group);
    }
  }
}

function showGroupOrderUI(group) {
  const banner = document.createElement('div');
  banner.className = 'group-order-banner';
  banner.innerHTML = `
    <div class="group-banner-content">
      <span>🎉 Group Order Active</span>
      <span>${group.participants.length} participants</span>
      <button onclick="viewGroupDetails('${group.id}')">View Details</button>
    </div>
  `;
  document.body.insertBefore(banner, document.body.firstChild);
}

// ═══════════════════════════════════════════════════════════
// 5. ANALYTICS DASHBOARD
// ═══════════════════════════════════════════════════════════

function generateAnalytics() {
  const orders = getOrderHistory();
  
  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Popular items
  const itemCounts = {};
  orders.forEach(order => {
    if (order.items) {
      order.items.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.qty;
      });
    }
  });
  
  const popularItems = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  // Orders by status
  const statusCounts = {
    pending: 0,
    confirmed: 0,
    delivered: 0
  };
  orders.forEach(o => {
    statusCounts[o.status || 'pending']++;
  });
  
  // Revenue by day (last 7 days)
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOrders = orders.filter(o => o.created_at?.startsWith(dateStr));
    const dayRevenue = dayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    last7Days.push({
      date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      revenue: dayRevenue,
      orders: dayOrders.length
    });
  }
  
  return {
    totalOrders,
    totalRevenue,
    avgOrderValue,
    popularItems,
    statusCounts,
    last7Days
  };
}

function showAnalyticsDashboard() {
  const analytics = generateAnalytics();
  
  const modal = document.createElement('div');
  modal.className = 'analytics-modal-overlay';
  modal.innerHTML = `
    <div class="analytics-modal">
      <div class="analytics-header">
        <h3>📊 Analytics Dashboard</h3>
        <button onclick="this.closest('.analytics-modal-overlay').remove()">✕</button>
      </div>
      <div class="analytics-body">
        <!-- Key Metrics -->
        <div class="analytics-metrics">
          <div class="metric-card">
            <div class="metric-icon">📦</div>
            <div class="metric-value">${analytics.totalOrders}</div>
            <div class="metric-label">Total Orders</div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">💰</div>
            <div class="metric-value">₹${analytics.totalRevenue.toFixed(2)}</div>
            <div class="metric-label">Total Revenue</div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">📈</div>
            <div class="metric-value">₹${analytics.avgOrderValue.toFixed(2)}</div>
            <div class="metric-label">Avg Order Value</div>
          </div>
        </div>
        
        <!-- Popular Items -->
        <div class="analytics-section">
          <h4>🔥 Top 5 Popular Items</h4>
          <div class="popular-items-list">
            ${analytics.popularItems.map((item, i) => `
              <div class="popular-item">
                <span class="rank">#${i + 1}</span>
                <span class="item-name">${item[0]}</span>
                <span class="item-count">${item[1]} orders</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- Orders by Status -->
        <div class="analytics-section">
          <h4>📊 Orders by Status</h4>
          <div class="status-chart">
            <div class="status-bar">
              <div class="status-segment pending" style="width:${(analytics.statusCounts.pending/analytics.totalOrders*100)}%">
                ${analytics.statusCounts.pending}
              </div>
              <div class="status-segment confirmed" style="width:${(analytics.statusCounts.confirmed/analytics.totalOrders*100)}%">
                ${analytics.statusCounts.confirmed}
              </div>
              <div class="status-segment delivered" style="width:${(analytics.statusCounts.delivered/analytics.totalOrders*100)}%">
                ${analytics.statusCounts.delivered}
              </div>
            </div>
            <div class="status-legend">
              <span><span class="legend-dot pending"></span> Pending: ${analytics.statusCounts.pending}</span>
              <span><span class="legend-dot confirmed"></span> Confirmed: ${analytics.statusCounts.confirmed}</span>
              <span><span class="legend-dot delivered"></span> Delivered: ${analytics.statusCounts.delivered}</span>
            </div>
          </div>
        </div>
        
        <!-- Revenue Chart -->
        <div class="analytics-section">
          <h4>📈 Last 7 Days Revenue</h4>
          <div class="revenue-chart">
            ${analytics.last7Days.map(day => `
              <div class="chart-bar">
                <div class="bar" style="height:${day.revenue > 0 ? (day.revenue / Math.max(...analytics.last7Days.map(d => d.revenue)) * 100) : 5}%">
                  <span class="bar-value">₹${day.revenue.toFixed(0)}</span>
                </div>
                <div class="bar-label">${day.date}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════════════════════════
// INITIALIZE ALL ADVANCED FEATURES
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    initLanguageSupport();
    checkGroupOrder();
    
    // Add buttons to navigation
    addAdvancedButtons();
  }, 1000);
});

function addAdvancedButtons() {
  const navActions = document.querySelector('.nav-actions');
  if (!navActions) return;
  
  // Add Group Order button
  const groupBtn = document.createElement('button');
  groupBtn.className = 'nav-btn btn-outline';
  groupBtn.innerHTML = '👥 Group Order';
  groupBtn.onclick = createGroupOrder;
  groupBtn.style.display = 'none'; // Show only when logged in
  
  // Add Analytics button (for admin)
  const analyticsBtn = document.createElement('button');
  analyticsBtn.className = 'nav-btn btn-outline';
  analyticsBtn.innerHTML = '📊 Analytics';
  analyticsBtn.onclick = showAnalyticsDashboard;
  analyticsBtn.style.display = 'none'; // Show only for admin
  
  // Check if user is logged in
  const sess = JSON.parse(localStorage.getItem('sh_session') || 'null');
  if (sess?.user) {
    groupBtn.style.display = 'flex';
    analyticsBtn.style.display = 'flex';
  }
}

// Export functions
window.changeLanguage = changeLanguage;
window.shareOnSocial = shareOnSocial;
window.addShareButtons = addShareButtons;
window.openCustomization = openCustomization;
window.addCustomizedItem = addCustomizedItem;
window.createGroupOrder = createGroupOrder;
window.copyGroupLink = copyGroupLink;
window.shareGroupOrder = shareGroupOrder;
window.viewGroupOrder = viewGroupOrder;
// ═══════════════════════════════════════════════════════════
// 6. WISHLIST / FAVORITES
// ═══════════════════════════════════════════════════════════

window.Wishlist = {
  get() {
    return JSON.parse(localStorage.getItem('sh_wishlist') || '[]');
  },
  save(list) {
    localStorage.setItem('sh_wishlist', JSON.stringify(list));
  },
  has(itemId) {
    return this.get().includes(itemId);
  },
  toggle(btn, itemId) {
    const list = this.get();
    if (list.includes(itemId)) {
      this.save(list.filter(id => id !== itemId));
      if (btn) btn.classList.remove('liked');
      if (typeof showToast === 'function') showToast('💔 Removed from wishlist');
    } else {
      list.push(itemId);
      this.save(list);
      if (btn) btn.classList.add('liked');
      if (typeof showToast === 'function') showToast('❤️ Added to wishlist!');
    }
    // Update any open wishlist UI if needed
    if (document.getElementById('wishlistDrawer')?.classList.contains('open')) {
      openWishlist();
    }
  }
};

window.toggleWish = function(btn, itemId) {
  if (itemId) {
    Wishlist.toggle(btn, itemId);
  } else {
    // Fallback for old code
    btn.classList.toggle('liked'); 
    if (typeof showToast === 'function') showToast(btn.classList.contains('liked') ? '❤️ Added to wishlist!' : '💔 Removed from wishlist');
  }
};

function openWishlist() {
  let drawer = document.getElementById('wishlistDrawer');
  let overlay = document.getElementById('wishlistOverlay');
  
  if (!drawer) {
    overlay = document.createElement('div');
    overlay.className = 'cart-overlay';
    overlay.id = 'wishlistOverlay';
    overlay.onclick = closeWishlist;
    
    drawer = document.createElement('div');
    drawer.id = 'wishlistDrawer';
    drawer.innerHTML = `
      <div class="cart-head">
        <h2>❤️ My Favorites</h2>
        <button class="cart-close-btn" onclick="closeWishlist()"><span class="ms" style="font-family:'Material Symbols Outlined'">close</span></button>
      </div>
      <div class="cart-body" id="wishlistBody"></div>
    `;
    
    // Add simple styles
    const style = document.createElement('style');
    style.innerHTML = `
      #wishlistDrawer { position:fixed; top:0; right:-450px; width:100%; max-width:420px; height:100vh; background:#fff; z-index:600; box-shadow:-10px 0 48px rgba(0,0,0,.18); display:flex; flex-direction:column; transition:right .35s cubic-bezier(.4,0,.2,1); }
      #wishlistDrawer.open { right:0; }
      #wishlistOverlay { z-index:550; }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
  }
  
  const list = Wishlist.get();
  const body = document.getElementById('wishlistBody');
  
  if (list.length === 0) {
    body.innerHTML = `
      <div class="cart-empty-state">
        <span class="ms" style="font-family:'Material Symbols Outlined'; font-size:72px; opacity:0.3">favorite</span>
        <h3 style="font-family:'Plus Jakarta Sans',sans-serif; font-size:20px; font-weight:800; color:var(--dark)">Your wishlist is empty</h3>
        <p>Save your favorite items here!</p>
        <button onclick="closeWishlist()" style="background:var(--red); color:#fff; border:none; border-radius:10px; padding:12px 24px; font-weight:700; cursor:pointer; margin-top:8px;">Browse Menu</button>
      </div>`;
  } else {
    // If allItems is available
    if (typeof allItems !== 'undefined' && allItems.length > 0) {
      const items = allItems.filter(i => list.includes(i.id));
      body.innerHTML = items.map(i => `
        <div class="cart-item">
          <img class="cart-item-img" src="${i.image_url}" onerror="this.src='https://via.placeholder.com/70'">
          <div class="cart-item-info">
            <div class="cart-item-name">${i.name}</div>
            <div class="cart-item-price">₹${parseFloat(i.price).toFixed(2)}</div>
            <button onclick="Cart.add({id:${i.id},name:'${i.name.replace(/'/g,"\\'")}',price:${i.price},image_url:'${i.image_url}'})" style="background:var(--red); color:#fff; border:none; border-radius:6px; padding:6px 12px; font-weight:700; cursor:pointer; margin-top:8px; font-size: 12px">Add to Cart</button>
          </div>
          <button class="cart-del-btn" onclick="Wishlist.toggle(null, ${i.id})"><span class="ms" style="font-family:'Material Symbols Outlined'">delete</span></button>
        </div>
      `).join('');
    } else {
      // Need to fetch items if allItems isn't populated (e.g. on dashboard)
      fetch('/api/menu').then(r => r.json()).then(data => {
        window.allItems = data; // Cache it
        openWishlist(); // Re-render
      });
      body.innerHTML = '<p style="padding: 20px; text-align: center">Loading favorites...</p>';
      return;
    }
  }
  
  overlay.classList.add('show');
  drawer.classList.add('open');
}

function closeWishlist() {
  document.getElementById('wishlistDrawer')?.classList.remove('open');
  document.getElementById('wishlistOverlay')?.classList.remove('show');
}
window.openWishlist = openWishlist;
window.closeWishlist = closeWishlist;
