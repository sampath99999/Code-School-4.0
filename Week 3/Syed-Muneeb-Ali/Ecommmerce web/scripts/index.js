$(document).ready(function () { 
  const productContainer = $("#productContainer");

  async function loadNavbar() {
    try {
      let response = await fetch("navbar.html");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      let html = await response.text();
      document.getElementById("navbarContainer").innerHTML = html;
      
      // updateCartCount();
    } catch (error) {
      console.error("Error loading navbar:", error);
    }
  }
 
// Fetch product data
  $.ajax({
    url: "https://dummyjson.com/products?limit=6&skip=10&select=title,price,thumbnail,description",
    method: "GET",
    dataType: "json",
    success: function (data) {
      data.products.forEach((product) => {
        const productCard = $(`
                    <div class="col-md-4">
                        <div class="product-card p-3 border shadow-sm text-center" data-product='${JSON.stringify(
                          product
                        )}'>
                            <img src="${product.thumbnail}" alt="${product.title}" class="img-fluid">
                            <h3 class="product-name">${product.title}</h3>
                            <p class="product-price">$${product.price}</p>
                        </div>
                    </div>
                `);
        productContainer.append(productCard);
      });

      // Click event to open modal with product details
      $(".product-card").click(function () {
        let product = $(this).data("product");

        $("#productModalLabel").text(product.title);
        $("#modalImage")
          .attr("src", product.thumbnail)
          .attr("alt", product.title);
        $("#modalPrice").text(`Price: $${product.price}`);
        $("#modalDescription").text(product.description);

        $("#productModal").modal("show");
      });
    },
    error: function (error) {
      console.error("Error fetching products:", error);
    },
  });

  // When the "Men" category is clicked, navigate to men.html
  $(".mens-section").click(function () {
    window.location.href = "products.html?cat=men";
  });

  //When the Women's category is clicked, navigate to women.html
  $(".womans-section").click(function () {
    window.location.href = "products.html?cat=women";
  });

  //when the Home-decoration category is clicked, navigate to kid.html
  $(".kids-section").click(function () {
    window.location.href = "products.html?cat=home-decoration";
  });

  
  //   login.js
  $("#loginBtn").click(function (e) {
    e.preventDefault();

    if (validateForm()) {
      $.ajax({
        url: "https://dummyjson.com/user/login",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          username: $("#userName").val(),
          password: $("#password").val(),
        }),
        success: function (response) {
          console.log(response);
          // console.log(response.accessToken)
          localStorage.setItem("accessToken", response.accessToken);
          localStorage.setItem("id", response.id);
          localStorage.setItem("isLoggedIn", "true");
          Swal.fire("Login Successful!", "","success").then((result) => {
            if (result.isConfirmed) {
              window.location.href = "./index.html";
            }
          });
        },
        error: function (error) {
          console.error("Error:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Incorrect username OR password",
          });
        },
      });
    }
  });

  let formFields = [
    {
      id: "userName",
      label: "Username",
      rules: ["required", "min:3", "max:25"],
    },
    { 
      id: "password",
      label: "Password",
      rules: ["required", "min:6"] },
  ];

  function validateFormField(field) {
    let value = $("#" + field.id)
      .val()
      .trim();
    let errorElement = $("#" + field.id + "Error");
    errorElement.html("");

    for (let rule of field.rules) {
      if (rule === "required" && value.length === 0) {
        errorElement.html(field.label + " is required");
        return false;
      }

      if (rule.includes("min")) {
        let minLength = parseInt(rule.split(":")[1]);
        if (value.length < minLength) {
          errorElement.html(
            field.label + " should be at least " + minLength + " characters"
          );
          return false;
        }
      }

      if (rule.includes("max")) {
        let maxLength = parseInt(rule.split(":")[1]);
        if (value.length > maxLength) {
          errorElement.html(
            field.label + " should be at most " + maxLength + " characters"
          );
          return false;
        }
      }
    }

    return true;
  }

  function validateForm() {
    let status = true;

    for (let field of formFields) {
      status = validateFormField(field) && status;
    }

    return status;
  }
  loadNavbar()
});
