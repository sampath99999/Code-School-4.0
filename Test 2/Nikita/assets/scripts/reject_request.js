$(document).on('click', '.rejectBtn', function() {
    console.log("reject Request js file is loaded");
    const requestId = $(this).data('request-id');
    console.log("request_id for reject action:",requestId);
    if (confirm('Are you sure you want to reject this request?')) {
        changeRequestStatus(requestId, 'reject');
    }
});

function changeRequestStatus(requestId, status) {
    $.ajax({
        url: '/API/request_reject.php',  
        type: 'POST',
        data: { request_id: requestId, status: status },
        success: function(response) {
            console.log(response);
        },
        error: function(err) {
            console.error("Error rejecting request:", err);
        }
    });
    window.location.reload();
}
