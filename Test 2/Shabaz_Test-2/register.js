$(document).ready(function() {
    console.log('register.js loaded'); // Debug: Confirm script loads
    console.log('Form exists:', $('#signupForm').length); // Debug: Should log 1

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

    // Password strength indicator
    $('#password').on('input', function() {
        console.log('Password input changed'); // Debug
        const password = $(this).val();
        const $strengthBar = $('#passwordStrengthBar');
        const $strengthText = $('#passwordStrengthText');
        const $strengthContainer = $('#passwordStrength');
        let strength = 0;

        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/\d/.test(password)) strength += 25;

        $strengthContainer.removeClass('d-none');
        $strengthBar.css('width', strength + '%');

        if (strength <= 25) {
            $strengthBar.removeClass('bg-success bg-warning').addClass('bg-danger');
            $strengthText.text('Weak');
        } else if (strength <= 50) {
            $strengthBar.removeClass('bg-success bg-danger').addClass('bg-warning');
            $strengthText.text('Medium');
        } else {
            $strengthBar.removeClass('bg-warning bg-danger').addClass('bg-success');
            $strengthText.text('Strong');
        }

        if (!password) {
            $strengthContainer.addClass('d-none');
            $strengthBar.css('width', '0%');
        }
    });

    // Handle form submission
    $('#signupForm').on('submit', function(e) {
        console.log('Form submit triggered'); // Debug
        e.preventDefault(); // Prevent default form submission

        // Clear previous validation feedback
        $('.is-invalid').removeClass('is-invalid');
        $('.invalid-feedback').text('');
        $('#signupAlert').addClass('d-none').find('#signupAlertMessage').text('');

        // Get form values
        const username = $('#username').val().trim();
        const email = $('#email').val().trim();
        const password = $('#password').val();
        const confirmPassword = $('#confirmPassword').val();
        const agreeTerms = $('#agreeTerms').is(':checked');

        // Client-side validations
        let isValid = true;

        // Username: required, 3+ chars, alphanumeric with underscores/hyphens
        if (!username) {
            $('#username').addClass('is-invalid');
            $('#usernameFeedback').text('Username is required.');
            isValid = false;
        } else if (!/^[a-zA-Z0-9_-]{3,}$/.test(username)) {
            $('#username').addClass('is-invalid');
            $('#usernameFeedback').text('Username must be at least 3 characters and contain only letters, numbers, underscores, or hyphens.');
            isValid = false;
        }

        // Email: required, valid format
        if (!email) {
            $('#email').addClass('is-invalid');
            $('#emailFeedback').text('Email is required.');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            $('#email').addClass('is-invalid');
            $('#emailFeedback').text('Please enter a valid email address.');
            isValid = false;
        }

        // Password: required, 8+ chars, 1 uppercase, 1 lowercase, 1 number
        if (!password) {
            $('#password').addClass('is-invalid');
            $('#passwordFeedback').text('Password is required.');
            isValid = false;
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
            $('#password').addClass('is-invalid');
            $('#passwordFeedback').text('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.');
            isValid = false;
        }

        // Confirm Password: required, must match password
        if (!confirmPassword) {
            $('#confirmPassword').addClass('is-invalid');
            $('#confirmPasswordFeedback').text('Confirm password is required.');
            isValid = false;
        } else if (password !== confirmPassword) {
            $('#confirmPassword').addClass('is-invalid');
            $('#confirmPasswordFeedback').text('Passwords do not match.');
            isValid = false;
        }

        // Terms: must be checked
        if (!agreeTerms) {
            $('#agreeTerms').addClass('is-invalid');
            $('#agreeTermsFeedback').text('You must agree to the terms and conditions.');
            isValid = false;
        }

        console.log('Validation status:', isValid); // Debug
        if (!isValid) {
            console.log('Validation failed'); // Debug
            return; // Stop if validation fails
        }

        console.log('Validation passed, sending AJAX'); // Debug
        console.log('Request data:', { username, email, password: '[hidden]', confirm_password: '[hidden]' });

        // AJAX request
        $.ajax({
            url: '/api/register.php',
            type: 'POST',
            data: {
                username: username,
                email: email,
                password: password,
                confirm_password: confirmPassword
            },
            dataType: 'json',
            success: function(response) {
                console.log('Success response:', response);
                if (response.status === 'success') {
                    $('#signupForm')[0].reset();
                    $('#passwordStrength').addClass('d-none');
                    $('#signupAlert').removeClass('alert-danger').addClass('alert-success d-block')
                        .find('#signupAlertMessage').text(response.message + ' Redirecting to login...');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    $('#signupAlert').removeClass('d-none').find('#signupAlertMessage').text(response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error response:', xhr);
                const message = xhr.responseJSON?.message || xhr.statusText || error;
                $('#signupAlert').removeClass('d-none').find('#signupAlertMessage').text('Request failed: ' + message);
            },
            complete: function() {
                console.log('AJAX complete'); // Debug
                const $button = $('#signupButton');
                $button.prop('disabled', false).html('<i class="fas fa-user-plus me-2"></i> Create Account');
            }
        });
    });
});