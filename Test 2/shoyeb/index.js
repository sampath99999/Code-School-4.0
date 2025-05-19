$(document).ready(function () {
    // Create product container
    const $productContainer = $('<div>').addClass('container mt-4').appendTo('body');
    
    // Default category to load
    const DEFAULT_CATEGORY = 'mobiles';

    // Load default category on page load
    loadProducts(DEFAULT_CATEGORY);

    // Category click handler
    $('.category-link').click(function (e) {
        e.preventDefault();
        const category = $(this).data('category');
        loadProducts(category);
    });

    // Main function to load products
    function loadProducts(category) {
        $productContainer.html('<p>Loading products...</p>');

        $.ajax({
            url: `products.php?category=${category}`,
            type: "GET",
            dataType: "json",
            success: function (response) {
                if (!response || !response.length) {
                    $productContainer.html('<p>No products found in this category.</p>');
                    return;
                }

                displayProducts(category, response);
            },
            error: function (xhr, status, error) {
                console.error("Products Load Error:", {
                    status: status,
                    error: error,
                    responseText: xhr.responseText
                });
                $productContainer.html(`<p>Error loading products: ${error || 'Unknown error'}</p>`);
            }
        });
    }

    // Display products in grid
    function displayProducts(category, products) {
        let productsHtml = `
            <h2 class="mb-3 text-capitalize">${category}</h2>
            <div class="row row-cols-1 row-cols-md-4 g-4">
        `;

        $.each(products, function (index, product) {
            productsHtml += `
                <div class="col">
                    <div class="card h-100 shadow-sm border-0 rounded-4">
                        <img src="${product.image_url}" class="card-img-top p-3" alt="${product.name}" style="height:220px; object-fit:contain; border-radius: 2rem;">
                        <div class="card-body d-flex flex-column text-center">
                            <h5 class="card-title fw-semibold">${product.name}</h5>
                            <p class="card-text text-muted small flex-grow-1">${product.description.substring(0, 80)}...</p>
                            <p class="fw-bold fs-5 text-dark mb-2">$${product.price.toFixed(2)}</p>
                            <button class="btn btn-add-to-cart mt-auto px-4 py-2 fw-semibold"
                                style="background-color: black; color: white; border-radius: 30px;"
                                data-id="${product.id}">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        productsHtml += '</div>';
        $productContainer.html(productsHtml);

        // Add hover effects
        $('.btn-add-to-cart').hover(
            function () {
                $(this).css({
                    'background': 'white',
                    'color': 'black',
                    'border': '1px solid black'
                });
            },
            function () {
                $(this).css({
                    'background': 'black',
                    'color': 'white',
                    'border': 'none'
                });
            }
        );

        // Add click handlers for Add to Cart buttons
        $('.btn-add-to-cart').click(function () {
            const productId = $(this).data('id');
            const userId = sessionStorage.getItem('user_id');
            
            if (!userId) {
                alert("Please log in first");
                return;
            }

            $.ajax({
                url: "add_to_cart.php",
                type: "POST",
                data: {
                    user_id: userId,
                    product_id: productId,
                    quantity: 1
                },
                dataType: "json",
                success: function (response) {
                    if (response.success) {
                        alert('Product added to cart!');
                    } else {
                        alert(response.message || 'Failed to add to cart.');
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Add to Cart Error:", {
                        status: status,
                        error: error,
                        responseText: xhr.responseText
                    });
                    alert('Error adding to cart.');
                }
            });
        });
    }
});