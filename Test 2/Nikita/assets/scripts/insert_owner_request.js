
$(document).on('click', '.sendRequestBtn', function () {
    const requestId = $(this).data('request-id');
    console.log("insert_owner_request.js file is loaded");
    $.ajax({
        url: '/API/insert_owner_request.php',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ request_id: requestId }),
        success: function (response) {
            if (response.status) {
                Swal.fire('Success', response.message, 'success');
            } else {
                Swal.fire('Error', response.message, 'error');
            }
        },
        error: function (err) {
            console.error("Error:", err);
            Swal.fire('Error', 'Failed to send request', 'error');
        }
    });
});
