// Global Variables
let menuItems = [];
let categories = [];
let cart = [];
let orders = [];
let currentUser = null;
let settings = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initializeApp();
});

// Load data from localStorage
function loadData() {
    console.log('Loading data...');
    
    // Load menu items
    const savedItems = localStorage.getItem('hotelMenuItems');
    if (savedItems) {
        menuItems = JSON.parse(savedItems);
        console.log('Loaded menu items:', menuItems);
    } else {
        // Default menu items
        menuItems = [
            {
                id: 1,
                name: 'Grilled Salmon',
                description: 'Fresh Atlantic salmon with lemon butter sauce',
                price: 24.99,
                category: 'Main Course',
                image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                prepTime: 20,
                isSpecial: true,
                isAvailable: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Caesar Salad',
                description: 'Crisp romaine lettuce with Caesar dressing and croutons',
                price: 12.99,
                category: 'Appetizer',
                image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                prepTime: 10,
                isSpecial: false,
                isAvailable: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: 'Chocolate Lava Cake',
                description: 'Warm chocolate cake with molten center',
                price: 8.99,
                category: 'Dessert',
                image: 'https://images.unsplash.com/photo-1624353365286-3f8d62dadadf?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                prepTime: 15,
                isSpecial: true,
                isAvailable: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                name: 'Beef Burger',
                description: 'Juicy beef patty with fresh vegetables',
                price: 16.99,
                category: 'Main Course',
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                prepTime: 15,
                isSpecial: false,
                isAvailable: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 5,
                name: 'Margarita Pizza',
                description: 'Classic pizza with tomato sauce and mozzarella',
                price: 18.99,
                category: 'Main Course',
                image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
                prepTime: 25,
                isSpecial: false,
                isAvailable: true,
                createdAt: new Date().toISOString()
            }
        ];
        saveMenuItems();
    }

    // Load categories
    const savedCategories = localStorage.getItem('hotelMenuCategories');
    if (savedCategories) {
        categories = JSON.parse(savedCategories);
        console.log('Loaded categories:', categories);
    } else {
        // Default categories
        categories = [
            { id: 1, name: 'Appetizer', description: 'Starters and small bites', icon: 'fas fa-seedling' },
            { id: 2, name: 'Main Course', description: 'Main dishes and entrees', icon: 'fas fa-utensils' },
            { id: 3, name: 'Dessert', description: 'Sweet treats and desserts', icon: 'fas fa-ice-cream' },
            { id: 4, name: 'Beverages', description: 'Drinks and beverages', icon: 'fas fa-glass-cheers' },
            { id: 5, name: 'Specials', description: 'Today\'s special offers', icon: 'fas fa-fire' }
        ];
        saveCategories();
    }

    // Load cart
    const savedCart = localStorage.getItem('hotelMenuCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }

    // Load orders
    const savedOrders = localStorage.getItem('hotelMenuOrders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }

    // Load settings
    const savedSettings = localStorage.getItem('hotelMenuSettings');
    if (savedSettings) {
        settings = JSON.parse(savedSettings);
    } else {
        settings = {
            hotelName: 'Royal Hotel',
            currency: '$',
            taxRate: 10
        };
        saveSettings();
    }

    // Load admin status
    const savedUser = localStorage.getItem('hotelMenuAdmin');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
}

// Save data to localStorage
function saveMenuItems() {
    localStorage.setItem('hotelMenuItems', JSON.stringify(menuItems));
}

function saveCategories() {
    localStorage.setItem('hotelMenuCategories', JSON.stringify(categories));
}

function saveCart() {
    localStorage.setItem('hotelMenuCart', JSON.stringify(cart));
}

function saveOrders() {
    localStorage.setItem('hotelMenuOrders', JSON.stringify(orders));
}

function saveSettings() {
    localStorage.setItem('hotelMenuSettings', JSON.stringify(settings));
}

// Initialize app based on current page
function initializeApp() {
    console.log('Initializing app...');
    if (window.location.pathname.includes('admin.html')) {
        console.log('Initializing admin page');
        initializeAdminPage();
    } else {
        console.log('Initializing customer page');
        initializeCustomerPage();
    }
}

// ========== CUSTOMER PAGE FUNCTIONS ==========

function initializeCustomerPage() {
    console.log('Customer page initialized');
    // Render menu items
    renderMenuItems();
    
    // Render categories
    renderCategories();
    
    // Render specials
    renderSpecials();
    
    // Update cart count
    updateCartCount();
    
    // Setup event listeners
    setupEventListeners();
}

function renderMenuItems() {
    console.log('Rendering menu items...');
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) {
        console.log('Menu grid not found');
        return;
    }
    
    // Get sorting and filtering options
    const sortBy = document.getElementById('sortBy')?.value || 'name';
    const categoryFilter = document.getElementById('categorySelect')?.value || 'all';
    
    console.log('Sort by:', sortBy, 'Category filter:', categoryFilter);
    
    // Filter items
    let filteredItems = [...menuItems];
    
    // Filter by category
    if (categoryFilter !== 'all') {
        filteredItems = filteredItems.filter(item => item.category === categoryFilter);
    }
    
    // Filter by search
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value) {
        const searchTerm = searchInput.value.toLowerCase();
        filteredItems = filteredItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort items
    switch(sortBy) {
        case 'price-low':
            filteredItems.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredItems.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filteredItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        default:
            filteredItems.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    console.log('Filtered items:', filteredItems.length);
    
    if (filteredItems.length === 0) {
        menuGrid.innerHTML = '<div class="no-items">No menu items found</div>';
        return;
    }
    
    // Render items
    menuGrid.innerHTML = filteredItems.map(item => `
        <div class="menu-item ${item.isSpecial ? 'special' : ''}">
            <div class="item-image">
                <img src="${item.image || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'">
            </div>
            <div class="item-info">
                <div class="item-header">
                    <h3>${item.name}</h3>
                    <div class="item-price">${settings.currency || '$'}${item.price.toFixed(2)}</div>
                </div>
                <p class="item-description">${item.description}</p>
                <div class="item-footer">
                    <span class="item-category">${item.category}</span>
                    <div class="item-actions">
                        <button class="btn-cart" onclick="addToCart(${item.id})" ${!item.isAvailable ? 'disabled style="opacity:0.5"' : ''}>
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                ${item.prepTime ? `<div class="prep-time"><i class="fas fa-clock"></i> ${item.prepTime} min</div>` : ''}
            </div>
        </div>
    `).join('');
}

function renderCategories() {
    console.log('Rendering categories...');
    const categoryFilter = document.getElementById('categoryFilter');
    const categorySelect = document.getElementById('categorySelect');
    
    if (categoryFilter) {
        categoryFilter.innerHTML = `
            <button class="category-btn active" data-category="all" onclick="filterByCategory('all')">
                <i class="fas fa-all"></i> All
            </button>
            ${categories.map(cat => `
                <button class="category-btn" data-category="${cat.name}" onclick="filterByCategory('${cat.name}')">
                    <i class="${cat.icon}"></i> ${cat.name}
                </button>
            `).join('')}
        `;
    }
    
    if (categorySelect) {
        categorySelect.innerHTML = `
            <option value="all">All Categories</option>
            ${categories.map(cat => `
                <option value="${cat.name}">${cat.name}</option>
            `).join('')}
        `;
    }
}

function renderSpecials() {
    console.log('Rendering specials...');
    const specialsGrid = document.getElementById('specialsGrid');
    if (!specialsGrid) return;
    
    const specialItems = menuItems.filter(item => item.isSpecial);
    console.log('Special items:', specialItems);
    
    if (specialItems.length === 0) {
        specialsGrid.innerHTML = '<p class="no-specials">No specials available today.</p>';
        return;
    }
    
    specialsGrid.innerHTML = specialItems.map(item => `
        <div class="special-card">
            <i class="fas fa-star"></i>
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="special-price">${settings.currency || '$'}${item.price.toFixed(2)}</div>
            <button class="btn-cart-small" onclick="addToCart(${item.id})">
                Add to Cart
            </button>
        </div>
    `).join('');
}

function filterMenu() {
    renderMenuItems();
}

function filterByCategory(category) {
    console.log('Filtering by category:', category);
    
    // Update active button
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update select
    const categorySelect = document.getElementById('categorySelect');
    if (categorySelect) {
        categorySelect.value = category === 'all' ? 'all' : category;
    }
    
    renderMenuItems();
}

function setupEventListeners() {
    console.log('Setting up event listeners');
    
    // Cart icon
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', toggleCart);
    }
}

// Cart Functions
function addToCart(itemId) {
    console.log('Adding to cart:', itemId);
    const item = menuItems.find(i => i.id === itemId);
    if (!item) {
        console.log('Item not found:', itemId);
        return;
    }
    
    if (!item.isAvailable) {
        showToast('This item is currently unavailable', 'error');
        return;
    }
    
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showToast(`${item.name} added to cart!`, 'success');
    
    // Update cart display if open
    if (document.querySelector('.cart-sidebar.open')) {
        renderCartItems();
    }
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('open');
        if (cartSidebar.classList.contains('open')) {
            renderCartItems();
        }
    }
}

