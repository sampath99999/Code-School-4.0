$(document).ready(function () {
    // State management
    let products = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // Update login button state
    function updateLoginState() {
        const $loginBtn = $('.btn-primary').filter(function () {
            return $(this).text() === 'Login';
        });
        $loginBtn.text(isLoggedIn ? 'Logout' : 'Login');
        $loginBtn.on('click', function () {
            isLoggedIn = !isLoggedIn;
            localStorage.setItem('isLoggedIn', isLoggedIn);
            localStorage.removeItem('userData')
        });
    }

    function updateCartCount() {
        $('#cartCount').text(cart.length);
    }

    // Fetch products
    function fetchProducts() {
        $('#loadingSpinner').removeClass('d-none');
        $('#products').empty();

        $.ajax({
            url: 'https://dummyjson.com/products',
            method: 'GET',
            success: function (data) {
                products = data.products;
                renderProducts(products);
                fetchCategories();
            },
            error: function () {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to load products. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'Retry'
                }).then((result) => {
                    if (result.isConfirmed) {
                        fetchProducts();
                    }
                });
            },
            complete: function () {
                $('#loadingSpinner').addClass('d-none');
            }
        });
    }

    // Fetch categories
    function fetchCategories() {
        $.ajax({
            url: 'https://dummyjson.com/products/categories',
            method: 'GET',
            success: function (categories) {
                const allowedCategories = ["Beauty", "Fragrances", "Furniture", "Groceries"];
                const $categories = $('#categories');

                $categories.empty().append(`
                    <span class="category-badge active badge bg-light text-dark border me-2 mb-2 px-3 py-2" data-category="all">All</span>
                `);

                categories.forEach(function (categoryObj) {
                    const category = categoryObj.name;
                    const slug = categoryObj.slug;

                    if (allowedCategories.includes(category)) {
                        $('<span>', {
                            class: 'category-badge badge bg-light text-dark border me-2 mb-2 px-3 py-2',
                            'data-category': slug,
                            text: category
                        }).appendTo($categories);
                    }
                });
            },
            error: function (error) {
                console.error('Error fetching categories:', error);
            }
        });
    }

    // Event Handlers 
    // filter Category
    $(document).on('click', '.category-badge', function () {
        $('.category-badge').removeClass('active');
        $(this).addClass('active');

        const category = $(this).data('category');
        $('#loadingSpinner').removeClass('d-none');

        setTimeout(function () {
            const filtered = category === 'all' ? products : products.filter(p => p.category === category);
            renderProducts(filtered);
            $('#loadingSpinner').addClass('d-none');
        }, 300);
    });

    // Render products
    function renderProducts(productsToRender) {
        const $products = $('#products').empty();

        if (!productsToRender?.length) {
            return $products.html(`
                <div class="col-12 text-center py-5">
                    <i class="fas fa-box-open fs-1 text-secondary mb-3"></i>
                    <h3>No products found</h3>
                    <p class="text-muted">Try selecting a different category or check back later.</p>
                </div>
            `);
        }

        productsToRender.forEach(product => {
            let cartItem = cart.find(item => item.id === product.id);
            let buttonHTML;
            if (cartItem) {
                buttonHTML= `
                    <div class="quantity-control">
                        <button class="quantity-btn decrease-quantity" data-id="${product.id}">-</button>
                        <span class="mx-2">${cartItem.quantity}</span>
                        <button class="quantity-btn increase-quantity" data-id="${product.id}">+</button>
                    </div>
                `;
            } else {
                buttonHTML= `<button class="btn btn-primary add-to-cart" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> Add
                </button>`;
            }
    
            $(` 
                <div class="col-md-6 col-lg-4 col-xl-3">
                    <div class="card h-100 shadow-sm">
                        <img class="card-img-top product-image object-fit-contain" src="${product.thumbnail}" alt="${product.title}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text text-muted mb-4">${product.description?.substring(0, 100) || ''}...</p>
                            <div class="mt-auto d-flex justify-content-between align-items-center">
                                <span class="fs-5 fw-bold text-primary">$${product.price.toFixed(2)}</span>
                                ${buttonHTML}
                            </div>
                            <button class="btn btn-secondary mt-2 view-details" data-bs-toggle="modal" data-bs-target="#productModal"
                                data-id="${product.id}" data-title="${product.title}" data-description="${product.description}" 
                                data-price="${product.price}" data-image="${product.thumbnail}">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            `).appendTo($products);
        });
    }

    // modal display
