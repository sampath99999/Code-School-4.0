$(document).ready(function () {
  // $("#getProducts").click(function(){
  $.ajax({
    url: "https://dummyjson.com/products",
    method: "GET",
    success: function (response) {
      console.log(response);
      localStorage.setItem("productsData", JSON.stringify(response.products));

      $("#productTable tbody").empty();

      response.products.forEach(function (product) {
        console.log(product);
        addRowToTable(product);
      });
    },
    error: function (xhr, status, error) {
      console.error("API Request Failed:", status, error);
    },
  });
  // })
});

$("#nextPage").click(function () {
  currentPage++;
  fetchProducts(currentPage);
});

$("#prevPage").click(function () {
  if (currentPage > 1) {
    currentPage--;
    fetchProducts(currentPage);
  }
});

function addRowToTable(product) {
  let row = `<tr id="row${product.id}">
    <td><img src="${product.thumbnail}" width="50"></td>
        <td>${product.title}</td>
        <td>${product.category}</td>
        <td>${product.sku}</td>
        <td>${product.price}</td>
        <td><span class="badge ${
          product.availabilityStatus === "Low Stock"
            ? "bg-danger"
            : "bg-success"
        } text-light">${product.availabilityStatus}</span></td>
    </tr>`;
  console.log(row);
  $("#productTable tbody").append(row);
}

function loadProductsFromLocalStorage() {
  let storedProducts = localStorage.getItem("productsData");
  if (storedProducts) {
    let products = JSON.parse(storedProducts); // Convert back to JS object
    $("#productTable tbody").empty(); // Clear existing table data

    products.forEach(function (product) {
      addRowToTable(product);
    });
  }
}

// Load stored data on page load
loadProductsFromLocalStorage();

// delete a row
$(document).on("click", ".delete-btn", function () {
  let productId = $(this).data("id");
  let rowElement = $("#row" + productId);

  if (confirm("Are you sure you want to delete this product?")) {
    $.ajax({
      url: `https://dummyjson.com/products/${productId}`,
      method: "DELETE",
      success: function (response) {
        console.log("Deleted:", response);
        rowElement.remove();
      },
      error: function (xhr, status, error) {
        console.error("Delete Failed:", status, error);
      },
    });
  }
});

// Add New Product and Update Table
$(document).on("click", "#submitData", function (event) {
  console.log("submit clicked");
  event.preventDefault();
  let title = $("#title").val();
  let category = $("#category").val();
  let tags = $("#type").val().split(",");
  let sku = $("#sku").val();
  let price = $("#price").val();
  let availabilityStatus = $("#availabilityStatus").val();

  let newProduct = {
    title: title,
    category: category,
    tags: tags,
    sku: sku,
    price: price,
    availabilityStatus: availabilityStatus,
  };
  $.ajax({
    url: "https://dummyjson.com/products/add",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(newProduct),
    success: function (response) {
      console.log("Product Added:", response);
      addRowToTable(response);

      let storedProducts =
        JSON.parse(localStorage.getItem("productsData")) || [];
      storedProducts.push(response);
      localStorage.setItem("productsData", JSON.stringify(storedProducts));

      $("#productForm")[0];
    },
    error: function (xhr, status, error) {
      console.error("Error:", status, error);
    },
  });
});

$(document).ready(function () {
  $("#signOut").click(function () {
    localStorage.clear();
    window.location.href = "index.html";
  });
});

$(document).ready(function () {
  $("#myInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#productTable tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});