function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.remove('open');
    }
}

function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'">
            </div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">${settings.currency || '$'}${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-actions">
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

function updateCartQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(itemId);
    } else {
        saveCart();
        updateCartCount();
        renderCartItems();
    }
}

function removeFromCart(itemId) {
    const index = cart.findIndex(i => i.id === itemId);
    if (index !== -1) {
        cart.splice(index, 1);
        saveCart();
        updateCartCount();
        renderCartItems();
        showToast('Item removed from cart', 'info');
    }
}

function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    const order = {
        id: Date.now(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    orders.push(order);
    cart = [];
    
    saveOrders();
    saveCart();
    updateCartCount();
    renderCartItems();
    closeCart();
    
    showToast('Order placed successfully!', 'success');
}

// ========== ADMIN PAGE FUNCTIONS ==========

function initializeAdminPage() {
    console.log('Initializing admin page');
    // Check if user is already logged in
    if (currentUser) {
        showAdminPanel();
    }
    
    // Setup admin event listeners
    setupAdminEventListeners();
}

function adminLogin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    // Default admin credentials (in production, use proper authentication)
    if (username === 'admin' && password === 'admin123') {
        currentUser = { username: 'admin', loggedInAt: new Date().toISOString() };
        localStorage.setItem('hotelMenuAdmin', JSON.stringify(currentUser));
        showAdminPanel();
        showToast('Welcome to Admin Panel!', 'success');
    } else {
        showToast('Invalid credentials', 'error');
    }
}

