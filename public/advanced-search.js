// ═══════════════════════════════════════════════════════════
//  ADVANCED SEARCH & FILTERS
// ═══════════════════════════════════════════════════════════

const AdvancedSearch = {
  filters: {
    category: 'All',
    priceRange: 'all',
    rating: 0,
    sortBy: 'popular',
    searchQuery: ''
  },

  applyFilters(items) {
    let filtered = [...items];

    // Category filter
    if (this.filters.category !== 'All') {
      filtered = filtered.filter(item => item.category === this.filters.category);
    }

    // Search query
    if (this.filters.searchQuery) {
      const query = this.filters.searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    // Price range filter
    if (this.filters.priceRange !== 'all') {
      const ranges = {
        'under-5': [0, 5],
        '5-10': [5, 10],
        '10-15': [10, 15],
        'above-15': [15, Infinity]
      };
      const [min, max] = ranges[this.filters.priceRange];
      filtered = filtered.filter(item => item.price >= min && item.price < max);
    }

    // Rating filter (if reviews are available)
    if (this.filters.rating > 0) {
      filtered = filtered.filter(item => (item.avgRating || 0) >= this.filters.rating);
    }

    // Sort
    switch (this.filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // popular
        // Keep original order or sort by some popularity metric
        break;
    }

    return filtered;
  },

  renderFilterBar() {
    return `
      <div class="advanced-filter-bar">
        <div class="filter-section">
          <label class="filter-label">
            <span class="material-symbols-outlined">search</span>
            <input type="text" id="searchInput" placeholder="Search food, dishes..." value="${this.filters.searchQuery}">
          </label>
        </div>

        <div class="filter-section">
          <label class="filter-label">Price Range</label>
          <select id="priceFilter" class="filter-select">
            <option value="all">All Prices</option>
            <option value="under-5">Under ₹5</option>
            <option value="5-10">₹5 - ₹10</option>
            <option value="10-15">₹10 - ₹15</option>
            <option value="above-15">Above ₹15</option>
          </select>
        </div>

        <div class="filter-section">
          <label class="filter-label">Min Rating</label>
          <select id="ratingFilter" class="filter-select">
            <option value="0">All Ratings</option>
            <option value="4">4★ & above</option>
            <option value="3">3★ & above</option>
          </select>
        </div>

        <div class="filter-section">
          <label class="filter-label">Sort By</label>
          <select id="sortFilter" class="filter-select">
            <option value="popular">Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

        <button id="clearFilters" class="clear-filters-btn">
          <span class="material-symbols-outlined">filter_alt_off</span>
          Clear
        </button>
      </div>
    `;
  },

  attachEventListeners(onFilterChange) {
    const searchInput = document.getElementById('searchInput');
    const priceFilter = document.getElementById('priceFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const sortFilter = document.getElementById('sortFilter');
    const clearBtn = document.getElementById('clearFilters');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filters.searchQuery = e.target.value;
        onFilterChange();
      });
    }

    if (priceFilter) {
      priceFilter.addEventListener('change', (e) => {
        this.filters.priceRange = e.target.value;
        onFilterChange();
      });
    }

    if (ratingFilter) {
      ratingFilter.addEventListener('change', (e) => {
        this.filters.rating = parseFloat(e.target.value);
        onFilterChange();
      });
    }

    if (sortFilter) {
      sortFilter.addEventListener('change', (e) => {
        this.filters.sortBy = e.target.value;
        onFilterChange();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.filters = {
          category: 'All',
          priceRange: 'all',
          rating: 0,
          sortBy: 'popular',
          searchQuery: ''
        };
        if (searchInput) searchInput.value = '';
        if (priceFilter) priceFilter.value = 'all';
        if (ratingFilter) ratingFilter.value = '0';
        if (sortFilter) sortFilter.value = 'popular';
        onFilterChange();
      });
    }
  }
};

// Add CSS for advanced search
const searchStyles = document.createElement('style');
searchStyles.textContent = `
.advanced-filter-bar {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: flex-end;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.filter-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 180px;
}
.filter-label {
  font-size: 12px;
  font-weight: 700;
  color: #686b78;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.filter-label input {
  flex: 1;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: 'Be Vietnam Pro', sans-serif;
  outline: none;
  transition: 0.2s;
}
.filter-label input:focus {
  border-color: #e23744;
}
.filter-label .material-symbols-outlined {
  color: #686b78;
  font-size: 18px;
}
.filter-select {
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: 'Be Vietnam Pro', sans-serif;
  background: white;
  cursor: pointer;
  outline: none;
  transition: 0.2s;
}
.filter-select:hover,
.filter-select:focus {
  border-color: #e23744;
}
.clear-filters-btn {
  background: #f4f4f5;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: 0.2s;
  font-family: 'Be Vietnam Pro', sans-serif;
}
.clear-filters-btn:hover {
  background: #e0e0e0;
}
.clear-filters-btn .material-symbols-outlined {
  font-size: 18px;
}

@media (max-width: 768px) {
  .advanced-filter-bar {
    flex-direction: column;
  }
  .filter-section {
    width: 100%;
  }
}
`;
document.head.appendChild(searchStyles);
