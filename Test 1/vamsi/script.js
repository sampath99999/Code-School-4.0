$(document).ready(function () {
  const storedProducts = localStorage.getItem("products");
  let products = storedProducts ? JSON.parse(storedProducts) : [];

  $.each(products, function(index, product) {
      addProductToTable(product);
  });

  $.ajax({
      url: "https://dummyjson.com/products",
      method: "GET",
      success: function (response) {
          $.each(response.products, function (index, product) {
              addProductToTable(product);
          });
      },
      error: function (error) {
          console.error("Error fetching data:", error);
      },
  });

  const $addNewProductModal = $("#addNewProductModal");
  const $newProductForm = $("#new-product-form-data");

  function addProductToTable(product) {
      const productName = product.title || product.name || "Unnamed Product";
      const productImage = product.images && product.images.length > 0
          ? product.images[0]
          : product.image || "";
      const availabilityStatus = product.availabilityStatus || product.status || "In Stock"; // Default to "In Stock"
      const rating = product.rating || "N/A";

      const $tableRow = $("<tr>").html(`
          <td class=""><input type="checkbox" class="form-check-input"></td>
          <td class=""><img src="${productImage}" alt="Product Image" class="img-fluid my-1" style="max-width: 50px; display: block; margin: 0 auto;"></td>
          <td class=" product-name">${productName}</td>
          <td class="">${product.category || "N/A"}</td>
          <td class="">${product.sku || "N/A"}</td>
          <td class="">${rating}</td>
          <td class="">$${product.price || "0.00"}</td>
          <td class=""><span class="badge ${availabilityStatus === "Low Stock" ? 'bg-danger' : 'bg-success'} text-white" style="padding: 0.375rem 0.75rem; border-radius: 0.25rem">${availabilityStatus}</span></td>
      `);

      $("#product-table tbody").append($tableRow);
  }

  function handleSubmit(event) {
      event.preventDefault();
      const formData = new FormData($newProductForm[0]);
      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
      }

      const product = {
          title: formData.get("product-name"),
          description: formData.get("product-description") || "", // Optional description
          category: formData.get("Category"),
          price: formData.get("product-price"),
          sku: formData.get("SKU"),
          availabilityStatus: formData.get("status"),
          rating: formData.get("rating") || "N/A",
          image: formData.get("product-image"),
      };

      console.log("Product", product);
      products.push(product);
      localStorage.setItem("products", JSON.stringify(products));
      addProductToTable(product);
      $newProductForm[0].reset(); // Reset form
      $addNewProductModal.modal("hide");
  }

  $newProductForm.on("submit", handleSubmit);

  $("#addNew").on("click", function () {
      $addNewProductModal.modal("show");
  });

  $("#menu-icon").on("click", function () {
      $("#sidebar").toggleClass("visible");
      $("#content").toggleClass("col-md-10 col-lg-11 col-12");
  });

  $("#searchInput").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#product-table tbody tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
  });
});$(document).ready(function () {
  const storedProducts = localStorage.getItem("products");
  let products = storedProducts ? JSON.parse(storedProducts) : [];

  $.each(products, function(index, product) {
      addProductToTable(product);
  });

  $.ajax({
      url: "https://dummyjson.com/products",
      method: "GET",
      success: function (response) {
          $.each(response.products, function (index, product) {
              addProductToTable(product);
          });
      },
      error: function (error) {
          console.error("Error fetching data:", error);
      },
  });

  const $addNewProductModal = $("#addNewProductModal");
  const $newProductForm = $("#new-product-form-data");

  function addProductToTable(product) {
      const productName = product.title || product.name || "Unnamed Product";
      const productImage = product.images && product.images.length > 0
          ? product.images[0]
          : product.image || "";
      const availabilityStatus = product.availabilityStatus || product.status || "In Stock"; // Default to "In Stock"
      const rating = product.rating || "N/A";

      const $tableRow = $("<tr>").html(`
          <td class=""><input type="checkbox" class="form-check-input"></td>
          <td class=""><img src="${productImage}" alt="Product Image" class="img-fluid my-1" style="max-width: 50px; display: block; margin: 0 auto; "></td>
          <td class=" product-name">${productName}</td>
          <td class="">${product.category || "N/A"}</td>
          <td class="">${product.sku || "N/A"}</td>
          <td class="">${rating}</td>
          <td class="">$${product.price || "0.00"}</td>
          <td class=""><span class="badge ${availabilityStatus === "Low Stock" ? 'bg-danger' : 'bg-success'} text-white" style="padding: 0.375rem 0.75rem; border-radius: 0.25rem">${availabilityStatus}</span></td>
      `);

      $("#product-table tbody").append($tableRow);
  }

  function handleSubmit(event) {
      event.preventDefault();
      const formData = new FormData($newProductForm[0]);
      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
      }

      const product = {
          title: formData.get("product-name"),
          description: formData.get("product-description") || "", 
          category: formData.get("Category"),
          price: formData.get("product-price"),
          sku: formData.get("SKU"),
          availabilityStatus: formData.get("status"),
          rating: formData.get("rating") || "N/A",
          image: formData.get("product-image"),
      };

      console.log("Product", product);
      products.push(product);
      localStorage.setItem("products", JSON.stringify(products));
      addProductToTable(product);
      $newProductForm[0].reset(); 
      $addNewProductModal.modal("hide");
  }

  $newProductForm.on("submit", handleSubmit);

  $("#addNew").on("click", function () {
      $addNewProductModal.modal("show");
  });

  $("#menu-icon").on("click", function () {
      $("#sidebar").toggleClass("visible");
      $("#content").toggleClass("col-md-10 col-lg-11 col-12");
  });

  $("#searchInput").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#product-table tbody tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
  });


  // function deleteProduct(event) {
  //     const productId = $(event.target).closest("tr").data("id");
  //     if (productId) {
  //         products = products.filter(product => product.id !== productId);
  //         localStorage.setItem("products", JSON.stringify(products));
  //         $(event.target).closest("tr").remove();
  //     }
  // }

  // $("#product-table tbody").on("click", ".delete-product", deleteProduct);



});