function showAdminPanel() {
    const loginForm = document.getElementById('loginForm');
    const adminPanel = document.getElementById('adminPanel');
    
    if (loginForm) loginForm.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'block';
    
    // Load admin data
    updateAdminStats();
    renderMenuItemsTable();
    renderAdminCategories();
    loadSettings();
}

function logoutAdmin() {
    currentUser = null;
    localStorage.removeItem('hotelMenuAdmin');
    
    const loginForm = document.getElementById('loginForm');
    const adminPanel = document.getElementById('adminPanel');
    
    if (loginForm) loginForm.style.display = 'block';
    if (adminPanel) adminPanel.style.display = 'none';
    
    // Clear form
    document.getElementById('adminPassword').value = '';
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.admin-nav button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(sectionId + 'Section');
    if (section) {
        section.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

function updateAdminStats() {
    document.getElementById('totalItems').textContent = menuItems.length;
    document.getElementById('totalCategories').textContent = categories.length;
    document.getElementById('totalSpecials').textContent = menuItems.filter(item => item.isSpecial).length;
    
    // Count today's orders
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => 
        new Date(order.createdAt).toDateString() === today
    ).length;
    document.getElementById('todayOrders').textContent = todayOrders;
}

function renderMenuItemsTable() {
    const tableBody = document.getElementById('menuItemsTable');
    if (!tableBody) return;
    
    if (menuItems.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No menu items found. Add your first item!</td></tr>';
        return;
    }
    
    tableBody.innerHTML = menuItems.map(item => `
        <tr>
            <td>
                <div class="item-image-small">
                    <img src="${item.image || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'">
                </div>
            </td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${settings.currency || '$'}${item.price.toFixed(2)}</td>
            <td>${item.isSpecial ? '<span class="status-available">Yes</span>' : 'No'}</td>
            <td>
                <span class="${item.isAvailable ? 'status-available' : 'status-unavailable'}">
                    ${item.isAvailable ? 'Available' : 'Unavailable'}
                </span>
            </td>
            <td>
                <button class="btn-action btn-edit" onclick="editItem(${item.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action btn-delete" onclick="deleteItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function renderAdminCategories() {
    const categoriesGrid = document.getElementById('adminCategoriesGrid');
    if (!categoriesGrid) return;
    
    if (categories.length === 0) {
        categoriesGrid.innerHTML = '<div style="text-align: center; padding: 40px;">No categories found. Add your first category!</div>';
        return;
    }
    
    categoriesGrid.innerHTML = categories.map(cat => `
        <div class="category-card">
            <i class="${cat.icon}"></i>
            <h4>${cat.name}</h4>
            <p>${cat.description}</p>
            <div class="category-actions">
                <button class="btn-action btn-edit" onclick="editCategory(${cat.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action btn-delete" onclick="deleteCategory(${cat.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function openAddItemModal() {
    const modal = document.getElementById('addItemModal');
    const form = document.getElementById('itemForm');
    const categorySelect = document.getElementById('itemCategory');
    
    // Reset form
    form.reset();
    
    // Populate categories
    categorySelect.innerHTML = categories.map(cat => `
        <option value="${cat.name}">${cat.name}</option>
    `).join('');
    
    // Set title
    document.querySelector('#addItemModal h3').innerHTML = '<i class="fas fa-plus"></i> Add New Menu Item';
    
    // Show modal
    modal.classList.add('show');
    modal.dataset.mode = 'add';
}

function openEditItemModal(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;
    
    const modal = document.getElementById('addItemModal');
    const form = document.getElementById('itemForm');
    const categorySelect = document.getElementById('itemCategory');
    
    // Populate form
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemDescription').value = item.description;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemImage').value = item.image || '';
    document.getElementById('itemPrepTime').value = item.prepTime || 15;
    document.getElementById('itemSpecial').checked = item.isSpecial;
    document.getElementById('itemAvailable').checked = item.isAvailable;
    
    // Populate categories
    categorySelect.innerHTML = categories.map(cat => `
        <option value="${cat.name}" ${cat.name === item.category ? 'selected' : ''}>${cat.name}</option>
    `).join('');
    
    // Set title
    document.querySelector('#addItemModal h3').innerHTML = '<i class="fas fa-edit"></i> Edit Menu Item';
    
    // Show modal
    modal.classList.add('show');
    modal.dataset.mode = 'edit';
    modal.dataset.itemId = itemId;
}

function saveItem() {
    const modal = document.getElementById('addItemModal');
    const mode = modal.dataset.mode;
    
    const itemData = {
        name: document.getElementById('itemName').value.trim(),
        description: document.getElementById('itemDescription').value.trim(),
        price: parseFloat(document.getElementById('itemPrice').value),
        category: document.getElementById('itemCategory').value,
        image: document.getElementById('itemImage').value.trim(),
        prepTime: parseInt(document.getElementById('itemPrepTime').value) || 15,
        isSpecial: document.getElementById('itemSpecial').checked,
        isAvailable: document.getElementById('itemAvailable').checked,
        createdAt: new Date().toISOString()
    };
    
    // Validation
    if (!itemData.name || !itemData.price || !itemData.category) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    if (itemData.price <= 0) {
        showToast('Price must be greater than 0', 'error');
        return;
    }
    
    if (mode === 'add') {
        // Add new item
        itemData.id = Date.now();
        menuItems.push(itemData);
        showToast('Item added successfully!', 'success');
    } else {
        // Edit existing item
        const itemId = parseInt(modal.dataset.itemId);
        const index = menuItems.findIndex(i => i.id === itemId);
        if (index !== -1) {
            itemData.id = itemId;
            itemData.createdAt = menuItems[index].createdAt; // Keep original creation date
            menuItems[index] = itemData;
            showToast('Item updated successfully!', 'success');
        }
    }
    
    saveMenuItems();
    closeModal();
    renderMenuItemsTable();
    
    // Refresh customer page if it's open in another tab
    if (window.location.pathname.includes('admin.html')) {
        // We're in admin page, customer page will update when they refresh or navigate back
        showToast('Item saved. Changes will appear on the customer page.', 'info');
    }
    
    updateAdminStats();
}

function deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    const index = menuItems.findIndex(i => i.id === itemId);
    if (index !== -1) {
        menuItems.splice(index, 1);
        saveMenuItems();
        renderMenuItemsTable();
        updateAdminStats();
        showToast('Item deleted successfully', 'success');
    }
}

