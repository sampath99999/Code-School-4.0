$(document).ready(function () {
  loadLocalStorage();

  $.get("https://dummyjson.com/products", function (data, status) {
    for (let i = 0; i < 5; i++) {
      $(".product-list").append(
        `
            <div>
                <li class="product" >
                    <div class="product-div">
                        <div class="img-div">
                            <img class="img" src="${data.products[i].images[0]}" >
                        </div>
                        <div class="data">
                            <h4>${data.products[i].title}</h4>
                            <span>${data.products[i].rating}</span>&nbsp;&nbsp;<i class="fa-solid fa-star" style="color:green;"></i> | <span>${data.products[0].stock}  remaining</span>
                            <div class="price-div">
                                <span><b>${data.products[i].brand}</b></span>
                                <span class="price"><b>$${data.products[i].price}</b></span>
                            </div>
                        </div>
                    </div>
        
                </li>
             </div>`
      );
    }
  });

  $("#add-product").click(() => {
    let imageUrlValue = $("#image").val().trim();
    let titleValue = $("#title").val().trim();
    let ratingValue = $("#rating").val().trim();
    let stockValue = $("#stock").val().trim();
    let brandValue = $("#brand").val().trim();
    let priceValue = $("#price").val().trim();

    if (
      imageUrlValue === "" ||
      titleValue === "" ||
      ratingValue === "" ||
      stockValue === "" ||
      brandValue === "" ||
      priceValue === ""
    ) {
      alert("Required fields cannot be empty!");
      return;
    }

    addProducts(
      imageUrlValue,
      titleValue,
      ratingValue,
      stockValue,
      brandValue,
      priceValue
    );
    saveLocalStorage();

    $("#image, #title, #rating, #stock, #brand, #price").val("");
    $(".modal").modal("hide");
  });

  function addProducts(imageUrl, title, rating, stock, brand, price) {
    $(".product-list").prepend(`
        <li class="product">
            <div class="product-div">
                <div class="img-div">
                    <img class="img" src="${imageUrl}" >
                </div>
                <div class="data">
                    <h4 class="new-title">${title}</h4>
                    <span class="new-rating">${rating}</span>&nbsp;&nbsp;
                    <i class="fa-solid fa-star" style="color:green;"></i> |
                    <span class="new-stock">${stock} remaining</span>
                    <div class="price-div">
                        <span class="new-brand"><b>${brand}</b></span>
                        <span class="price new-price"><b>$${price}</b></span>
                    </div>
                </div>
            </div>
        </li>
        `);
    saveLocalStorage();
  }

  function saveLocalStorage() {
    let products = [];
    $(".product").each(function () {
      products.push({
        imageUrl: $(this).find(".img").attr("src"),
        title: $(this).find(".new-title").text(),
        rating: $(this).find(".new-rating").text(),
        stock: $(this).find(".new-stock").text().replace(" remaining", ""),
        brand: $(this).find(".new-brand").text(),
        price: $(this).find(".new-price").text().replace("$", ""),
      });
    });

    localStorage.setItem("products", JSON.stringify(products));
  }

  function loadLocalStorage() {
    let savedData = localStorage.getItem("products");
    let products = savedData ? JSON.parse(savedData) : [];
    let productList = [];
    products.forEach(function (product) {
      if (product.brand !== "") {
        productList.push(product);
      }
    });
    productList.forEach(function (data) {
      addProducts(
        data.imageUrl,
        data.title,
        data.rating,
        data.stock,
        data.brand,
        data.price
      );
    });
  }
});
