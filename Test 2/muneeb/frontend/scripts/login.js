$(document).ready(function () {
    // Validation function for input fields
    function validateField(field, validationFn, errorMessage) {
        const value = field.val().trim();
        let errorContainer = field.next('.error-message');

        // Create error container if it doesn't exist
        if (!errorContainer.length) {
            errorContainer = $('<div class="error-message text-danger mt-1"></div>');
            field.after(errorContainer);
        }

        if (validationFn(value)) {
            field.removeClass('is-invalid').addClass('is-valid');
            errorContainer.text('');
            return true;
        } else {
            field.removeClass('is-valid').addClass('is-invalid');
            errorContainer.text(errorMessage);
            return false;
        }
    }

    // Specific validation logic
    const isNotEmpty = value => value !== '';
    const isEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    // Form submission event
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();

        const emailField = $('#email');
        const passwordField = $('#password');

        // Validations
        const isEmailValid = validateField(emailField, isEmail, 'Please enter a valid email address');
        const isPasswordValid = validateField(passwordField, isNotEmpty, 'Password cannot be empty');

        if (isEmailValid && isPasswordValid) {
            // AJAX call for form submission
            $.ajax({
                url: 'http://localhost:5000/backend/login.php', // Backend URL
                type: 'POST',
                dataType: 'json', // Expect JSON response
                data: {
                    email: emailField.val().trim(),
                    password: passwordField.val().trim()
                },
                success: function (response) {
                    console.log('AJAX Response:', response); // Debugging response
                    
                    // Check response status and role
                    if (response.status === true) {
                        const userRole = response.data.role.trim(); // Ensure no extra spaces
                        
                        if (userRole === 'HR') {
                            localStorage.setItem('Role', 'HR');
                            Swal.fire({
                                icon: 'success',
                                title: 'Login Successful',
                                text: 'Redirecting to HR Dashboard...',
                                timer: 2000,
                                showConfirmButton: false
                            }).then(() => {
                                window.location.href = './hrDashboard.html';
                            });
                        } else if (userRole === 'Employee') {
                            localStorage.setItem('Role', 'Employee');
                            Swal.fire({
                                icon: 'success',
                                title: 'Login Successful',
                                text: 'Redirecting to Employee Dashboard...',
                                timer: 2000,
                                showConfirmButton: false
                            }).then(() => {
                                window.location.href = './employeeDashboard.html';
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Invalid Role',
                                text: 'Please contact support for assistance.',
                            });
                        }
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Login Failed',
                            text: 'Invalid credentials. Please try again.',
                        });
                    }
                },
                error: function (xhr, status, error) {
                    console.error('AJAX Error:', xhr, status, error); // Log error for debugging
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        text: 'Please check your credentials or try again later.',
                    });
                }
            });
        }
    });

    // Real-time validation for email and password fields
    $('#email').on('blur', function () {
        validateField($(this), isEmail, 'Please enter a valid email address');
    });

    $('#password').on('blur', function () {
        validateField($(this), isNotEmpty, 'Password cannot be empty');
    });
});