document.addEventListener("DOMContentLoaded", function () {
    loadCartItems();
    updateCartCount();

    document.getElementById("checkout").addEventListener("click", handleCheckout);
});

function increaseQuantity(event) {
    const productId = parseInt(event.target.getAttribute("data-id"));
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity += 1;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartItems();
    updateCartCount();
}

function decreaseQuantity(event) {
    const productId = parseInt(event.target.getAttribute("data-id"));
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex !== -1) {
        if (cart[productIndex].quantity > 1) {
            cart[productIndex].quantity -= 1;
        } else {
            cart.splice(productIndex, 1);
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartItems();
    updateCartCount();
}

function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.getElementById("cart-container");
    const totalAmountContainer = document.getElementById("total-amount");

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        totalAmountContainer.innerText = "$0.00";
        updateCartCount();
        return;
    }

    cartContainer.innerHTML = "";

    let totalAmount = 0;

    cart.forEach(item => {
        totalAmount += item.price * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.classList.add("card", "mb-3");
        cartItem.innerHTML = `
            <div class="card-body d-flex justify-content-between align-items-center bg-dark text-light">
                <img src="${item.thumbnail}" width="50" height="50" class="me-3">
                <div class="flex-grow-1">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">Price: $${item.price}</p>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary decrease-qty" data-id="${item.id}">-</button>
                        <span class="mx-2 quantity" id="quantity-${item.id}">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary increase-qty" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="btn btn-sm btn-danger remove-from-cart" data-id="${item.id}">Remove</button>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    totalAmountContainer.innerText = `$${totalAmount.toFixed(2)}`;

    document.querySelectorAll(".remove-from-cart").forEach(button => {
        button.addEventListener("click", removeFromCart);
    });

    document.querySelectorAll(".increase-qty").forEach(button => {
        button.addEventListener("click", increaseQuantity);
    });

    document.querySelectorAll(".decrease-qty").forEach(button => {
        button.addEventListener("click", decreaseQuantity);
    });

    document.getElementById("clear-cart").addEventListener("click", clearCart);
    updateCartCount();
}

function removeFromCart(event) {
    const productId = parseInt(event.target.getAttribute("data-id"));
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart = cart.filter(item => item.id !== productId);

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartItems();
    updateCartCount();
}

function clearCart() {
    localStorage.removeItem("cart");
    loadCartItems();
    updateCartCount();
}

function handleCheckout() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const isLoggedIn = localStorage.getItem("accessToken");

    if (cart.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Your Cart is Empty",
            text: "Add some products before checking out.",
            confirmButtonText: "Continue Shopping"
        }).then(() => {
            window.location.href = "collections.html";
        });
        return;
    }

    if (isLoggedIn) {
        Swal.fire({
            icon: "success",
            title: "Order Placed!",
            text: "Your order has been successfully placed.",
            confirmButtonText: "OK"
        }).then(() => {
            localStorage.removeItem("cart");
            loadCartItems();
            updateCartCount();
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Not Logged In",
            text: "You need to log in before placing an order.",
            confirmButtonText: "Login"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "login.html";
            }
        });
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = cart.length;
    document.querySelectorAll(".cart-count").forEach((element) => {
        element.textContent = cartCount;
    });
}
