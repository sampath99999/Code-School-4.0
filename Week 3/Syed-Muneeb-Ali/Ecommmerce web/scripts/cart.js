$(document).ready(function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItems = $("#cartItems");
  const cartSummary = $("#cartSummary");
  let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  async function loadNavbar() {
    try {
      let response = await fetch("navbar.html");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      let html = await response.text();
      document.getElementById("navbarContainer").innerHTML = html;

      updateCartCount();
    } catch (error) {
      console.error("Error loading navbar:", error);
    }
  }

  if (isLoggedIn) {
    $("#login").text("Log Out");
  } else {
    $("#login").text("Log In");
  }

  function updateCartUI() {
    cartItems.html("");
    let total = 0;

    if (cart.length === 0) {
      cartItems.html(
        `<li class='list-group-item text-center text-muted'>Your cart is empty</li>`
      );
      $("#cartCount").hide();
    } else {
      cart.forEach((item, index) => {
        item.quantity = item.quantity;
        item.price = parseFloat(item.price);

        let itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartItems.append(`
                  <li class="list-group-item d-flex align-items-center">
                      <img src="${item.image}" alt="${item.title}" 
                          class="rounded me-3" style="width: 70px; height: 70px; object-fit: cover;">
                      <div class="flex-grow-1">
                          <strong>${item.title}</strong><br>
                          <small class="text-muted">$${item.price.toFixed(
                            2
                          )} x ${item.quantity} = $${itemTotal.toFixed(2)}</small>
                      </div>
                      <div class="d-flex align-items-center">
                          <button class="btn btn-sm btn-outline-secondary decrement" data-index="${index}">-</button>
                          <span class="mx-2">${item.quantity}</span>
                          <button class="btn btn-sm btn-outline-primary increment" data-index="${index}">+</button>
                      </div>
                  </li>
              `);
      });
      $("#cartCount").show();
    }

    cartSummary.text(`Total: $${total.toFixed(2)}`);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  $(document).on("click", ".increment", function () {
    let index = $(this).data("index");
    cart[index].quantity += 1;
    updateCartUI();
  });

  $(document).on("click", ".decrement", function () {
    let index = $(this).data("index");
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      cart.splice(index, 1);
    }
    updateCartUI();
  });

  $("#checkoutButton").click(function () {
    if (cart.length === 0) {
      Swal.fire("Please add items into the cart");
    } else if (!isLoggedIn) {
      Swal.fire({
        title: "Please Login",
        showCancelButton: true,
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "./login.html";
        }
      });
    } else {
      Swal.fire({
        title: "Order Placed",
        text: "Thank You for placing the order!",
        icon: "success",
        confirmButtonText: "OK",
      }).then((res) => {
        if (res.isConfirmed) {
          cart = [];
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartUI();
          window.location.href = "index.html";
        }
      });
    }
  });

  function updateCartCount() {
    // Check if cart is empty
    if (cart.length === 0) {
      $("#cartCount").hide();
    } else {
      $("#cartCount").show();
      $("#cartCount").text(cart.length);
    }
  }

  $("#login").on("click", function () {
    isLoggedIn = !isLoggedIn;
    localStorage.setItem("isLoggedIn", isLoggedIn ? "true" : "false");
    $("#login").text(isLoggedIn ? "Log Out" : "Log In");
  });

  updateCartUI();
  loadNavbar();
});