function editItem(itemId) {
    openEditItemModal(itemId);
}

function openAddCategoryModal() {
    const modal = document.getElementById('addCategoryModal');
    const form = document.getElementById('categoryForm');
    
    // Reset form
    form.reset();
    
    // Set title
    document.querySelector('#addCategoryModal h3').innerHTML = '<i class="fas fa-plus"></i> Add New Category';
    
    // Show modal
    modal.classList.add('show');
    modal.dataset.mode = 'add';
}

function saveCategory() {
    const modal = document.getElementById('addCategoryModal');
    const mode = modal.dataset.mode;
    
    const categoryData = {
        name: document.getElementById('categoryName').value.trim(),
        description: document.getElementById('categoryDescription').value.trim(),
        icon: document.getElementById('categoryIcon').value.trim() || 'fas fa-tag'
    };
    
    // Validation
    if (!categoryData.name) {
        showToast('Category name is required', 'error');
        return;
    }
    
    // Check if category already exists
    const exists = categories.find(cat => cat.name.toLowerCase() === categoryData.name.toLowerCase());
    if (exists && mode === 'add') {
        showToast('Category already exists', 'error');
        return;
    }
    
    if (mode === 'add') {
        // Add new category
        categoryData.id = Date.now();
        categories.push(categoryData);
        showToast('Category added successfully!', 'success');
    }
    
    saveCategories();
    closeModal();
    renderAdminCategories();
    updateAdminStats();
    
    // Refresh customer page data
    if (!window.location.pathname.includes('admin.html')) {
        renderCategories();
    }
}

