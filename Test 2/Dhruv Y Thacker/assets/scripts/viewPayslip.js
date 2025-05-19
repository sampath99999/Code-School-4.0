let token = sessionStorage.getItem("token");
if (!token) {
    window.location.href = "index.html";
}

$(document).ready(function() {
    // Load navbar
    $("#navbar").load("navbar.html", function() {
        const urlParams = new URLSearchParams(window.location.search);
        const employeeId = urlParams.get('employeeId');
        
        if (!employeeId) {
            Swal.fire('Error', 'Employee ID is required', 'error').then(() => {
                window.location.href = 'employeeList.html';
            });
            return;
        }

        // Fetch payslip details
        $.ajax({
            url: 'api/getPayslipDetails.php',
            type: 'GET',
            headers: {
                "Authorization": token
            },
            data: { employeeId: employeeId },
            success: function(res) {
                if (res.status) {
                    const payslip = res.data;
                    
                    // Update employee information
                    $('#employeeName').text(payslip.name);
                    $('#department').text(payslip.department);
                    $('#designation').text(payslip.designation);
                    
                    // Update payslip information
                    const monthNames = ["January", "February", "March", "April", "May", "June",
                                      "July", "August", "September", "October", "November", "December"];
                    $('#month').text(monthNames[parseInt(payslip.month) - 1]);
                    $('#year').text(payslip.year);
                    $('#generatedAt').text(new Date(payslip.generated_at).toLocaleDateString());
                    
                    // Update salary details
                    $('#basicSalary').text('₹' + parseFloat(payslip.basic_salary).toFixed(2));
                    $('#allowances').text('₹' + parseFloat(payslip.allowances).toFixed(2));
                    $('#deductions').text('₹' + parseFloat(payslip.deductions).toFixed(2));
                    $('#totalSalary').text('₹' + parseFloat(payslip.total_salary).toFixed(2));
                } else {
                    Swal.fire('Error', res.message || 'Failed to fetch payslip details', 'error');
                }
            },
            error: function(err) {
                Swal.fire('Error', err.responseJSON?.message || 'Failed to fetch payslip details', 'error');
            }
        });
    });
}); 