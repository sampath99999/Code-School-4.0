

$(document).ready(function () {
  $.ajax({
    url: "https://dummyjson.com/products",
    method: "GET",
    success: function (response) {
      console.log("Fetched Products:", response);

      response.products.forEach(function (product) {
        addRowToTable(product); 
      });

      loadUserProductsFromLocalStorage();
    },
    error: function (xhr, status, error) {
      console.error("API Request Failed:", status, error);
    },
  });
});


function addRowToTable(product) {
  let row = `<tr id="row${product.id}">
    <td><img src="${product.thumbnail}" width="50"></td>
    <td>${product.title}</td>
    <td>${product.category}</td>
    <td>${product.sku ? product.sku : "N/A"}</td>
    <td>${product.price}</td>
    <td><span class="badge ${
      product.availabilityStatus === "Low Stock" ? "bg-danger" : "bg-success"
    } 
    text-light">${product.availabilityStatus ? product.availabilityStatus : "Available"}</span></td>
  </tr>`;

  $("#productTable tbody").append(row);
}


$(document).on("click", "#submitData", function (event) {
  event.preventDefault();

  let newProduct = {
     
    title: $("#title").val(),
    category: $("#category").val(),
    sku: $("#sku").val() || "N/A",
    price: $("#price").val(),
    availabilityStatus: $("#availabilityStatus").val() || "Available",
  };

  $.ajax({
    url: "https://dummyjson.com/products/add",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(newProduct),
    success: function (response) {
      console.log("Product Added:", response);

      let storedProducts = JSON.parse(localStorage.getItem("userProducts")) || [];
      storedProducts.push(newProduct);
      localStorage.setItem("userProducts", JSON.stringify(storedProducts));

      addRowToTable(newProduct);
      $("#productForm")[0].reset();
    },
    error: function (xhr, status, error) {
      console.error("Error:", status, error);
    },
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
