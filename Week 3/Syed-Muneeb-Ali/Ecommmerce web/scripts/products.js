$(document).ready(function() {
  let cart = JSON.parse(localStorage.getItem("cart"));
  let productsList = [];
  
  // Load navbar
  $("#navbarContainer").load("./navbar.html")
  $("#cartCount").text(cart.length);
  

  function getProducts() {
    const urlParam = new URLSearchParams(window.location.search);
    const category = urlParam.get("cat");
    let categoriesToFetch = [];
    

    if (category === "men") {
      categoriesToFetch = ["mens-shirts", "mens-shoes", "mens-watches"];
    } else if (category === "women") {
      categoriesToFetch = ["womens-dresses", "womens-jewellery", "womens-shoes"];
    } else if (category === "home-decoration") {
      categoriesToFetch = ["home-decoration", "kitchen-accessories", "laptops"];
    }
    
    productsList = [];
    
    // Create promises for all fetch requests
    const fetchRequests = categoriesToFetch.map(cat => {
      return fetch(`https://dummyjson.com/products/category/${cat}`)
        .then(response => response.json())
        .then(data => {
          productsList = productsList.concat(data.products);
        });
    });
    
    Promise.all(fetchRequests)
      .then(() => {
        showProducts();
      })
      .catch(error => {
        console.error("Error fetching products:", error);
      });
  }
  
  // 3. DISPLAY PRODUCTS
  function showProducts() {
    $("#products-container").empty();
    
    productsList.forEach(product => {
      const inCart = cart.find(item => item.id === product.id);
      
      // Create button based on cart status
      let buttonHTML;
      if (inCart) {
        buttonHTML = `
          <div class="d-flex align-items-center justify-content-center">
            <button class="btn btn-sm btn-outline-secondary decrease-qty" data-id="${product.id}">-</button>
            <span class="mx-2">${inCart.quantity}</span>
            <button class="btn btn-sm btn-outline-primary increase-qty" data-id="${product.id}">+</button>
          </div>
        `;
      } else {
        buttonHTML = `
          <button class="btn btn-primary add-cart-btn" 
            data-id="${product.id}" 
            data-title="${product.title}" 
            data-price="${product.price}" 
            data-image="${product.thumbnail}">
            Add to Cart
          </button>
        `;
      }
      
      // Create product card
      const productCard = `
        <div class="col-md-4 mb-4">
          <div class="card product-card h-100 shadow-sm">
            <img src="${product.thumbnail}" class="card-img-top" style="height:250px; object-fit:cover">
            <div class="card-body">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text">${product.description.substring(0, 50)}...</p>
              <p class="fw-bold">$${product.price}</p>
              ${buttonHTML}
            </div>
          </div>
        </div>
      `;
      
      // Add to page
      $("#products-container").append(productCard);
    });
  }
  
  // UPDATE CART
  function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    
    $("#cartCount").text(cart.length);
  }
  
  
  // Add to cart button
  $(document).on("click", ".add-cart-btn", function() {
    const newItem = {
      id: $(this).data("id"),
      title: $(this).data("title"),
      price: $(this).data("price"),
      image: $(this).data("image"),
      quantity: 1
    };
    
    // Check if already in cart
    const existingItem = cart.find(item => item.id === newItem.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push(newItem);
    }
    
    Swal.fire("Added to Cart");
    
    updateCart();
    showProducts();
  });
  
  // Increase quantity button
  $(document).on("click", ".increase-qty", function() {
    const productId = $(this).data("id");
    const item = cart.find(item => item.id === productId);
    
    if (item) {
      item.quantity++;
      updateCart();
      showProducts();
    }
  });
  
  // Decrease quantity button
  $(document).on("click", ".decrease-qty", function() {
    const productId = $(this).data("id");
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
      if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity--;
      } else {
        cart.splice(itemIndex, 1);
      }
      
      updateCart();
      showProducts();
    }
  });
  
  updateCart();
  getProducts();
});