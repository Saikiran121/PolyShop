// State Management
const state = {
    user: null, // null or { name, email }
    cart: [],
    products: []
};

// Mock Services Data
const services = [
    { name: "Product (Go)", port: 8081, status: "Active" },
    { name: "Cart (Python)", port: 8082, status: "Active" },
    { name: "Payment (Node)", port: 8083, status: "Active" },
    { name: "Order (Ruby)", port: 8084, status: "Active" },
    { name: "Shipping (Rust)", port: 8086, status: "Active" },
    { name: "Inventory (C#)", port: 8088, status: "Active" },
];

const mockProducts = [
    { id: "1", name: "Quantum Laptop", price: 1299.99, icon: "fa-laptop" },
    { id: "2", name: "Neural Headphones", price: 199.99, icon: "fa-headphones-simple" },
    { id: "3", name: "Holo Watch", price: 399.99, icon: "fa-clock" },
    { id: "4", name: "Ergo Chair X", price: 899.99, icon: "fa-chair" },
    { id: "5", name: "VR Kit Pro", price: 699.99, icon: "fa-vr-cardboard" },
    { id: "6", name: "Drone S1", price: 499.00, icon: "fa-plane-up" },
];

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    renderStatus();
    setupAuthListeners();
    setupAdminListeners();
    checkSession();
});

// Routing / Navigation
function navigateTo(targetId) {
    // Check Auth for restricted routes
    if (targetId === 'cart' && !state.user) {
        showToast("Please login to view your cart");
        navigateTo('login');
        return;
    }

    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.add('hidden');
        view.classList.remove('active');
    });

    // Handle 'products-section' slightly differently (it's inside home)
    if (targetId === 'products-section') {
        document.getElementById('view-home').classList.remove('hidden');
        document.getElementById('view-home').classList.add('active');
        document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
        updateNavState('home');
    } else {
        // Show target view
        const targetView = document.getElementById(`view-${targetId}`);
        if (targetView) {
            targetView.classList.remove('hidden');
            targetView.classList.add('active');
        }
        updateNavState(targetId);

        // Specific init logic
        if (targetId === 'admin') {
            loadAdminProducts();
        }
    }
}

function updateNavState(activeTarget) {
    document.querySelectorAll('.nav-links .nav-item').forEach(link => {
        link.classList.toggle('active', link.dataset.target === activeTarget);
    });
}

function checkLoginProfile() {
    if (state.user) {
        logout();
    } else {
        navigateTo('login');
    }
}

// Authentication Logic
function setupAuthListeners() {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;

        // 1. Admin Check (Hardcoded Secure Credentials)
        if (email === 'admin@polyshop.com' && password === 'admin123') {
            login({ name: "Administrator", email: email, isAdmin: true });
            return;
        }

        // 2. Regular User Check (Backend Verification)
        try {
            // Check if user exists in Java User Service
            const res = await fetch(`http://localhost:8085/users/${email}`);

            if (res.ok) {
                const user = await res.json();
                login({ name: user.name, email: user.email, isAdmin: false });
            } else {
                showToast("User not found! Please valid credentials or Sign Up.");
            }
        } catch (err) {
            console.error(err);
            showToast("Login service offline.");
        }
    });

    document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = e.target.querySelector('input[type="text"]').value;
        const email = e.target.querySelector('input[type="email"]').value;

        // Call User Service to Signup (Generate OTP)
        try {
            const res = await fetch('http://localhost:8085/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email })
            });

            if (res.status === 202) {
                // Determine Pending State
                state.pendingEmail = email;
                showToast("Verification code sent to " + email);
                navigateTo('verify');
            } else {
                throw new Error("Signup failed");
            }
        } catch (err) {
            showToast("Error creating account. Check backend.");
            console.error(err);
        }
    });

    // Verification Form Listener
    const verifyForm = document.getElementById('verify-form');
    if (verifyForm) {
        verifyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const code = e.target.querySelector('input').value;

            try {
                const res = await fetch('http://localhost:8085/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: state.pendingEmail, code: code })
                });

                if (res.ok) {
                    const data = await res.json();
                    login({ name: data.user.name, email: data.user.email });
                } else {
                    showToast("Invalid Code!");
                }
            } catch (err) {
                console.error(err);
            }
        });
    }
}

function login(user) {
    state.user = user;
    localStorage.setItem('polyShopUser', JSON.stringify(user));
    showToast(`Welcome back, ${user.name}!`);
    updateUserInterface();
    navigateTo('home');
}

function logout() {
    state.user = null;
    localStorage.removeItem('polyShopUser');
    showToast("Logged out successfully");
    updateUserInterface();
    navigateTo('home');
}

function checkSession() {
    const stored = localStorage.getItem('polyShopUser');
    if (stored) {
        state.user = JSON.parse(stored);
        updateUserInterface();
    }
}

