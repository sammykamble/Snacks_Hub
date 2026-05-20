// ═══════════════════════════════════════════════════════════
//  REAL-TIME ORDER TRACKING SYSTEM
// ═══════════════════════════════════════════════════════════

const OrderTracking = {
  statusSteps: [
    { key: 'pending', label: 'Order Placed', icon: 'receipt_long', color: '#f8a305' },
    { key: 'confirmed', label: 'Confirmed', icon: 'check_circle', color: '#26a541' },
    { key: 'preparing', label: 'Preparing', icon: 'restaurant', color: '#ff6b35' },
    { key: 'ready', label: 'Ready', icon: 'done_all', color: '#7c3aed' },
    { key: 'delivered', label: 'Collected', icon: 'celebration', color: '#26a541' }
  ],

  getStatusIndex(status) {
    return this.statusSteps.findIndex(s => s.key === status);
  },

  getEstimatedTime(status) {
    const times = {
      pending: '2-3 minutes',
      confirmed: '10-15 minutes',
      preparing: '5-10 minutes',
      ready: 'Ready for Collection',
      delivered: 'Completed'
    };
    return times[status] || 'Calculating...';
  },

  renderTracker(order) {
    const currentIndex = this.getStatusIndex(order.status);
    const estimatedTime = this.getEstimatedTime(order.status);
    const pickupOTP = String(order.id).slice(-4);

    return `
      <div class="order-tracker">
        <div class="tracker-header">
          <div>
            <h3>Order #${order.id}</h3>
            <p class="tracker-time">Estimated: ${estimatedTime}</p>
          </div>
          <div class="tracker-status-badge ${order.status}">
            ${order.status.toUpperCase()}
          </div>
        </div>

        ${currentIndex >= this.getStatusIndex('ready') && order.status !== 'delivered' ? `
        <div style="background:#f4f4f5; border:2px dashed #e23744; border-radius:12px; padding:16px; margin-bottom:24px; text-align:center;">
            <p style="font-size:14px; color:#686b78; margin-bottom:4px; font-weight:700;">Show this PIN at counter</p>
            <h2 style="font-size:32px; font-weight:900; letter-spacing:4px; color:#e23744; margin:0;">${pickupOTP}</h2>
        </div>
        ` : ''}
        
        <div class="tracker-timeline">
          ${this.statusSteps.map((step, index) => `
            <div class="tracker-step ${index <= currentIndex ? 'completed' : ''} ${index === currentIndex ? 'active' : ''}">
              <div class="step-icon" style="background: ${index <= currentIndex ? step.color : '#e0e0e0'}">
                <span class="material-symbols-outlined">${step.icon}</span>
              </div>
              <div class="step-content">
                <div class="step-label">${step.label}</div>
                ${index === currentIndex ? `<div class="step-time">${estimatedTime}</div>` : ''}
              </div>
              ${index < this.statusSteps.length - 1 ? '<div class="step-line"></div>' : ''}
            </div>
          `).join('')}
        </div>

        <div class="tracker-items">
          <h4>Order Items</h4>
          ${order.items.map(item => `
            <div class="tracker-item">
              <span>${item.qty}x ${item.name}</span>
              <span>₹${(item.price * item.qty).toFixed(2)}</span>
            </div>
          `).join('')}
          <div class="tracker-total">
            <span>Total</span>
            <span>₹${order.total_amount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `;
  },

  // Auto-refresh order status
  startTracking(orderId, callback) {
    const interval = setInterval(async () => {
      try {
        const session = JSON.parse(localStorage.getItem('sh_session') || 'null');
        const userId = session?.user?.id;
        const res = await fetch(`/api/orders?user_id=${userId}`);
        const orders = await res.json();
        const order = orders.find(o => o.id == orderId);
        
        if (order) {
          callback(order);
          if (order.status === 'delivered' || order.status === 'cancelled') {
            clearInterval(interval);
          }
        }
      } catch (e) {
        console.error('Tracking error:', e);
      }
    }, 5000); // Check every 5 seconds

    return interval;
  }
};

// Add CSS for order tracking
const trackingStyles = document.createElement('style');
trackingStyles.textContent = `
.order-tracker {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}
.tracker-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f4f4f5;
}
.tracker-header h3 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 4px;
}
.tracker-time {
  color: #686b78;
  font-size: 14px;
}
.tracker-status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.tracker-status-badge.pending { background: #fff3cd; color: #856404; }
.tracker-status-badge.confirmed { background: #d4edda; color: #155724; }
.tracker-status-badge.preparing { background: #ffe5d9; color: #c1440e; }
.tracker-status-badge.ready { background: #e0d4fc; color: #5a1ea0; }
.tracker-status-badge.delivered { background: #d4edda; color: #155724; }

.tracker-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 32px;
}
.tracker-step {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  position: relative;
  padding-bottom: 24px;
}
.step-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: 0.3s;
  z-index: 2;
}
.step-icon .material-symbols-outlined {
  color: white;
  font-size: 24px;
  font-variation-settings: 'FILL' 1;
}
.tracker-step.active .step-icon {
  animation: pulse 2s infinite;
}
.step-content {
  flex: 1;
  padding-top: 8px;
}
.step-label {
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 2px;
}
.step-time {
  color: #e23744;
  font-size: 13px;
  font-weight: 600;
}
.step-line {
  position: absolute;
  left: 23px;
  top: 48px;
  width: 2px;
  height: 100%;
  background: #e0e0e0;
  z-index: 1;
}
.tracker-step.completed .step-line {
  background: #26a541;
}

.tracker-items {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 16px;
}
.tracker-items h4 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #686b78;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.tracker-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}
.tracker-total {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  margin-top: 12px;
  border-top: 2px solid #e0e0e0;
  font-weight: 700;
  font-size: 16px;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(226, 55, 68, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(226, 55, 68, 0); }
}
`;
document.head.appendChild(trackingStyles);
