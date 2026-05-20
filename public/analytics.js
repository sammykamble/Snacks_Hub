// ═══════════════════════════════════════════════════════════
//  ADMIN ANALYTICS DASHBOARD
// ═══════════════════════════════════════════════════════════

const Analytics = {
  async loadDashboard() {
    try {
      const res = await fetch('/api/analytics/dashboard');
      const data = await res.json();
      this.renderDashboard(data);
    } catch (e) {
      console.error('Analytics error:', e);
    }
  },

  renderDashboard(data) {
    const container = document.getElementById('analyticsContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="analytics-grid">
        <!-- Stats Cards -->
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <span class="material-symbols-outlined">shopping_bag</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">Total Orders</div>
            <div class="stat-value">${data.totalOrders}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
            <span class="material-symbols-outlined">currency_rupee</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">Total Revenue</div>
            <div class="stat-value">₹${data.totalRevenue.toFixed(2)}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
            <span class="material-symbols-outlined">today</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">Today's Orders</div>
            <div class="stat-value">${data.todayOrders}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
            <span class="material-symbols-outlined">pending</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">Pending Orders</div>
            <div class="stat-value">${data.pendingOrders}</div>
          </div>
        </div>
      </div>

      <!-- Revenue Chart -->
      <div class="chart-card">
        <h3>Revenue Trend (Last 7 Days)</h3>
        <div class="revenue-chart">
          ${this.renderRevenueChart(data.revenueByDay)}
        </div>
      </div>

      <!-- Top Items -->
      <div class="top-items-card">
        <h3>🔥 Top Selling Items</h3>
        <div class="top-items-list">
          ${data.topItems.map((item, index) => `
            <div class="top-item">
              <div class="top-item-rank">#${index + 1}</div>
              <img src="${item.image_url}" alt="${item.name}" class="top-item-img">
              <div class="top-item-info">
                <div class="top-item-name">${item.name}</div>
                <div class="top-item-orders">${item.orders} orders</div>
              </div>
              <div class="top-item-revenue">₹${(item.price * item.orders).toFixed(2)}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="recent-orders-card">
        <h3>Recent Orders</h3>
        <div class="recent-orders-list">
          ${data.recentOrders.slice(0, 10).map(order => `
            <div class="recent-order">
              <div class="order-id">#${order.id}</div>
              <div class="order-items">${order.items?.length || 0} items</div>
              <div class="order-amount">₹${order.total_amount?.toFixed(2) || '0.00'}</div>
              <div class="order-status status-${order.status}">${order.status}</div>
              <div class="order-time">${new Date(order.created_at).toLocaleString()}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderRevenueChart(data) {
    if (!data || data.length === 0) return '<p style="text-align:center;color:#999">No data available</p>';
    
    const maxRevenue = Math.max(...data.map(d => d.revenue));
    
    return `
      <div class="chart-bars">
        ${data.map(day => {
          const height = (day.revenue / maxRevenue) * 100;
          return `
            <div class="chart-bar-wrapper">
              <div class="chart-bar" style="height: ${height}%">
                <div class="chart-bar-value">₹${day.revenue}</div>
              </div>
              <div class="chart-bar-label">${day.date.split('/').slice(0, 2).join('/')}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
};

// Add CSS for analytics
const analyticsStyles = document.createElement('style');
analyticsStyles.textContent = `
.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}
.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  transition: 0.2s;
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-icon .material-symbols-outlined {
  color: white;
  font-size: 28px;
  font-variation-settings: 'FILL' 1;
}
.stat-content {
  flex: 1;
}
.stat-label {
  font-size: 13px;
  color: #686b78;
  font-weight: 600;
  margin-bottom: 4px;
}
.stat-value {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #282c3f;
}

.chart-card, .top-items-card, .recent-orders-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  margin-bottom: 24px;
}
.chart-card h3, .top-items-card h3, .recent-orders-card h3 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 20px;
}

.revenue-chart {
  height: 280px;
  padding: 20px 0;
}
.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 100%;
  gap: 12px;
}
.chart-bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}
.chart-bar {
  width: 100%;
  background: linear-gradient(180deg, #e23744 0%, #ff6b35 100%);
  border-radius: 8px 8px 0 0;
  position: relative;
  transition: 0.3s;
  min-height: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 8px;
}
.chart-bar:hover {
  opacity: 0.8;
  transform: scaleY(1.05);
}
.chart-bar-value {
  font-size: 11px;
  font-weight: 700;
  color: white;
}
.chart-bar-label {
  margin-top: 8px;
  font-size: 11px;
  color: #686b78;
  font-weight: 600;
}

.top-items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.top-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 12px;
  transition: 0.2s;
}
.top-item:hover {
  background: #f4f4f5;
}
.top-item-rank {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e23744, #ff6b35);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
}
.top-item-img {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
}
.top-item-info {
  flex: 1;
}
.top-item-name {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 2px;
}
.top-item-orders {
  font-size: 12px;
  color: #686b78;
}
.top-item-revenue {
  font-weight: 800;
  font-size: 16px;
  color: #26a541;
}

.recent-orders-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.recent-order {
  display: grid;
  grid-template-columns: 80px 100px 100px 100px 1fr;
  gap: 12px;
  align-items: center;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 10px;
  font-size: 13px;
}
.order-id {
  font-weight: 700;
  color: #e23744;
}
.order-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
}
.status-pending { background: #fff3cd; color: #856404; }
.status-confirmed { background: #d4edda; color: #155724; }
.status-preparing { background: #ffe5d9; color: #c1440e; }
.status-delivered { background: #d4edda; color: #155724; }
.order-time {
  font-size: 12px;
  color: #686b78;
}
`;
document.head.appendChild(analyticsStyles);
