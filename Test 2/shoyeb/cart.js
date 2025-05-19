$(document).ready(function () {
    const userId = sessionStorage.getItem("user_id");
    if (!userId) {
        alert("Please log in first");
        return;
    }
    let cartData = []; 
    fetchCart();
    function fetchCart() {
        $.ajax({
            url: `cart_actions.php?action=get_cart&user_id=${userId}`,
            type: "GET",
            dataType: "json",
            success: function (response) {
                if (!Array.isArray(response)) {
                    alert("Failed to load cart data");
                    return;
                }
                cartData = response;
                renderCart();
            },
            error: function (xhr, status, error) {
                console.error("Cart Load Error:", {
                    status: status,
                    error: error,
                    responseText: xhr.responseText
                });
                alert("Error loading cart data");
            }
        });
    }

    function renderCart() {
        const $table = $(".cart-table");
        let total = 0;
        let html = `
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Count</th>
                    <th>Price</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
        `;

        cartData.forEach(function (item) {
            const price = Number(item.price) || 0; 
            const subtotal = price * item.quantity;
            total += subtotal;

            html += `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${item.image_url}" alt="${item.name}" width="60" class="me-3">
                            <div>${item.name}</div>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-outline-secondary change-quantity" 
                                    data-id="${item.id}" data-action="decrease">-</button>
                            <span class="mx-2 cart-quantity-${item.id}">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary change-quantity" 
                                    data-id="${item.id}" data-action="increase">+</button>
                        </div>
                    </td>
                    <td>₹${price.toFixed(2)}</td>
                    <td><button class="btn btn-danger btn-sm remove-item" 
                                data-id="${item.id}">Remove</button></td>
                </tr>
            `;
        });

        html += `</tbody>`;
        $table.html(html);
        $("#total-amount").text(`₹${total.toFixed(2)}`);

        attachEventListeners();
    }

    function attachEventListeners() {
        $(".change-quantity").click(function () {
            const itemId = $(this).data("id");
            const action = $(this).data("action");
            const $quantitySpan = $(`.cart-quantity-${itemId}`);
            let currentQuantity = parseInt($quantitySpan.text());

            if (action === "increase") {
                currentQuantity++;
            } else if (action === "decrease" && currentQuantity > 1) {
                currentQuantity--;
            }

            updateCart(itemId, currentQuantity);
        });

        $(".remove-item").click(function () {
            const itemId = $(this).data("id");
            removeFromCart(itemId);
        });
    }

    function updateCart(itemId, quantity) {
        $.ajax({
            url: "cart_actions.php",
            type: "POST",
            data: {
                action: "update_quantity",
                item_id: itemId,
                quantity: quantity,
                user_id: userId
            },
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    const itemIndex = cartData.findIndex(item => item.id === parseInt(itemId));
                    if (itemIndex !== -1) {
                        cartData[itemIndex].quantity = quantity;
                        renderCart();
                    }
                } else {
                    alert(response.message || 'Failed to update cart.');
                    fetchCart();
                }
            },
            error: function (xhr, status, error) {
                console.error("Update Error:", { status, error, responseText: xhr.responseText });
                alert('Failed to update cart quantity.');
                fetchCart();
            }
        });
    }

    function removeFromCart(itemId) {
        $.ajax({
            url: "cart_actions.php",
            type: "POST",
            data: {
                action: "remove_item",
                item_id: itemId,
                user_id: userId
            },
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    cartData = cartData.filter(item => item.id !== parseInt(itemId));
                    renderCart();
                } else {
                    alert(response.message || 'Failed to remove item from cart.');
                    fetchCart();
                }
            },
            error: function (xhr, status, error) {
                console.error("Remove Error:", { status, error, responseText: xhr.responseText });
                alert('Failed to remove item from cart.');
                fetchCart();
            }
        });
    }

    $(".checkout-btn").click(function () {
        $.get("get_cart_summary.php", { user_id: userId }, function (data) {
            const response = JSON.parse(data);
            const $modalTable = $("#modal-cart-table tbody");
            $modalTable.empty();
            let total = 0;

            response.forEach(item => {
                const price = Number(item.price) || 0; // Fix: Ensure price is valid
                const subtotal = price * item.quantity;
                total += subtotal;
                $modalTable.append(`
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>₹${price.toFixed(2)}</td>
                        <td>₹${subtotal.toFixed(2)}</td>
                    </tr>
                `);
            });

            $("#modal-total").text(total.toFixed(2));
            $("#checkoutModal").modal("show");
        });
    });

    $("#placeOrderBtn").click(function () {
        $.post("place_order.php", { user_id: userId }, function (res) {
            const result = JSON.parse(res);
            if (result.success) {
                alert("Order placed successfully!");
                $("#checkoutModal").modal("hide");
                fetchCart();
            } else {
                alert("Failed to place order: " + result.message);
            }
        });
    });
});