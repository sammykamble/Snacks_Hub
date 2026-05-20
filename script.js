const UI = {
    updateCartUI: () => {
        const cartStr = localStorage.getItem('snacksHubCart');
        const cart = cartStr ? JSON.parse(cartStr) : [];
        
        // Update badge
        const badges = document.querySelectorAll('nav a[href="/checkout"] span');
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        badges.forEach(b => b.textContent = totalItems);

        // Calculate totals
        let subtotal = 0;
        cart.forEach(item => subtotal += (item.price * item.qty));
        const fee = subtotal > 0 ? 1.50 : 0;
        const total = subtotal + fee;

        // If on checkout page, render
        const cartContainer = document.querySelector('aside .flex-1.overflow-y-auto');
        if (cartContainer) {
            cartContainer.innerHTML = '';
            if (cart.length === 0) {
                cartContainer.innerHTML = '<p class="text-on-surface-variant p-4">Your cart is empty.</p>';
            } else {
                cart.forEach((item, index) => {
                    cartContainer.innerHTML += `
                    <div class="flex gap-4 items-center mb-4">
                        <div class="w-20 h-20 bg-surface-container rounded-lg p-2 overflow-hidden">
                            <img class="w-full h-full object-cover" src="${item.image_url || 'https://via.placeholder.com/150'}">
                        </div>
                        <div class="flex-1">
                            <p class="font-bold font-headline">${item.name}</p>
                            <div class="flex gap-2 items-center mt-1">
                              <button class="bg-surface-container hover:bg-surface-container-high px-2 rounded" onclick="window.updateQty(${index}, -1)">-</button>
                              <p class="text-sm text-on-surface-variant font-bold">${item.qty}</p>
                              <button class="bg-surface-container hover:bg-surface-container-high px-2 rounded" onclick="window.updateQty(${index}, 1)">+</button>
                            </div>
                        </div>
                        <p class="font-bold text-primary">$${(item.price * item.qty).toFixed(2)}</p>
                    </div>`;
                });
            }
            
            // Update prices
            const priceNodes = document.querySelectorAll('aside .p-8.bg-surface-container-low span.font-bold');
            if (priceNodes.length >= 3) {
                priceNodes[0].textContent = `$${subtotal.toFixed(2)}`;
                priceNodes[1].textContent = `$${fee.toFixed(2)}`;
                priceNodes[2].textContent = `$${total.toFixed(2)}`;
            }
        }
    },
    
    addToCart: (item) => {
        const cartStr = localStorage.getItem('snacksHubCart');
        let cart = cartStr ? JSON.parse(cartStr) : [];
        
        const existing = cart.find(i => i.name === item.name);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...item, qty: 1 });
        }
        
        localStorage.setItem('snacksHubCart', JSON.stringify(cart));
        UI.updateCartUI();
        
        // Show Toast
        const toast = document.querySelector('.fixed.bottom-10');
        if (toast) {
            toast.classList.remove('hidden');
            setTimeout(() => toast.classList.add('hidden'), 2500);
        } else {
            alert(item.name + " added to cart!");
        }
    }
};

