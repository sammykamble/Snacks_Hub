// ═══════════════════════════════════════════════════════════
//  COLLEGE CANTEEN MANAGEMENT SYSTEM
// ═══════════════════════════════════════════════════════════

const CollegeCanteen = {
  // College Configuration
  config: {
    collegeName: 'Your College Name',
    canteenName: 'College Canteen',
    location: 'Ground Floor, Main Building',
    timings: {
      breakfast: '7:00 AM - 10:00 AM',
      lunch: '12:00 PM - 3:00 PM',
      snacks: '3:00 PM - 6:00 PM',
      dinner: '7:00 PM - 10:00 PM'
    },
    departments: [
      'Computer Science',
      'Electronics',
      'Mechanical',
      'Civil',
      'Electrical',
      'Information Technology',
      'Other'
    ],
    hostels: [
      'Boys Hostel 1',
      'Boys Hostel 2',
      'Girls Hostel 1',
      'Girls Hostel 2',
      'Day Scholar'
    ]
  },

  // Validate Student ID
  validateStudentID(studentId) {
    // Format: YEAR-DEPT-ROLLNO (e.g., 2024-CS-001)
    const pattern = /^\d{4}-[A-Z]{2,4}-\d{3,4}$/;
    return pattern.test(studentId);
  },

  // Validate College Email
  validateCollegeEmail(email) {
    // Format: studentid@college.edu or rollnumber@college.edu
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(edu|ac\.in)$/;
    return pattern.test(email);
  },

  // Check if canteen is open
  isCanteenOpen() {
    const now = new Date();
    const hour = now.getHours();
    
    // Canteen hours: 7 AM to 10 PM
    return hour >= 7 && hour < 22;
  },

  // Get current meal time
  getCurrentMealTime() {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 7 && hour < 10) return 'breakfast';
    if (hour >= 12 && hour < 15) return 'lunch';
    if (hour >= 15 && hour < 18) return 'snacks';
    if (hour >= 19 && hour < 22) return 'dinner';
    return 'closed';
  },

  // Render canteen status banner
  renderStatusBanner() {
    const isOpen = this.isCanteenOpen();
    const mealTime = this.getCurrentMealTime();
    
    return `
      <div class="canteen-status-banner ${isOpen ? 'open' : 'closed'}">
        <div class="status-icon">
          <span class="material-symbols-outlined">${isOpen ? 'restaurant' : 'schedule'}</span>
        </div>
        <div class="status-content">
          <div class="status-label">${isOpen ? '🟢 Canteen Open' : '🔴 Canteen Closed'}</div>
          <div class="status-time">
            ${isOpen ? `Now serving: ${mealTime.toUpperCase()}` : 'Opens at 7:00 AM'}
          </div>
        </div>
        <div class="status-location">
          <span class="material-symbols-outlined">location_on</span>
          ${this.config.location}
        </div>
      </div>
    `;
  },

  // Render today's special menu
  renderTodaysSpecial() {
    const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const specials = {
      'Monday': 'Paneer Butter Masala + Roti',
      'Tuesday': 'Chole Bhature',
      'Wednesday': 'Veg Biryani',
      'Thursday': 'South Indian Thali',
      'Friday': 'Chinese Combo',
      'Saturday': 'Pizza & Pasta',
      'Sunday': 'Special Thali'
    };

    return `
      <div class="todays-special-card">
        <div class="special-header">
          <span class="material-symbols-outlined">star</span>
          <h3>Today's Special - ${day}</h3>
        </div>
        <div class="special-item">${specials[day] || 'Check menu for today\'s special'}</div>
        <div class="special-badge">Limited Stock!</div>
      </div>
    `;
  },

  // Student registration form
  renderStudentRegistrationFields() {
    return `
      <div class="form-group">
        <label class="form-label">Student ID *</label>
        <input type="text" id="studentId" class="form-input" 
               placeholder="e.g., 2024-CS-001" 
               pattern="\\d{4}-[A-Z]{2,4}-\\d{3,4}"
               title="Format: YEAR-DEPT-ROLLNO (e.g., 2024-CS-001)"
               required/>
        <small class="form-hint">Format: YEAR-DEPT-ROLLNO</small>
      </div>

      <div class="form-group">
        <label class="form-label">Department *</label>
        <select id="department" class="form-input" required>
          <option value="">Select Department</option>
          ${this.config.departments.map(dept => 
            `<option value="${dept}">${dept}</option>`
          ).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Hostel/Residence *</label>
        <select id="hostel" class="form-input" required>
          <option value="">Select Hostel</option>
          ${this.config.hostels.map(hostel => 
            `<option value="${hostel}">${hostel}</option>`
          ).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Phone Number *</label>
        <input type="tel" id="phone" class="form-input" 
               placeholder="10-digit mobile number"
               pattern="[0-9]{10}"
               maxlength="10"
               required/>
      </div>
    `;
  },

  // Quick order for regular students
  renderQuickOrderButton() {
    return `
      <button class="quick-order-btn" onclick="CollegeCanteen.quickOrder()">
        <span class="material-symbols-outlined">bolt</span>
        <span>Quick Order (Last Order)</span>
      </button>
    `;
  },

  // Mess card balance (if applicable)
  renderMessCardBalance() {
    const balance = localStorage.getItem('mess_card_balance') || '500.00';
    return `
      <div class="mess-card-widget">
        <div class="mess-card-icon">💳</div>
        <div class="mess-card-info">
          <div class="mess-card-label">Mess Card Balance</div>
          <div class="mess-card-balance">₹${balance}</div>
        </div>
        <button class="recharge-btn" onclick="CollegeCanteen.rechargeMessCard()">
          Recharge
        </button>
      </div>
    `;
  },

  // Quick order last order
  async quickOrder() {
    const lastOrder = JSON.parse(localStorage.getItem('last_order') || 'null');
    if (!lastOrder) {
      alert('No previous order found. Please browse the menu.');
      return;
    }
    
    // Add last order items to cart
    lastOrder.items.forEach(item => {
      Cart.add(item);
    });
    
    showToast('✅ Last order added to cart!');
    window.location.href = '/checkout';
  },

  // Recharge mess card
  rechargeMessCard() {
    const amount = prompt('Enter recharge amount (₹):');
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      const currentBalance = parseFloat(localStorage.getItem('mess_card_balance') || '500');
      const newBalance = currentBalance + parseFloat(amount);
      localStorage.setItem('mess_card_balance', newBalance.toFixed(2));
      showToast(`✅ Mess card recharged! New balance: ₹${newBalance.toFixed(2)}`);
      location.reload();
    }
  }
};

