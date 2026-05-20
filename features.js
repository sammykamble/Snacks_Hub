// ═══════════════════════════════════════════════════════════
// DARK MODE FUNCTIONALITY
// ═══════════════════════════════════════════════════════════

function initDarkMode() {
  // Check saved preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    updateDarkModeIcon();
  }
  
  // Create dark mode toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'dark-mode-toggle';
  toggleBtn.id = 'darkModeToggle';
  toggleBtn.innerHTML = '<span class="ms">🌙</span>';
  toggleBtn.onclick = toggleDarkMode;
  toggleBtn.title = 'Toggle Dark Mode';
  document.body.appendChild(toggleBtn);
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateDarkModeIcon();
  
  // Show toast
  showToast(isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
}

function updateDarkModeIcon() {
  const btn = document.getElementById('darkModeToggle');
  if (btn) {
    const isDark = document.body.classList.contains('dark-mode');
    // Just show icon, no text
    btn.innerHTML = `<span class="ms">${isDark ? '☀️' : '🌙'}</span>`;
  }
}

// ═══════════════════════════════════════════════════════════
// SEARCH AUTOCOMPLETE FUNCTIONALITY
// ═══════════════════════════════════════════════════════════

let autocompleteTimeout;

function initSearchAutocomplete() {
  const navSearch = document.getElementById('navSearch');
  if (!navSearch) return;
  
  // Create autocomplete dropdown
  const dropdown = document.createElement('div');
  dropdown.className = 'search-autocomplete';
  dropdown.id = 'searchAutocomplete';
  navSearch.parentElement.appendChild(dropdown);
  
  // Add input event listener
  navSearch.addEventListener('input', handleSearchInput);
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!navSearch.parentElement.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });
}

function handleSearchInput(e) {
  const query = e.target.value.trim().toLowerCase();
  const dropdown = document.getElementById('searchAutocomplete');
  
  // Clear previous timeout
  clearTimeout(autocompleteTimeout);
  
  if (!query) {
    dropdown.classList.remove('show');
    return;
  }
  
  // Debounce search
  autocompleteTimeout = setTimeout(() => {
    searchAndShowResults(query, dropdown);
  }, 300);
}

function searchAndShowResults(query, dropdown) {
  // Filter menu items
  const results = allItems.filter(item => 
    item.name.toLowerCase().includes(query) ||
    (item.description && item.description.toLowerCase().includes(query)) ||
    item.category.toLowerCase().includes(query)
  ).slice(0, 5); // Limit to 5 results
  
  if (results.length === 0) {
    dropdown.innerHTML = '<div class="search-no-results">No items found. Try searching for burgers, drinks, or snacks!</div>';
    dropdown.classList.add('show');
    return;
  }
  
  // Render results
  dropdown.innerHTML = results.map(item => `
    <div class="search-autocomplete-item" onclick="selectSearchItem(${item.id})">
      <img src="${item.image_url}" onerror="this.src='https://via.placeholder.com/50'" alt="${item.name}">
      <div class="search-autocomplete-item-info">
        <div class="search-autocomplete-item-name">${highlightMatch(item.name, query)}</div>
        <div class="search-autocomplete-item-category">${item.category}</div>
      </div>
      <div class="search-autocomplete-item-price">₹${parseFloat(item.price).toFixed(2)}</div>
    </div>
  `).join('');
  
  dropdown.classList.add('show');
}

function highlightMatch(text, query) {
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<strong style="color:var(--red)">$1</strong>');
}

function selectSearchItem(itemId) {
  const item = allItems.find(i => i.id === itemId);
  if (item) {
    // Add to cart
    Cart.add(item);
    
    // Clear search
    const navSearch = document.getElementById('navSearch');
    if (navSearch) navSearch.value = '';
    
    // Hide dropdown
    const dropdown = document.getElementById('searchAutocomplete');
    if (dropdown) dropdown.classList.remove('show');
    
    // Open cart
    openCart();
  }
}

// ═══════════════════════════════════════════════════════════
// ORDER HISTORY WITH REORDER FUNCTIONALITY
// ═══════════════════════════════════════════════════════════

// Get order history from localStorage or Supabase
function getOrderHistory() {
  // Try to get from localStorage first (for demo)
  const localOrders = JSON.parse(localStorage.getItem('sh_order_history') || '[]');
  return localOrders;
}

// Save order to history
function saveOrderToHistory(order) {
  const history = getOrderHistory();
  history.unshift(order); // Add to beginning
  localStorage.setItem('sh_order_history', JSON.stringify(history.slice(0, 20))); // Keep last 20 orders
}

// Reorder function
function reorderItems(orderId) {
  const history = getOrderHistory();
  const order = history.find(o => o.id === orderId);
  
  if (!order || !order.items) {
    showToast('❌ Order not found');
    return;
  }
  
  // Clear current cart
  Cart.save([]);
  
  // Add all items from previous order to cart
  order.items.forEach(item => {
    for (let i = 0; i < item.qty; i++) {
      Cart.add({
        id: item.id,
        name: item.name,
        price: item.price,
        image_url: item.image_url
      });
    }
  });
  
  showToast(`✅ ${order.items.length} items added to cart!`);
  openCart();
}

// Enhanced checkout to save order history
const originalCheckout = window.checkout || function() {};
window.checkout = function() {
  const cart = Cart.get();
  if (cart.length === 0) return;
  
  // Create order object
  const order = {
    id: Date.now(),
    items: cart,
    total_amount: Cart.subtotal() + 15 + (Cart.subtotal() * 0.05),
    status: 'pending',
    created_at: new Date().toISOString()
  };
  
  // Save to history
  saveOrderToHistory(order);
  
  // Call original checkout if exists
  originalCheckout();
};

// ═══════════════════════════════════════════════════════════
// INITIALIZE ALL FEATURES
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for main scripts to load
  setTimeout(() => {
    initDarkMode();
    initSearchAutocomplete();
  }, 500);
});

// Export functions for use in other scripts
window.toggleDarkMode = toggleDarkMode;
window.reorderItems = reorderItems;
window.getOrderHistory = getOrderHistory;
window.saveOrderToHistory = saveOrderToHistory;