window.updateQty = (index, delta) => {
    const cartStr = localStorage.getItem('snacksHubCart');
    let cart = cartStr ? JSON.parse(cartStr) : [];
    if (cart[index]) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) cart.splice(index, 1);
        localStorage.setItem('snacksHubCart', JSON.stringify(cart));
        UI.updateCartUI();
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Cart visuals
    UI.updateCartUI();

    // MENU PAGE: Hook static buttons to Cart (Fallback till Supabase is populated)
    const menuItems = document.querySelectorAll('.group.relative.bg-surface-container-low');
    menuItems.forEach(card => {
        const title = card.querySelector('h3')?.textContent;
        const priceText = card.querySelector('.text-primary, .text-tertiary')?.textContent;
        const price = parseFloat(priceText?.replace('$', '') || 0);
        const img = card.querySelector('img')?.src;
        
        const btn = card.querySelector('button');
        if (btn && title) {
            btn.addEventListener('click', () => {
                UI.addToCart({ name: title, price, image_url: img });
            });
        }
    });

    // ADMIN PAGE: Form Logic
    const addMenuForm = document.querySelector('#add-menu-modal form');
    if (addMenuForm) {
        addMenuForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const inputs = addMenuForm.querySelectorAll('input, select');
            const name = inputs[0].value;
            const price = parseFloat(inputs[1].value);
            const category = inputs[2].value;
            const image_url = inputs[3].value;

            try {
                const response = await fetch('/api/menu', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, price, category, image_url, description: "Delicious " + name })
                });
                if (response.ok) {
                    alert('Menu item added successfully!');
                    window.location.reload();
                } else alert('Error adding menu item. Have you connected Supabase?');
            } catch (err) {
                alert('Connection to backend failed');
            }
        });
    }

    // CHECKOUT PAGE / Razorpay Logic
    const checkoutBtn = document.querySelector('aside .bg-primary.text-on-primary.py-4');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            const cartStr = localStorage.getItem('snacksHubCart');
            const cart = cartStr ? JSON.parse(cartStr) : [];
            if (cart.length === 0) return alert("Your cart is empty!");
            
            const originalText = checkoutBtn.textContent;
            checkoutBtn.textContent = 'Processing...';
            checkoutBtn.disabled = true;

            let subtotal = 0;
            cart.forEach(item => subtotal += (item.price * item.qty));
            const total_amount = subtotal + 1.50;
            
            try {
                const sessionStr = localStorage.getItem('snacksHubSession');
                const session = sessionStr ? JSON.parse(sessionStr) : null;

                const configRes = await fetch('/api/payment/config');
                const config = await configRes.json();
                if (!config.key) {
                    alert('Razorpay is not configured. Add keys to .env and restart the server.');
                    checkoutBtn.textContent = originalText;
                    checkoutBtn.disabled = false;
                    return;
                }

                const response = await fetch('/api/payment/create-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: total_amount })
                });
                
                const order = await response.json();
                if (!response.ok || order.error) {
                    alert('Could not start payment: ' + (order.error || 'Unknown error'));
                    checkoutBtn.textContent = originalText;
                    checkoutBtn.disabled = false;
                    return;
                }
                
                if (order.id) {
                    const options = {
                        key: config.key,
                        amount: order.amount,
                        currency: order.currency,
                        name: "Snacks Hub",
                        description: "Canteen Order",
                        order_id: order.id,
                        handler: async function (res) {
                            const verifyRes = await fetch('/api/payment/verify', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    razorpay_order_id: res.razorpay_order_id,
                                    razorpay_payment_id: res.razorpay_payment_id,
                                    razorpay_signature: res.razorpay_signature,
                                    items: cart,
                                    total_amount: total_amount,
                                    user_id: session?.user?.id || null
                                })
                            });
                            
                            const verifyData = await verifyRes.json();
                            if (verifyData.msg === 'success') {
                                localStorage.removeItem('snacksHubCart'); // clear cart
                                alert("Payment successful! Redirecting to dashboard...");
                                window.location.href = '/dashboard';
                            } else {
                                alert('Payment verification failed');
                                checkoutBtn.textContent = originalText;
                                checkoutBtn.disabled = false;
                            }
                        },
                        theme: { color: "#ff7949" }
                    };
                    const rzp1 = new Razorpay(options);
                    rzp1.open();
                } else {
                    alert("Order creation failed. Check .env keys.");
                    checkoutBtn.textContent = originalText;
                    checkoutBtn.disabled = false;
                }
            } catch (err) {
                console.error(err);
                alert("Please configure Razorpay keys in the .env file and restart the server!");
                checkoutBtn.textContent = originalText;
                checkoutBtn.disabled = false;
            }
        });
    }
});