$(document).on('click', '.view-details', function () {
    const id = $(this).data('id');
    const title = $(this).data('title');
    const description = $(this).data('description');
    const price = $(this).data('price');
    const image = $(this).data('image');

    $('#productModalLabel').text(title);
    $('#modalProductTitle').text(title);
    $('#modalProductDescription').text(description);
    $('#modalProductPrice').text(price);
    $('#modalProductImage').attr('src', image);
    $('#modalAddToCart').attr('id',id)
});





    // Update cart items
    function updateCartItems() {
        const $cartItems = $('#cartItems').empty();
        let total = 0;

        if (!cart.length) {
            $('#cartTotal, #cartTotal2').text('0.00');  
            updateCartCount();
            return $cartItems.html(`
                <div class="text-center py-5">
                    <i class="fas fa-shopping-cart fs-1 text-secondary mb-3"></i>
                    <p class="text-muted">Your cart is empty</p>
                    <a href="index.html" class="btn btn-primary mt-3">Continue Shopping</a>
                </div>
            `);
        }

        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                total += product.price * item.quantity;
                $(`
                    <div class="cart-item">
                        <div class="row align-items-center">
                            <div class="col-md-3">
                                <img class="cart-product-image w-100" src="${product.thumbnail}" alt="${product.title}">
                            </div>
                            <div class="col-md-6">
                                <h5 class="mb-1">${product.title}</h5>
                                <p class="text-muted mb-0">$${product.price.toFixed(2)} each</p>
                            </div>
                            <div class="col-md-3">
                                <div class="quantity-control justify-content-end">
                                    <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                                    <span class="mx-2">${item.quantity}</span>
                                    <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).appendTo($cartItems);
            }
        });

        $('#cartTotal, #cartTotal2').text(total.toFixed(2));
        updateCartCount();
    }


    // Initialize based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (currentPage === 'index.html') {
        fetchProducts();
    } else if (currentPage === 'cart.html') {
        $.ajax({
            url: 'https://dummyjson.com/products',
            method: 'GET',
            success: function (data) {
                products = data.products;
                updateCartItems();
            }
        });
    }

    // Add to cart
    $(document).on('click', '.add-to-cart', function () {
        const $btn = $(this);
        const id = $btn.data('id');
        const existingItem = cart.find(item => item.id === id);

        $btn.prop('disabled', true);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();

        renderProducts(products);

        Swal.fire({
            title: 'Added to cart!',
            icon: 'success',
            timer: 800,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    });

    // Cart quantity controls
    $(document).on('click', '.quantity-btn', function () {
        const $btn = $(this);
        const id = $btn.data('id');
        const isIncrease = $btn.hasClass('increase-quantity');

        if (isIncrease) {
            const item = cart.find(item => item.id === id);
            if (item) item.quantity++;
        } else {
            const itemIndex = cart.findIndex(item => item.id === id);
            if (itemIndex > -1) {
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity--;
                } else {
                    cart.splice(itemIndex, 1);
                }
            }
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartItems();
        renderProducts(products)
    });

    // Login form
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();
        const username = $('#username').val().trim();
        const password = $('#password').val().trim();
        const $submitBtn = $(this).find('button[type="submit"]');

        $submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span>Logging in...');
        $.ajax({
            url: 'https://dummyjson.com/auth/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password, expiresInMins: 30 }),
            success: function (response) {
                let userData = JSON.stringify(response)
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userData', userData)
                if (response.accessToken) {
                    window.location.href = 'index.html';
                } else {
                    alert("wrong crendentials")
                }


                $submitBtn.prop('disabled', false).text('Login');
            },
            error: function (error) {
                console.log(error)
                Swal.fire({
                    title: 'Error',
                    text: 'You have entred wrong email/password',
                    icon: 'error'
                });
                $submitBtn.prop('disabled', false).text('Login');
            }
        });
    });

    // Checkout
    $('#checkoutBtn').on('click', function () {
        if (!isLoggedIn) {
            Swal.fire({
                title: 'Please Login',
                text: 'You need to be logged in to checkout',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Login',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'login.html';
                }
            }); a
            return;
        }

        if (cart.length === 0) {
            Swal.fire({
                title: 'Empty Cart',
                text: 'Your cart is empty',
                icon: 'error'
            });
            return;
        }

        const $btn = $(this);
        $btn.prop('disabled', true)
            .html('<span class="spinner-border spinner-border-sm me-2"></span>Processing...');

        setTimeout(function () {
            Swal.fire({
                title: 'Order Placed!',
                text: 'Thank you for your purchase',
                icon: 'success',
                confirmButtonText: 'Continue Shopping'
            }).then((result) => {
                if (result.isConfirmed) {
                    cart = [];
                    localStorage.setItem('cart', JSON.stringify(cart));
                    window.location.href = 'index.html';
                }
            });
        }, 1500);
    });


    updateLoginState();
    updateCartCount();
});
