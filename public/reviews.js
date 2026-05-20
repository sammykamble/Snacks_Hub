// ═══════════════════════════════════════════════════════════
//  REVIEWS & RATINGS SYSTEM
// ═══════════════════════════════════════════════════════════

const Reviews = {
  // Add a review
  async add(menuItemId, rating, comment) {
    const session = JSON.parse(localStorage.getItem('sh_session') || 'null');
    if (!session?.user) {
      alert('Please login to leave a review');
      return null;
    }

    const review = {
      menu_item_id: menuItemId,
      user_id: session.user.id,
      user_name: session.user.user_metadata?.name || 'Anonymous',
      rating,
      comment
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
      return await res.json();
    } catch (e) {
      console.error('Review error:', e);
      return null;
    }
  },

  // Get reviews for a menu item
  async get(menuItemId) {
    try {
      const res = await fetch(`/api/reviews/${menuItemId}`);
      return await res.json();
    } catch (e) {
      console.error('Fetch reviews error:', e);
      return [];
    }
  },

  // Calculate average rating
  calculateAverage(reviews) {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  },

  // Render stars
  renderStars(rating, size = 16) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let html = '';
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        html += `<span class="material-symbols-outlined" style="font-size:${size}px;color:#f8a305;font-variation-settings:'FILL' 1">star</span>`;
      } else if (i === fullStars && hasHalf) {
        html += `<span class="material-symbols-outlined" style="font-size:${size}px;color:#f8a305;font-variation-settings:'FILL' 1">star_half</span>`;
      } else {
        html += `<span class="material-symbols-outlined" style="font-size:${size}px;color:#ddd">star</span>`;
      }
    }
    return html;
  },

  // Show review modal
  showModal(menuItemId, itemName) {
    const modal = document.createElement('div');
    modal.className = 'review-modal-overlay';
    modal.innerHTML = `
      <div class="review-modal">
        <div class="review-modal-header">
          <h3>Rate ${itemName}</h3>
          <button onclick="this.closest('.review-modal-overlay').remove()" class="close-btn">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="review-modal-body">
          <div class="rating-input">
            <span class="star-btn" data-rating="1">★</span>
            <span class="star-btn" data-rating="2">★</span>
            <span class="star-btn" data-rating="3">★</span>
            <span class="star-btn" data-rating="4">★</span>
            <span class="star-btn" data-rating="5">★</span>
          </div>
          <textarea id="reviewComment" placeholder="Share your experience (optional)" rows="4"></textarea>
          <button id="submitReview" class="submit-review-btn">Submit Review</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    let selectedRating = 0;
    const stars = modal.querySelectorAll('.star-btn');
    
    stars.forEach(star => {
      star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.rating);
        stars.forEach((s, i) => {
          s.classList.toggle('active', i < selectedRating);
        });
      });
    });

    modal.querySelector('#submitReview').addEventListener('click', async () => {
      if (selectedRating === 0) {
        alert('Please select a rating');
        return;
      }
      const comment = modal.querySelector('#reviewComment').value;
      const result = await Reviews.add(menuItemId, selectedRating, comment);
      if (result) {
        modal.remove();
        showToast('✅ Review submitted successfully!');
        // Refresh reviews if on menu page
        if (typeof loadMenuItems === 'function') loadMenuItems();
      }
    });
  }
};

// Add CSS for review modal
const reviewStyles = document.createElement('style');
reviewStyles.textContent = `
.review-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s;
}
.review-modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  animation: slideUp 0.3s;
}
.review-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}
.review-modal-header h3 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 20px;
  font-weight: 800;
}
.close-btn {
  background: #f4f4f5;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
}
.close-btn:hover {
  background: #e0e0e0;
}
.review-modal-body {
  padding: 24px;
}
.rating-input {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 20px;
}
.star-btn {
  font-size: 40px;
  color: #ddd;
  cursor: pointer;
  transition: 0.2s;
  user-select: none;
}
.star-btn:hover,
.star-btn.active {
  color: #f8a305;
  transform: scale(1.1);
}
#reviewComment {
  width: 100%;
  padding: 12px;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 14px;
  resize: vertical;
  margin-bottom: 16px;
  outline: none;
  transition: 0.2s;
}
#reviewComment:focus {
  border-color: #e23744;
}
.submit-review-btn {
  width: 100%;
  background: linear-gradient(135deg, #e23744, #ff6b35);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 14px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.submit-review-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(226, 55, 68, 0.3);
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
`;
document.head.appendChild(reviewStyles);
