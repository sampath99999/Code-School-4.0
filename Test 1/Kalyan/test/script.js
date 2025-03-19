


$(document).ready(function () {

    $.ajax({
        url: "https://fakestoreapi.in/api/products",
        type: "GET",
        success: function (data) {
            //console.log(data.status)
            if (data.status == 'SUCCESS') {
                //let productData = JSON.stringify(data.products)
                console.log(data.products);
                localStorage.setItem('productList', JSON.stringify(data.products));
                for (let product of data.products) {
                    let { title, brand, image, price } = product
                    //console.log(title + " " + price);
                    if (product.id == 6) {
                        break;
                    }
                    if (product.id == 3) {
                        continue;
                    }
                    let productCard = $(`
                        <div class="card mt-3" style="width: 18rem;">
                            <img src=${image} class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${brand}</h5>
                                <p class="card-text">${title}</p>
                                <h6>$. ${price}</h6>
                                <button class="btn btn-primary">Buy now</button>
                            </div>
                        </div>
                        `);
                    $('.product-cards').append(productCard);
                }
                $(".card-text").expander({
                    slicePoint: 50, // Adjust text limit
                    expandText: "Read more",
                    collapseText: "Read less",
                    moreClass: "read-more",
                    lessClass: "read-less"
                });
            }

        },
        error: function (data) {
            console.log(data)

        }
    });

    $(".filter").on("click", function (event) {
        event.preventDefault();
        var buttonValue = $(this).text().toLowerCase();

        const products = JSON.parse(localStorage.getItem('productList'));

        if (buttonValue == 'all') {
            displayProduct(products)
        }
        else {
            let newList = []
            products.forEach((product) => {
                if (product.category.includes(buttonValue)) {
                    newList.push(product)
                }
            });
            displayProduct(newList);
        }
    });

    function displayProduct(list) {
        $('.card').hide();
        for (let product of list) {
            let { title, brand, image, price } = product
            let productCard = $(`
                <div class="card mt-3" style="width: 18rem;">
                    <img src=${image} class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${brand}</h5>
                        <p class="card-text">${title}</p>
                        <h6>$. ${price}</h6>
                        <button class="btn btn-primary">Buy now</button>
                    </div>
                </div>
                `);
            $('.product-cards').append(productCard);
        }
        $(".card-text").expander({
            slicePoint: 50, // Adjust text limit
            expandText: "Read more",
            collapseText: "Read less",
            moreClass: "read-more",
            lessClass: "read-less"
        });

    }



});