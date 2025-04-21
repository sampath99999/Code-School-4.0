$(document).ready(function () {
    // Toggle visibility of Login and Logout buttons
    function toggleLoginLogoutButtons() {
        const userRole = localStorage.getItem('Role');
        if (userRole) {
            $('#logoutButton').show();
            $('#loginButton').hide();
        } else {
            $('#loginButton').show();
            $('#logoutButton').hide();
        }
    }
    toggleLoginLogoutButtons();

    $('#logoutButton').on('click', function () {
        localStorage.removeItem('Role');
        Swal.fire({
            icon: 'success',
            title: 'Logged Out',
            text: 'You have been successfully logged out.',
            timer: 1500,
            showConfirmButton: false,
        });
        toggleLoginLogoutButtons();
    });

    $('#addEmployeeForm').on('submit', function (e) {
        e.preventDefault();

        const employeeData = {
            fullName: $('#employeeName').val().trim(),
            email: $('#employeeEmail').val().trim(),
            password: $('#employeePassword').val().trim(),
            role: $('#employeeRole').val().trim(),
            department: $('#employeeDepartment').val().trim(),
            position: $('#employeePosition').val().trim(),
            hireDate: $('#employeeHireDate').val().trim(),
        };

        // AJAX call to backend
        $.ajax({
            url: 'http://localhost:5000/backend/addEmployee.php',
            type: 'POST',
            data: employeeData,
            dataType: 'json', 
            success: function (response) {
                console.log(response);
                if (response && response.status) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Employee Added',
                        text: response.message,
                        timer: 2000,
                        showConfirmButton: false,
                    });
                    $('#addEmployeeModal').modal('hide');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'Unexpected error occurred.',
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error('XHR Response:', xhr.responseText);
                console.error('Status:', status);
                console.error('Error:', error);

                Swal.fire({
                    icon: 'error',
                    title: 'Failed',
                    text: 'Failed to add employee. Please try again later.',
                });
            },
        });
    });
});