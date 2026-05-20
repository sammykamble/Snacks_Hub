// ═══════════════════════════════════════════════════════════
//  EMAIL NOTIFICATIONS SYSTEM
// ═══════════════════════════════════════════════════════════

const EmailNotifications = {
  async sendOrderConfirmation(order, userEmail) {
    try {
      await fetch('/api/notifications/order-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          order_id: order.id,
          items: order.items,
          total: order.total_amount
        })
      });
      console.log('✅ Order confirmation email sent');
    } catch (e) {
      console.error('Email error:', e);
    }
  },

  async sendStatusUpdate(orderId, status, userEmail) {
    try {
      await fetch('/api/notifications/status-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          order_id: orderId,
          status
        })
      });
      console.log(`✅ Status update email sent: ${status}`);
    } catch (e) {
      console.error('Email error:', e);
    }
  },

  // Generate email template (for display purposes)
  generateOrderConfirmationHTML(order) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f4f4f5; margin: 0; padding: 20px; }
          .email-container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .email-header { background: linear-gradient(135deg, #e23744, #ff6b35); color: white; padding: 32px 24px; text-align: center; }
          .email-header h1 { margin: 0; font-size: 28px; }
          .email-body { padding: 32px 24px; }
          .order-info { background: #f9f9f9; border-radius: 8px; padding: 16px; margin-bottom: 24px; }
          .order-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e0e0e0; }
          .order-total { display: flex; justify-content: space-between; padding: 16px 0; font-weight: bold; font-size: 18px; }
          .email-footer { background: #282c3f; color: white; padding: 24px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>🍕 Order Confirmed!</h1>
            <p>Thank you for your order</p>
          </div>
          <div class="email-body">
            <div class="order-info">
              <h2>Order #${order.id}</h2>
              <p>Placed on: ${new Date(order.created_at).toLocaleString()}</p>
            </div>
            <h3>Order Items:</h3>
            ${order.items.map(item => `
              <div class="order-item">
                <span>${item.qty}x ${item.name}</span>
                <span>₹${(item.price * item.qty).toFixed(2)}</span>
              </div>
            `).join('')}
            <div class="order-total">
              <span>Total</span>
              <span>₹${order.total_amount.toFixed(2)}</span>
            </div>
            <p style="margin-top: 24px; color: #686b78;">
              Your order is being prepared and will be ready soon. You'll receive updates as your order progresses.
            </p>
          </div>
          <div class="email-footer">
            <p>© 2024 Snacks Hub. All rights reserved.</p>
            <p>Questions? Contact us at support@snackshub.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
};

// Note: For production, integrate with:
// - SendGrid (https://sendgrid.com/)
// - Mailgun (https://www.mailgun.com/)
// - AWS SES (https://aws.amazon.com/ses/)
// - Nodemailer with SMTP

console.log('📧 Email Notifications System Loaded');