function deleteCategory(categoryId) {
    if (!confirm('Are you sure you want to delete this category? Items in this category will be moved to "Uncategorized".')) return;
    
    const index = categories.findIndex(c => c.id === categoryId);
    if (index !== -1) {
        // Move items to first available category or create "Uncategorized"
        const defaultCategory = categories[0]?.name || 'Uncategorized';
        menuItems.forEach(item => {
            if (item.category === categories[index].name) {
                item.category = defaultCategory;
            }
        });
        
        categories.splice(index, 1);
        
        saveCategories();
        saveMenuItems();
        renderAdminCategories();
        renderMenuItemsTable();
        updateAdminStats();
        showToast('Category deleted successfully', 'success');
    }
}

function editCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    const modal = document.getElementById('addCategoryModal');
    const form = document.getElementById('categoryForm');
    
    // Populate form
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryDescription').value = category.description || '';
    document.getElementById('categoryIcon').value = category.icon || 'fas fa-tag';
    
    // Set title
    document.querySelector('#addCategoryModal h3').innerHTML = '<i class="fas fa-edit"></i> Edit Category';
    
    // Show modal
    modal.classList.add('show');
    modal.dataset.mode = 'edit';
    modal.dataset.categoryId = categoryId;
}

function loadSettings() {
    if (!settings) return;
    
    document.getElementById('hotelName').value = settings.hotelName || 'Royal Hotel';
    document.getElementById('currency').value = settings.currency || '$';
    document.getElementById('taxRate').value = settings.taxRate || 10;
}

function saveSettings() {
    settings.hotelName = document.getElementById('hotelName').value.trim();
    settings.currency = document.getElementById('currency').value;
    settings.taxRate = parseFloat(document.getElementById('taxRate').value) || 10;
    
    saveSettings();
    showToast('Settings saved successfully!', 'success');
}

function setupAdminEventListeners() {
    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
}

// ========== UTILITY FUNCTIONS ==========

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}
// ========== ORDER FUNCTIONS ==========

function renderOrdersList() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<div class="no-orders">No orders yet</div>';
        return;
    }
    
    // Sort orders by date (newest first)
    const sortedOrders = [...orders].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    ordersList.innerHTML = sortedOrders.map(order => `
        <div class="order-card">
            <div class="order-info">
                <div class="order-header">
                    <h4>Order #${order.id}</h4>
                    <span class="order-time">${formatDate(order.createdAt)}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} × ${item.quantity}</span>
                            <span>${settings.currency || '$'}${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    <strong>Total:</strong>
                    <strong>${settings.currency || '$'}${order.total.toFixed(2)}</strong>
                </div>
            </div>
            <div class="order-status">
                <select class="status-select" onchange="updateOrderStatus(${order.id}, this.value)">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                    <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>Ready</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
                <button class="btn-delete-order" onclick="deleteOrder(${order.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function updateOrderStatus(orderId, status) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        order.updatedAt = new Date().toISOString();
        saveOrders();
        
        // Update stats if needed
        updateAdminStats();
        
        showToast(`Order #${orderId} status updated to ${status}`, 'success');
    }
}

