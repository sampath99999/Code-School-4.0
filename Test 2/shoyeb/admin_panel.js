$(document).ready(function() {
    $('#users-tab').click(function() {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
        $('#users-content').show();
        $('#order-items-content').hide();
        loadUsers();
    });

    $('#order-items-tab').click(function() {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
        $('#users-content').hide();
        $('#order-items-content').show();
        loadOrderItems();
    });

    // Load initial data
    loadUsers();

    function loadUsers() {
        $.ajax({
            url: 'admin_panel.php?action=users',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                const table = $('#users-table tbody');
                table.empty();
                console.log(data)
                data.forEach(user => {
                    table.append(`
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                        </tr>
                    `);
                });
            },
            error: function() {
                alert('Failed to load users');
            }
        });
    }

    function loadOrderItems() {
        $.ajax({
            url: 'admin_panel.php?action=order_items',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                const table = $('#order-items-table tbody');
                table.empty();
                
                data.forEach(item => {
                    table.append(`
                        <tr>
                            <td>${item.id}</td>

                            <td>${item.order_id}</td>
                            <td>${item.product_id}</td>
                            <td>${item.quantity}</td>
                            <td>$${item.price}</td>
                        </tr>
                    `);
                });
            },
            error: function() {
                alert('Failed to load order items');
            }
        });
    }
});