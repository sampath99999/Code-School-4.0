$(document).ready(function() {
    console.log('login.js loaded'); // Debug: Confirm script loads
    console.log('Form exists:', $('#loginForm').length); // Debug: Should log 1

    // Password toggle functionality
    $('.toggle-password').click(function() {
        console.log('Toggle password clicked'); // Debug
        const $button = $(this);
        const $input = $button.siblings('input');
        const $icon = $button.find('i');
        if ($input.attr('type') === 'password') {
            $input.attr('type', 'text');
            $icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            $input.attr('type', 'password');
            $icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    // Handle form submission
    $('#loginForm').on('submit', function(e) {
        console.log('Form submit triggered'); // Debug
        e.preventDefault(); // Prevent default form submission

        // Clear previous validation feedback
        $('.is-invalid').removeClass('is-invalid');
        $('.invalid-feedback').text('');
        $('#loginAlert').addClass('d-none').find('#loginAlertMessage').text('');

        // Get form values
        const email = $('#loginEmail').val().trim();
        const password = $('#loginPassword').val();

        // Client-side validations
        let isValid = true;

        // Email: required, valid format
        if (!email) {
            $('#loginEmail').addClass('is-invalid');
            $('#emailFeedback').text('Email is required.');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            $('#loginEmail').addClass('is-invalid');
            $('#emailFeedback').text('Please enter a valid email address.');
            isValid = false;
        }

        // Password: required
        if (!password) {
            $('#loginPassword').addClass('is-invalid');
            $('#passwordFeedback').text('Password is required.');
            isValid = false;
        }

        console.log('Validation status:', isValid); // Debug
        if (!isValid) {
            console.log('Validation failed'); // Debug
            return; // Stop if validation fails
        }

        console.log('Validation passed, sending AJAX'); // Debug
        console.log('Request data:', { email, password: '[hidden]' });

        // AJAX request
        $.ajax({
            url: '/api/login.php',
            type: 'POST',
            data: {
                email: email,
                password: password
            },
            dataType: 'json',
            success: function(response) {
                console.log('Success response:', response);
                if (response.success) {
                    // Store token in localStorage
                    localStorage.setItem('admin_token', response.data.token);
                    $('#loginForm')[0].reset();
                    $('#loginAlert').removeClass('alert-danger').addClass('alert-success d-block')
                        .find('#loginAlertMessage').text(response.message + ' Redirecting to dashboard...');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 2000);
                } else {
                    $('#loginAlert').removeClass('d-none').find('#loginAlertMessage').text(response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error response:', xhr);
                const message = xhr.responseJSON?.message || xhr.statusText || error;
                $('#loginAlert').removeClass('d-none').find('#loginAlertMessage').text('Request failed: ' + message);
            },
            complete: function() {
                console.log('AJAX complete'); // Debug
                const $button = $('#loginButton');
                $button.prop('disabled', false).html('<i class="fas fa-sign-in-alt me-2"></i> Login');
            }
        });
    });
});