function deleteOrder(orderId) {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
        orders.splice(index, 1);
        saveOrders();
        renderOrdersList();
        updateAdminStats();
        showToast('Order deleted successfully', 'success');
    }
}

// Update the showSection function to load orders when that section is opened
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.admin-nav button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(sectionId + 'Section');
    if (section) {
        section.classList.add('active');
        
        // If showing orders section, render orders
        if (sectionId === 'orders') {
            renderOrdersList();
        }
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Update the initializeAdminPage function
function initializeAdminPage() {
    console.log('Initializing admin page');
    // Check if user is already logged in
    if (currentUser) {
        showAdminPanel();
    }
    
    // Setup admin event listeners
    setupAdminEventListeners();
    
    // Initialize orders if not exists
    if (!orders || orders.length === 0) {
        // Add some sample orders for testing
        orders = [
            {
                id: 1001,
                items: [
                    { id: 1, name: 'Grilled Salmon', price: 24.99, quantity: 2 },
                    { id: 3, name: 'Chocolate Lava Cake', price: 8.99, quantity: 1 }
                ],
                total: 58.97,
                status: 'completed',
                createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                updatedAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: 1002,
                items: [
                    { id: 4, name: 'Beef Burger', price: 16.99, quantity: 1 },
                    { id: 2, name: 'Caesar Salad', price: 12.99, quantity: 1 }
                ],
                total: 29.98,
                status: 'preparing',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        saveOrders();
    }
}

// Image Handling Functions
function updateImagePreview(imageUrl) {
    const previewImage = document.getElementById('previewImage');
    const imagePlaceholder = document.getElementById('imagePlaceholder');
    const imageInput = document.getElementById('itemImage');
    
    if (imageUrl && isValidImageUrl(imageUrl)) {
        previewImage.src = imageUrl;
        previewImage.classList.add('loaded');
        imagePlaceholder.classList.add('hidden');
        imageInput.value = imageUrl;
        
        // Show validation
        showImageValidation('valid', 'Image URL is valid');
    } else if (imageUrl) {
        showImageValidation('invalid', 'Invalid image URL');
    }
}

function handleImageUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
    }
    
    // Create a FileReader to read the image
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        updateImagePreview(imageUrl);
        showToast('Image uploaded successfully!', 'success');
    };
    
    reader.onerror = function() {
        showToast('Error reading image file', 'error');
    };
    
    reader.readAsDataURL(file);
}

function selectSampleImage(select) {
    if (select.value) {
        updateImagePreview(select.value);
        showToast('Sample image selected', 'info');
    }
}

