 function loadCart() {
    $.ajax({
      url: '/api/cart.php?action=get',  
      method: 'GET',
      headers:{
        "Authorization":localStorage.getItem("token")
      },
      dataType: 'json',
      success: function(response) {
        if (response.data.length > 0) {
          renderCartItems(response.data);
        } else {
          $('#cart-items').html('<tr><td colspan="6" class="text-center">Your cart is empty.</td></tr>');
          updateCartSummary(0);
        }
      },
      error: function() {
        $('#cart-items').html('<tr><td colspan="6" class="text-center text-danger">Error loading cart.</td></tr>');
        updateCartSummary(0);
      }
    });
  }

  
  function renderCartItems(items) {
    let rows = '';
    let subtotal = 0;

    items.forEach(item => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;

      rows += `
        <tr data-product-id="${item.id}">
          <td><img src="${item.image_url}" class="img-thumbnail" width="80" /></td>
          <td><strong>${item.name}</strong></td>
          <td>₹${item.price}</td>
          <td>
            <input type="number" min="1" value="${item.quantity}" class="form-control form-control-sm quantity-input" style="width: 60px;" />
          </td>
         
        </tr>
      `;
    });

    $('#cart-items').html(rows);
    updateCartSummary(subtotal);
  }

 
  function updateCartSummary(subtotal) {
   

    const shipping = subtotal > 0 ? 0 : 0; 
    const total = subtotal + shipping;
    console.log(subtotal)

    
    $(".cart-subtotal").text(`${subtotal}`)
    $(".cart-total").text(`${total}`)
   
  }


  $(document).on('change', '.quantity-input', function() {
    const row = $(this).closest('tr');
    const productId = row.data('product-id');
    const newQuantity = parseInt($(this).val());

    if (newQuantity < 1) {
      alert('Quantity must be at least 1');
      $(this).val(1);
      return;
    }


    $.ajax({
      url: '/api/cart.php',
      method: 'POST',
      data: { product_id: productId, quantity: newQuantity },
      dataType: 'json',
      success: function(response) {
        if (response.status === 200) {
          loadCart();
        } else {
          alert('Failed to update quantity: ' + response.message);
        }
      },
      error: function() {
        alert('Error updating quantity');
      }
    });
  });


  $(document).ready(function() {
    loadCart();
  });