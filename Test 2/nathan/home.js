$(document).ready(function () {
    $.ajax({
        url: "/api/products.php",
        method: "GET",
        dataType: "json",
        success: function (response) {
            console.log(response);
            if (response.status === 200 && response.data.length > 0) {
                displayProducts(response.data);
            } else {
                $("#product-grid").html('<p class="text-center text-danger">No products available.</p>');
            }
        },
        error: function () {
            $("#product-grid").html('<p class="text-center text-danger">Error loading products.</p>');
        }
    });

    function displayProducts(products) {
        const grid = $("#product-grid");
        grid.empty(); // Clear any placeholder

        products.forEach(product => {
            const card = `
                <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div class="card product-card h-100">
                        <img src="${product.image_url}" class="card-img-top" alt="${product.name}" />
                        <div class="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h5 class="card-title">${product.name}</h5>
                                <p class="card-text">$${parseFloat(product.price).toFixed(2)}</p>
                            </div>
                            <div class="text-end mt-auto">
                                <button class="btn btn-sm btn-dark" onclick="addToCart(${product.id})">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            grid.append(card);
        });
    }
});

function addToCart(productId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("You must be logged in to add to cart.");
        return;
    }

    $.ajax({
        url: '/api/cart.php',
        method: 'POST',
        headers: {
            "Authorization": localStorage.getItem("token")
        },
        data: {
            product_id: productId,
            quantity: 1,
            token: token
        },
        dataType: 'json',
        success: function (response) {
            if (response.status === 200) {
                alert('Product added to cart successfully!');
            } else {
                alert('Failed to add product to cart: ' + response.message);
            }
        },
        error: function () {
            alert('An error occurred while adding product to cart.');
        }
    });
}

function logout() {
    localStorage.removeItem('token');
    window.location.replace("index.html");
}