function isValidImageUrl(url) {
    // Simple URL validation
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

function showImageValidation(type, message) {
    // Remove existing validation
    const existingValidation = document.querySelector('.image-validation');
    if (existingValidation) {
        existingValidation.remove();
    }
    
    // Create new validation element
    const validation = document.createElement('div');
    validation.className = `image-validation ${type}`;
    validation.innerHTML = `
        <i class="fas fa-${type === 'valid' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add after image preview
    const container = document.querySelector('.image-upload-container');
    if (container) {
        container.appendChild(validation);
    }
}

// Update the openAddItemModal function to reset image preview
function openAddItemModal() {
    console.log('Opening add item modal');
    
    const modal = document.getElementById('addItemModal');
    const form = document.getElementById('itemForm');
    const categorySelect = document.getElementById('itemCategory');
    
    // Reset form
    if (form) {
        form.reset();
        // Set default values
        document.getElementById('itemPrepTime').value = 15;
        document.getElementById('itemAvailable').checked = true;
    }
    
    // Reset image preview
    resetImagePreview();
    
    // Populate categories dropdown
    if (categorySelect) {
        categorySelect.innerHTML = categories.map(cat => `
            <option value="${cat.name}">${cat.name}</option>
        `).join('');
    }
    
    // Set modal title
    const modalTitle = modal.querySelector('h3');
    if (modalTitle) {
        modalTitle.innerHTML = '<i class="fas fa-plus"></i> Add New Menu Item';
    }
    
    // Set modal mode
    modal.dataset.mode = 'add';
    modal.dataset.itemId = '';
    
    // Show modal
    modal.classList.add('show');
    
    console.log('Add item modal opened');
}

// Update the openEditItemModal function to show existing image
function openEditItemModal(itemId) {
    console.log('Opening edit modal for item:', itemId);
    
    const item = menuItems.find(i => i.id === itemId);
    if (!item) {
        showToast('Item not found', 'error');
        return;
    }
    
    const modal = document.getElementById('addItemModal');
    const categorySelect = document.getElementById('itemCategory');
    
    // Fill form with item data
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemDescription').value = item.description;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemPrepTime').value = item.prepTime || 15;
    document.getElementById('itemSpecial').checked = item.isSpecial;
    document.getElementById('itemAvailable').checked = item.isAvailable;
    
    // Set image
    if (item.image) {
        updateImagePreview(item.image);
        document.getElementById('itemImageUrl').value = item.image;
    } else {
        resetImagePreview();
    }
    
    // Populate categories
    if (categorySelect) {
        categorySelect.innerHTML = categories.map(cat => `
            <option value="${cat.name}" ${cat.name === item.category ? 'selected' : ''}>${cat.name}</option>
        `).join('');
    }
    
    // Set modal title
    const modalTitle = modal.querySelector('h3');
    if (modalTitle) {
        modalTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Menu Item';
    }
    
    // Set modal mode
    modal.dataset.mode = 'edit';
    modal.dataset.itemId = itemId;
    
    // Show modal
    modal.classList.add('show');
    
    console.log('Edit item modal opened');
}

function resetImagePreview() {
    const previewImage = document.getElementById('previewImage');
    const imagePlaceholder = document.getElementById('imagePlaceholder');
    const imageInput = document.getElementById('itemImage');
    const imageUrlInput = document.getElementById('itemImageUrl');
    const fileInput = document.getElementById('itemImageFile');
    const sampleSelect = document.getElementById('sampleImages');
    
    // Reset preview
    previewImage.src = '';
    previewImage.classList.remove('loaded');
    imagePlaceholder.classList.remove('hidden');
    
    // Reset inputs
    imageInput.value = '';
    if (imageUrlInput) imageUrlInput.value = '';
    if (fileInput) fileInput.value = '';
    if (sampleSelect) sampleSelect.value = '';
    
    // Remove validation
    const validation = document.querySelector('.image-validation');
    if (validation) {
        validation.remove();
    }
}

// Update the saveItem function to handle image validation
function saveItem() {
    console.log('Saving item...');
    
    // Prevent any default form behavior
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const modal = document.getElementById('addItemModal');
    const mode = modal.dataset.mode;
    
    // Get image URL from hidden input
    const imageUrl = document.getElementById('itemImage').value.trim();
    
    // Get form values
    const itemData = {
        name: document.getElementById('itemName').value.trim(),
        description: document.getElementById('itemDescription').value.trim(),
        price: parseFloat(document.getElementById('itemPrice').value) || 0,
        category: document.getElementById('itemCategory').value,
        image: imageUrl, // Use the image URL from hidden input
        prepTime: parseInt(document.getElementById('itemPrepTime').value) || 15,
        isSpecial: document.getElementById('itemSpecial').checked,
        isAvailable: document.getElementById('itemAvailable').checked,
        createdAt: new Date().toISOString()
    };
    
    console.log('Item data:', itemData);
    console.log('Mode:', mode);
    
    // Validation
    if (!itemData.name) {
        showToast('Item name is required', 'error');
        return false;
    }
    
    if (itemData.price <= 0) {
        showToast('Price must be greater than 0', 'error');
        return false;
    }
    
    if (!itemData.category) {
        showToast('Category is required', 'error');
        return false;
    }
    
    // Image validation (optional but recommended)
    if (!itemData.image) {
        const useDefault = confirm('No image selected. Use default image?');
        if (useDefault) {
            itemData.image = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80';
        } else {
            showToast('Please select an image for the item', 'error');
            return false;
        }
    }
    
    let successMessage = '';
    
    if (mode === 'add') {
        // Add new item
        itemData.id = Date.now();
        menuItems.push(itemData);
        successMessage = `"${itemData.name}" added successfully!`;
        console.log('New item added with ID:', itemData.id);
    } else if (mode === 'edit') {
        // Edit existing item
        const itemId = parseInt(modal.dataset.itemId);
        const index = menuItems.findIndex(i => i.id === itemId);
        
        if (index !== -1) {
            itemData.id = itemId;
            itemData.createdAt = menuItems[index].createdAt; // Keep original date
            menuItems[index] = itemData;
            successMessage = `"${itemData.name}" updated successfully!`;
            console.log('Item updated:', itemData);
        } else {
            showToast('Item not found', 'error');
            return false;
        }
    }
    
    // Save to localStorage
    saveMenuItems();
    
    // Show success message
    showToast(successMessage, 'success');
    
    // Close modal after 1.5 seconds (so user can see the message)
    setTimeout(() => {
        closeModal();
        resetImagePreview(); // Reset for next use
    }, 1500);
    
    // Refresh displays
    renderMenuItemsTable();
    updateAdminStats();
    
    // If on customer page, refresh it too
    if (!window.location.pathname.includes('admin.html')) {
        renderMenuItems();
        renderSpecials();
        renderCategories();
    }
    
    console.log('Item saved successfully. Total items:', menuItems.length);
    
    return false; // Prevent form submission
}

// Update renderMenuItemsTable to show images better
function renderMenuItemsTable() {
    const tableBody = document.getElementById('menuItemsTable');
    if (!tableBody) return;
    
    if (menuItems.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px;">
                    No menu items found. <button onclick="openAddItemModal()" style="background: none; border: none; color: #3498db; cursor: pointer; text-decoration: underline;">Add your first item</button>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = menuItems.map(item => `
        <tr>
            <td>
                <div class="item-image-small" onclick="viewImage('${item.image || getDefaultImage()}')" style="cursor: pointer;" title="Click to view larger">
                    <img src="${item.image || getDefaultImage()}" 
                         alt="${item.name}"
                         onerror="this.src='${getDefaultImage()}'">
                </div>
            </td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${settings.currency || '$'}${item.price.toFixed(2)}</td>
            <td>${item.isSpecial ? '<span class="status-available">Yes</span>' : 'No'}</td>
            <td>
                <span class="${item.isAvailable ? 'status-available' : 'status-unavailable'}">
                    ${item.isAvailable ? 'Available' : 'Unavailable'}
                </span>
            </td>
            <td>
                <button class="btn-action btn-edit" onclick="editItem(${item.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action btn-delete" onclick="deleteItem(${item.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Add function to view larger image
function viewImage(imageUrl) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h3>Image Preview</h3>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" class="close-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body" style="text-align: center;">
                <img src="${imageUrl}" alt="Preview" class="modal-image-preview" 
                     onerror="this.src='${getDefaultImage()}'">
                <div style="margin-top: 20px;">
                    <a href="${imageUrl}" target="_blank" class="btn" style="background: #3498db; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
                        <i class="fas fa-external-link-alt"></i> Open Original
                    </a>
                </div>
            </div>
        </div>
    `;
    
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    };
    
    document.body.appendChild(modal);
}

function getDefaultImage() {
    return 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80';
}
// Add CSS for orders in style.css (add this to the end of the file)
// Export functions for HTML onclick handlers
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.toggleCart = toggleCart;
window.closeCart = closeCart;
window.adminLogin = adminLogin;
window.logoutAdmin = logoutAdmin;
window.showSection = showSection;
window.openAddItemModal = openAddItemModal;
window.openAddCategoryModal = openAddCategoryModal;
window.closeModal = closeModal;
window.saveSettings = saveSettings;
window.togglePassword = togglePassword;
window.filterMenu = filterMenu;
window.filterByCategory = filterByCategory;
window.renderMenuItems = renderMenuItems;
window.editItem = editItem;
window.deleteItem = deleteItem;
window.editCategory = editCategory;
window.deleteCategory = deleteCategory;
window.saveItem = saveItem;
window.saveCategory = saveCategory;

// Add these to global scope for button clicks
window.initializeApp = initializeApp;