// Add CSS for college canteen features
const collegeStyles = document.createElement('style');
collegeStyles.textContent = `
.canteen-status-banner {
  background: white;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border-left: 4px solid var(--green);
}
.canteen-status-banner.closed {
  border-left-color: var(--red);
  background: #fff5f5;
}
.status-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #26a541, #22c55e);
  display: flex;
  align-items: center;
  justify-content: center;
}
.canteen-status-banner.closed .status-icon {
  background: linear-gradient(135deg, #e23744, #ff6b35);
}
.status-icon .material-symbols-outlined {
  color: white;
  font-size: 28px;
  font-variation-settings: 'FILL' 1;
}
.status-content {
  flex: 1;
}
.status-label {
  font-weight: 800;
  font-size: 18px;
  margin-bottom: 4px;
}
.status-time {
  color: #686b78;
  font-size: 14px;
}
.status-location {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #686b78;
  font-size: 13px;
  font-weight: 600;
}

.todays-special-card {
  background: linear-gradient(135deg, #f8a305, #ff6b35);
  color: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}
.special-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.special-header h3 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 20px;
  font-weight: 800;
}
.special-item {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 12px;
}
.special-badge {
  display: inline-block;
  background: rgba(255,255,255,0.3);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.quick-order-btn {
  width: 100%;
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
  transition: 0.2s;
}
.quick-order-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.3);
}

.mess-card-widget {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.mess-card-icon {
  font-size: 36px;
}
.mess-card-info {
  flex: 1;
}
.mess-card-label {
  font-size: 13px;
  opacity: 0.9;
  margin-bottom: 4px;
}
.mess-card-balance {
  font-size: 28px;
  font-weight: 800;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.recharge-btn {
  background: rgba(255,255,255,0.2);
  border: 2px solid white;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}
.recharge-btn:hover {
  background: white;
  color: #667eea;
}

.form-hint {
  display: block;
  font-size: 12px;
  color: #686b78;
  margin-top: 4px;
}
`;
document.head.appendChild(collegeStyles);

console.log('🎓 College Canteen System Loaded');
