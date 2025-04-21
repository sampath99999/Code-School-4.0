$(document).ready(function() {
    console.log("approve request js file is loaded successfully");
    $(document).on('click', '.approveBtn', function() {
        const requestId = $(this).data('request-id');

        if (!confirm("Are you sure you want to approve this request?")) {
            return;
        }

        $.ajax({
            url: '/API/request_approve.php',
            type: 'POST',
            data: {
                request_id: requestId,
                status: 'approve'
            },
            dataType: 'json',
            success: function(response) {
                console.log("Response:", response);
                if (response.status === 'success') {
                    alert("Request approved successfully!");
                    location.reload(); 
                } else {
                    alert("Error: " + response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error:", status, error);
                alert('Something went wrong while approving the request.');
            }
        });
    });
});
