$(document).ready(function () {
    $('#add-product-form').submit(function (e) {
        e.preventDefault();

        const data = {
            name: $('#name').val(),
            description: $('#description').val(),
            price: $('#price').val(),
            stock_quantity: $('#stock_quantity').val() || 0,
            image_url: $('#image_url').val()
        };
console.log(data)
        $.ajax({
            url: 'api/adminMain.php',
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: data,
            success: function (response) {
                $('#add-msg').text('✅ Product added successfully').css('color', 'green');
                    $('#add-product-form')[0].reset();
            },
            error: function () {
                $('#add-msg').text('❌ Server error. Please try again.').css('color', 'red');
            }
        });
    });
});
