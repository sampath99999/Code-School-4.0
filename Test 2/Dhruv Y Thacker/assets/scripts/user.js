let token = sessionStorage.getItem("token");
if (!token) {
    window.location.href = "index.html";
}

$(document).ready(function() {
    // Load navbar
    $("#navbar").load("navbar.html", function() {
        // Load profile and payslips
        loadProfile();
        loadPayslips();
    });
});

function loadProfile() {
    $.ajax({
        url: "api/getProfile.php",
        type: "GET",
        headers: {
            "Authorization": token
        },
        success: function(res) {
            if (res.status) {
                const employee = res.data;
                $("#profileInfo").html(`
                    <div class="mb-3">
                        <label class="form-label fw-bold">Name</label>
                        <p class="mb-2">${employee.name}</p>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Email</label>
                        <p class="mb-2">${employee.email}</p>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Department</label>
                        <p class="mb-2">${employee.department}</p>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Designation</label>
                        <p class="mb-2">${employee.designation}</p>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Phone</label>
                        <p class="mb-2">${employee.phone}</p>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Date of Birth</label>
                        <p class="mb-2">${employee.dob}</p>
                    </div>
                `);
            } else {
                Swal.fire("Error", res.message || "Failed to load profile", "error");
            }
        },
        error: function(err) {
            Swal.fire("Error", err.responseJSON?.message || "Failed to load profile", "error");
        }
    });
}

function loadPayslips() {
    $.ajax({
        url: "api/getMyPayslips.php",
        type: "GET",
        headers: {
            "Authorization": token
        },
        success: function(res) {
            if (res.status) {
                const payslips = res.data;
                const tbody = $("#payslipsTableBody");
                tbody.empty();

                if (payslips.length === 0) {
                    tbody.html(`
                        <tr>
                            <td colspan="5" class="text-center">No payslips found</td>
                        </tr>
                    `);
                    return;
                }

                payslips.forEach(payslip => {
                    tbody.append(`
                        <tr>
                            <td>${payslip.month_name}</td>
                            <td>${payslip.year}</td>
                            <td>${new Date(payslip.created_at).toLocaleDateString()}</td>
                            <td>₹${parseFloat(payslip.net_salary).toFixed(2)}</td>
                            <td>
                                <button class="btn btn-sm btn-info view-payslip" 
                                        data-payslip-id="${payslip.id}">
                                    <i class="fas fa-eye"></i> View
                                </button>
                            </td>
                        </tr>
                    `);
                });
            } else {
                Swal.fire("Error", res.message || "Failed to load payslips", "error");
            }
        },
        error: function(err) {
            Swal.fire("Error", err.responseJSON?.message || "Failed to load payslips", "error");
        }
    });
}

//View Payslip button 
$(document).on('click', '.view-payslip', function() {
    const payslipId = $(this).data('payslip-id');
    
    $.ajax({
        url: "api/getPayslipDetails.php",
        type: "GET",
        headers: {
            "Authorization": token
        },
        data: { payslipId: payslipId },
        success: function(res) {
            if (res.status) {
                const data = res.data;
                let earningsHtml = '';
                let deductionsHtml = '';
                let totalEarnings = 0;
                let totalDeductions = 0;

                // Process earnings
                data.earnings.forEach(earning => {
                    earningsHtml += `
                        <tr>
                            <td>${earning.description}</td>
                            <td class="text-end">₹${parseFloat(earning.amount).toFixed(2)}</td>
                        </tr>
                    `;
                    totalEarnings += parseFloat(earning.amount);
                });

                // Process deductions
                data.deductions.forEach(deduction => {
                    deductionsHtml += `
                        <tr>
                            <td>${deduction.description}</td>
                            <td class="text-end">₹${parseFloat(deduction.amount).toFixed(2)}</td>
                        </tr>
                    `;
                    totalDeductions += parseFloat(deduction.amount);
                });

                // Show payslip details
                Swal.fire({
                    title: 'Payslip Details',
                    html: `
                        <div class="text-start">
                            <h6 class="mb-3">Employee Information</h6>
                            <p><strong>Name:</strong> ${data.employee.name}</p>
                            <p><strong>Department:</strong> ${data.employee.department}</p>
                            <p><strong>Designation:</strong> ${data.employee.designation}</p>
                            
                            <h6 class="mb-3 mt-4">Payslip Information</h6>
                            <p><strong>Month:</strong> ${data.payslip.month_name}</p>
                            <p><strong>Year:</strong> ${data.payslip.year}</p>
                            <p><strong>Generated On:</strong> ${new Date(data.payslip.created_at).toLocaleDateString()}</p>
                            
                            <h6 class="mb-3 mt-4">Salary Details</h6>
                            <div class="table-responsive">
                                <table class="table table-bordered">
                                    <tbody>
                                        ${earningsHtml}
                                        <tr class="table-light">
                                            <th>Total Earnings</th>
                                            <th class="text-end">₹${totalEarnings.toFixed(2)}</th>
                                        </tr>
                                        ${deductionsHtml}
                                        <tr class="table-light">
                                            <th>Total Deductions</th>
                                            <th class="text-end">₹${totalDeductions.toFixed(2)}</th>
                                        </tr>
                                        <tr class="table-primary">
                                            <th>Net Salary</th>
                                            <th class="text-end">₹${(totalEarnings - totalDeductions).toFixed(2)}</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    `,
                    width: '800px',
                    showCloseButton: true,
                    showConfirmButton: false
                });
            } else {
                Swal.fire('Error', res.message || 'Failed to fetch payslip details', 'error');
            }
        },
        error: function(err) {
            console.error('Error fetching payslip:', err);
            Swal.fire('Error', err.responseJSON?.message || 'Failed to fetch payslip details', 'error');
        }
    });
}); 