function updateUserInterface() {
    const userLabel = document.getElementById('user-label');
    if (state.user) {
        userLabel.textContent = "Logout";
    } else {
        userLabel.textContent = "Login";
    }

    // Show/Hide Admin Link
    const adminLink = document.getElementById('admin-link');
    if (adminLink) {
        if (state.user && state.user.isAdmin) {
            adminLink.style.display = 'inline';
        } else {
            adminLink.style.display = 'none';
        }
    }

    renderCart();
}

// Data Rendering: Fetch from Go Service
async function fetchProducts() {
    try {
        const res = await fetch('http://localhost:8081/products');
        if (!res.ok) throw new Error("Failed");
        state.products = await res.json();
    } catch (err) {
        console.warn("Backend offline or CORS error, using mock data");
        state.products = mockProducts;
    }
    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = state.products.map(p => `
        <div class="product-card">
            <i class="fas ${p.icon || 'fa-box'} product-icon"></i>
            <div class="product-name">${p.name}</div>
            <div class="product-price">$${p.price}</div>
            <button class="add-btn" onclick="addToCart('${p.id}')">
                <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
        </div>
    `).join('');
}

function renderStatus() {
    const grid = document.getElementById('status-grid');
    if (!grid) return; // Guard clause if element hidden/missing

    grid.innerHTML = services.map(s => `
        <div class="status-item">
            <div class="status-header">
                <div class="indicator ${s.status === 'Active' ? '' : 'offline'}"></div>
                <span class="status-name">${s.name}</span>
            </div>
            <span class="status-port">Port: ${s.port}</span>
            <span class="status-badge ${s.status === 'Active' ? '' : 'offline'}">
                ${s.status === 'Active' ? 'Online' : 'Offline'}
            </span>
        </div>
    `).join('');
}

// Cart Logic
function addToCart(id) {
    if (!state.user) {
        showToast("Please login to add items to cart");
        navigateTo('login');
        return;
    }

    // Since ID might be string/int, normalize comparison
    const product = state.products.find(p => String(p.id) === String(id));
    if (!product) return;

    state.cart.push(product);
    updateCartCount();
    showToast(`Added ${product.name} to cart`);
}

function updateCartCount() {
    const badge = document.querySelector('.badge');
    badge.textContent = state.cart.length;
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cart-content');
    const summary = document.getElementById('cart-summary');
    const totalEl = document.getElementById('cart-total');

    if (state.cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty.</p>';
        summary.classList.add('hidden');
        return;
    }

    container.innerHTML = state.cart.map((item, index) => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong><br>
                <small>$${item.price}</small>
            </div>
            <button onclick="removeFromCart(${index})" style="background:none; border:none; color: var(--accent); cursor:pointer;">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    const total = state.cart.reduce((sum, item) => sum + item.price, 0);
    totalEl.textContent = `$${total.toFixed(2)}`;
    summary.classList.remove('hidden');
}

function removeFromCart(index) {
    state.cart.splice(index, 1);
    updateCartCount();
}

async function checkout() {
    if (!state.user || !state.user.email) {
        showToast("Please login with email to checkout");
        return;
    }

    const total = state.cart.reduce((sum, item) => sum + item.price, 0);
    const orderData = {
        user_email: state.user.email,
        items: state.cart,
        total: total
    };

    showToast("Processing Order...");

    try {
        // Call Order Service (Ruby)
        const res = await fetch('http://localhost:8084/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (res.ok) {
            const order = await res.json();
            showToast(`Order Placed! ID: ${order.id}. Check your email.`);
            state.cart = [];
            updateCartCount();
            navigateTo('home');
        } else {
            throw new Error("Order Failed");
        }
    } catch (err) {
        console.error(err);
        showToast("Order Service user error or offline. Check console.");
    }
}

// Admin Logic
function setupAdminListeners() {
    const form = document.getElementById('add-product-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('p-name').value;
            const price = parseFloat(document.getElementById('p-price').value);
            const icon = document.getElementById('p-icon').value;

            const newProduct = { name, price, icon };

            try {
                // Try to POST to Go Service
                const headers = { 'Content-Type': 'application/json' };
                if (state.user && state.user.isAdmin) {
                    headers['Authorization'] = 'AdminSecret123';
                }

                const res = await fetch('http://localhost:8081/products', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(newProduct)
                });

                if (res.ok) {
                    const p = await res.json();
                    state.products.push(p);
                    showToast("Product Added to Go Service!");
                } else {
                    throw new Error("API Failed");
                }
            } catch (err) {
                // Fallback to local
                newProduct.id = String(state.products.length + 1);
                state.products.push(newProduct);
                showToast("Service offline. Added to local state.");
            }

            form.reset();
            loadAdminProducts();
            renderProducts(); // Update Home Grid
        });
    }
}

function loadAdminProducts() {
    const tbody = document.getElementById('admin-product-list');
    tbody.innerHTML = state.products.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>$${p.price}</td>
            <td><button style="color:#fd79a8; background:none; border:none;">Edit</button></td>
        </tr>
    `).join('');
}

// Utilities
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
