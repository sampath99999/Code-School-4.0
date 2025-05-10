document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("collection.html")) {
    loadCollectionPage();
  }
  updateCartCount();
  loadCartItems();
  setupAuthentication();
});

function setupAuthentication() {
  // If already logged in, redirect to index.html
  if (
    localStorage.getItem("accessToken") &&
    window.location.pathname.includes("login.html")
  ) {
    window.location.href = "index.html";
  }

  // Handle logout button
  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      localStorage.removeItem("accessToken");
      window.location.href = "login.html";
    });
  }

  // Handle login
  const loginForm = document.querySelector("form"); // Select the form element
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent form default submission

      let username = document.getElementById("UserName").value;
      let password = document.getElementById("password").value;

      fetch("https://dummyjson.com/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, expiresInMins: 30 }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken); // Store token
            window.location.href = "index.html"; // Redirect to home page
          } else {
            alert("Login failed. Check your credentials.");
          }
        })
        .catch((error) => console.error("Error:", error));
    });
  }
}

// Load products on the collection page
function loadCollectionPage() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");

  if (!category) {
    document.getElementById("collection-title").innerText =
      "Collection Not Found";
    return;
  }

  let apiUrl = "";
  let categoryTitle = "";

  if (category === "mens") { 
    apiUrl = "https://dummyjson.com/products/category/mens-shirts";
    categoryTitle = "Men's Collection";
  } else if (category === "womens") {
    apiUrl = "https://dummyjson.com/products/category/womens-dresses";
    categoryTitle = "Women's Collection";
  } else if (category === "jewelry") {
    apiUrl = "https://dummyjson.com/products/category/womens-jewellery";
    categoryTitle = "Jewelry Collection";
  }

  document.getElementById("collection-title").innerText = categoryTitle;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      displayProducts(data.products);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// Display products on the page-
function displayProducts(products) {
  const container = document.getElementById("product-container");
  container.innerHTML = "";

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  products.forEach((product) => {
    const cartItem = cart.find((item) => item.id === product.id);
    const isInCart = !!cartItem;

    const card = document.createElement("div");
    card.classList.add("col");
    card.innerHTML = `
      <div class="card bg-secondary bg-light">
        <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
        <div class="card-body">
          <h5 class="card-title text-dark">${product.title}</h5>
          <p class="card-text text-dark">$${product.price}</p>
          <div id="cart-controls-${product.id}">
            ${isInCart ? 
              `<div class="quantity-controls">
                <button class="btn btn-outline-secondary decrease-qty" data-id="${product.id}">-</button>
                <span class="quantity" id="quantity-${product.id}">${cartItem.quantity}</span>
                <button class="btn btn-outline-secondary increase-qty" data-id="${product.id}">+</button>
              </div>` :
              `<button class="btn btn-outline-primary w-100 add-to-cart" 
                data-id="${product.id}" 
                data-title="${product.title}" 
                data-price="${product.price}" 
                data-thumbnail="${product.thumbnail}">
                Add to Cart
              </button>`
            }
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", addToCart);
  });

  attachQuantityHandlers();
}



// Add to cart functionality
function addToCart(event) {
  const button = event.target;
  const product = {
    id: parseInt(button.getAttribute("data-id")), // Parse to number
    title: button.getAttribute("data-title"),
    price: parseFloat(button.getAttribute("data-price")),
    thumbnail: button.getAttribute("data-thumbnail"),
    quantity: 1,
  };

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  replaceAddToCartButton(product.id, existingItem ? existingItem.quantity : 1);
}


function replaceAddToCartButton(productId, quantity) {
  const cartControls = document.getElementById(`cart-controls-${productId}`);
  if (cartControls) {
    cartControls.innerHTML = `
      <div class="quantity-controls">
        <button class="btn btn-outline-secondary decrease-qty" data-id="${productId}">-</button>
        <span class="quantity" id="quantity-${productId}">${quantity}</span>
        <button class="btn btn-outline-secondary increase-qty" data-id="${productId}">+</button>
      </div>
    `;
    attachQuantityHandlers(); // Ensure new buttons work
  }
}
function updateQuantity(productId, change) {
  const parsedId = parseInt(productId); // Convert to number
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let item = cart.find((item) => item.id === parsedId);

  if (item) {
    item.quantity += change;

    if (item.quantity <= 0) {
      cart = cart.filter((item) => item.id !== parsedId);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    const quantityElement = document.getElementById(`quantity-${parsedId}`);
    if (quantityElement) {
      quantityElement.textContent = item.quantity > 0 ? item.quantity : 0;
    }

    if (item.quantity <= 0) {
      loadCollectionPage(); // Reload to show Add to Cart button
    }
  }

  updateCartCount();
  loadCartItems();
}
// Attach event listeners to increase/decrease quantity buttons
function attachQuantityHandlers() {
  document.querySelectorAll(".increase-qty").forEach((button) => {
    button.addEventListener("click", function () {
      updateQuantity(button.getAttribute("data-id"), 1);
    });
  });

  document.querySelectorAll(".decrease-qty").forEach((button) => {
    button.addEventListener("click", function () {
      updateQuantity(button.getAttribute("data-id"), -1);
    });
  });
}

// Function to update quantity


// Ensure data-id is set correctly in replaceAddToCartButton
function replaceAddToCartButton(productId, quantity) {
  const cartControls = document.getElementById(`cart-controls-${productId}`);
  if (cartControls) {
    cartControls.innerHTML = `
      <div class="quantity-controls">
        <button class="btn btn-outline-secondary decrease-qty" data-id="${productId}">-</button>
        <span class="quantity" id="quantity-${productId}">${quantity}</span>
        <button class="btn btn-outline-secondary increase-qty" data-id="${productId}">+</button>
      </div>
    `;
    attachQuantityHandlers();
  }
}

// Call attachQuantityHandlers when products are loaded
document.addEventListener("DOMContentLoaded", function () {
  attachQuantityHandlers();
});


// Update cart count in navbar
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.length;

  document.querySelectorAll(".cart-count").forEach((element) => {
    element.textContent = cartCount;
  });
}
updateCartCount();

// Load cart items
function loadCartItems() {
  const cartContainer = document.getElementById("cart-container");

  if (!cartContainer) {
    console.error(
      "Error: cart-container not found. Make sure this function only runs on the cart page."
    );
    return;
  }

  cartContainer.innerHTML = ""; 

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cart.forEach((item) => {
    cartContainer.innerHTML += `<p>${item.name} - ${item.price}</p>`;
  });
}

// Run only when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("cart-container")) {
    loadCartItems();
  }
});

// // Handle checkout
// function handleCheckout() {
//   const isLoggedIn = localStorage.getItem("accessToken");

//   if (isLoggedIn) {
//     Swal.fire({
//       icon: "success",
//       title: "Order Placed!",
//       text: "Your order has been successfully placed.",
//       confirmButtonText: "OK",
//     }).then(() => {
//       localStorage.removeItem("cart");
//       loadCartItems();
//     });
//   } else {
//     Swal.fire({
//       icon: "error",
//       title: "Not Logged In",
//       text: "You need to log in before placing an order.",
//       confirmButtonText: "Login",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         window.location.href = "login.html";
//       }
//     });
//   }
// }

// Remove item from cart
function removeFromCart(event) {
  const button = event.target;
  const productId = button.getAttribute("data-id");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id !== productId);

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  loadCartItems();
}
