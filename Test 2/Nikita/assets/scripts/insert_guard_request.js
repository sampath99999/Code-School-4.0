$(document).ready(function () {
    console.log("insert_guard_request.js is loaded");

    $('#addRequestForm').on('submit', function (e) {
        e.preventDefault();
        console.log("Form is submitted");

        let visitor_name = $('#visitor_name').val().trim();
        let flat_number = $('#flat_number').val().trim();
        let number = $('#number').val().trim();
        let bike_number = $('#bike_number').val().trim();


        if (visitor_name.length <= 3) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Visitor Name',
                text: 'Name must be longer than 3 characters.'
            });
            return;
        }

        if (!/^\d{10}$/.test(number)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Phone Number',
                text: 'Phone number must be exactly 10 digits.'
            });
            return;
        }

       
        $.ajax({
            url: '/API/insert_guard_request.php',
            type: 'POST',
            data: {
                visitor_name: visitor_name,
                flat_number: flat_number,
                number: number,
                bike_number: bike_number
            },
            dataType: 'json',
            success: function (response) {
                console.log("response from modal", response);
                if (response.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: response.message
                    }).then(() => {
                        $('#addRequest').modal('hide');
                        $('#addRequestForm')[0].reset();
                        window.location.reload();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", status, error);
                Swal.fire({
                    icon: 'error',
                    title: 'Request Failed',
                    text: 'Something went wrong. Please try again.'
                });
            }
        });
    });
});
