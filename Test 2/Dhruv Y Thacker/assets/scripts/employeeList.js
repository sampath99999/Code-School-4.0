let token = sessionStorage.getItem("token");
if (!token) {
    window.location.href = "index.html";
}

$(document).ready(function() {
    $("#navbar").load("navbar.html", function() {
        loadEmployees();
    });

    // Modal for Add Employee
    const addEmployeeModal = `
        <div class="modal fade" id="addEmployeeModal" tabindex="-1" aria-labelledby="addEmployeeModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addEmployeeModalLabel">Add Employee</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addEmployeeForm">
                            <div class="mb-3">
                                <label for="name" class="form-label">Name</label>
                                <input type="text" class="form-control" id="name" required>
                                <p class="text-danger small mt-1"></p>
                            </div>
                            <div class="mb-3">
                                <label for="dob" class="form-label">Date of Birth</label>
                                <input type="date" class="form-control" id="dob" required>
                                <p class="text-danger small mt-1"></p>
                            </div>
                            <div class="mb-3">
                                <label for="phone" class="form-label">Phone</label>
                                <input type="text" class="form-control" id="phone" required>
                                <p class="text-danger small mt-1"></p>
                            </div>
                            <div class="mb-3">
                                <label for="designation" class="form-label">Designation</label>
                                <input type="text" class="form-control" id="designation" required>
                                <p class="text-danger small mt-1"></p>
                            </div>
                            <div class="mb-3">
                                <label for="department" class="form-label">Department</label>
                                <input type="text" class="form-control" id="department" required>
                                <p class="text-danger small mt-1"></p>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" required>
                                <p class="text-danger small mt-1"></p>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="password" required>
                                <p class="text-danger small mt-1"></p>
                            </div>
                            <div class="mb-3">
                                <label for="role" class="form-label">Role</label>
                                <select class="form-control" id="role" required>
                                    <option value="admin">Admin</option>
                                    <option value="employee">Employee</option>
                                </select>
                                <p class="text-danger small mt-1"></p>
                            </div>
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('body').append(addEmployeeModal);

    $("#addEmployeeBtn").click(function() {
        $('#addEmployeeModal').modal('show');
    });

    $("#addEmployeeForm").submit(function(e) {
        e.preventDefault();
        
        const formData = {
            name: $("#name").val(),
            dob: $("#dob").val(),
            phone: $("#phone").val(),
            designation: $("#designation").val(),
            department: $("#department").val(),
            email: $("#email").val(),
            password: $("#password").val(),
            role: $("#role").val()
        };

        $(".text-danger").text("");

        // Validate form data
        let isValid = true;
        if (!formData.name.trim()) {
            $("#name").next(".text-danger").text("Name is required");
            isValid = false;
        }
        if (!formData.dob) {
            $("#dob").next(".text-danger").text("Date of birth is required");
            isValid = false;
        }
        if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
            $("#phone").next(".text-danger").text("Valid 10-digit phone number is required");
            isValid = false;
        }
        if (!formData.designation.trim()) {
            $("#designation").next(".text-danger").text("Designation is required");
            isValid = false;
        }
        if (!formData.department.trim()) {
            $("#department").next(".text-danger").text("Department is required");
            isValid = false;
        }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            $("#email").next(".text-danger").text("Valid email is required");
            isValid = false;
        }
        if (!formData.password.trim() || formData.password.length < 6) {
            $("#password").next(".text-danger").text("Password must be at least 6 characters");
            isValid = false;
        }
        if (!formData.role) {
            $("#role").next(".text-danger").text("Role is required");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // Submit form data
        $.ajax({
            url: "api/addEmployee.php",
            type: "POST",
            headers: {
                "Authorization": token
            },
            data: formData,
            success: function(res) {
                if (res.status) {
                    $("#addEmployeeModal").modal("hide");
                    $("#addEmployeeForm")[0].reset();
                    
                    Swal.fire("Success", res.message, "success");
                    
                    loadEmployees();
                } else {
                    Swal.fire("Error", res.message, "error");
                }
            },
            error: function(err) {
                const errorMessage = err.responseJSON?.message || "Failed to add employee";
                Swal.fire("Error", errorMessage, "error");
            }
        });
    });


////////////////////////////////////////////////////////////////


    // Add Generate Payslip Modal
    const generatePayslipModal = `
        <div class="modal fade" id="generatePayslipModal" tabindex="-1" aria-labelledby="generatePayslipModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="generatePayslipModalLabel">Generate Payslip</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="generatePayslipForm">
                            <input type="hidden" id="employeeId" name="employeeId">
                            <div class="row g-3 mb-4">
                                <div class="col-12 col-md-6">
                                    <label for="month" class="form-label">Month</label>
                                    <select class="form-control" id="month" name="month" required>
                                        <option value="">Select Month</option>
                                        <option value="1">January</option>
                                        <option value="2">February</option>
                                        <option value="3">March</option>
                                        <option value="4">April</option>
                                        <option value="5">May</option>
                                        <option value="6">June</option>
                                        <option value="7">July</option>
                                        <option value="8">August</option>
                                        <option value="9">September</option>
                                        <option value="10">October</option>
                                        <option value="11">November</option>
                                        <option value="12">December</option>
                                    </select>
                                </div>
                                <div class="col-12 col-md-6">
                                    <label for="year" class="form-label">Year</label>
                                    <select class="form-control" id="year" name="year" required>
                                        <option value="">Select Year</option>
                                    </select>
                                </div>
                            </div>

                            <div class="row g-3">
                                <div class="col-12 col-lg-6">
                                    <div class="card h-100">
                                        <div class="card-header bg-light">
                                            <h6 class="mb-0">Earnings</h6>
                                        </div>
                                        <div class="card-body">
                                            <div id="earningsContainer" class="mb-3">
                                                <!-- Earnings will be added here dynamically -->
                                            </div>
                                            <button type="button" class="btn btn-sm btn-outline-primary w-100" id="addEarning">
                                                <i class="fas fa-plus me-2"></i>Add Earning
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-lg-6">
                                    <div class="card h-100">
                                        <div class="card-header bg-light">
                                            <h6 class="mb-0">Deductions</h6>
                                        </div>
                                        <div class="card-body">
                                            <div id="deductionsContainer" class="mb-3">
                                                <!-- Deductions will be added here dynamically -->
                                            </div>
                                            <button type="button" class="btn btn-sm btn-outline-primary w-100" id="addDeduction">
                                                <i class="fas fa-plus me-2"></i>Add Deduction
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="card mt-4">
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-bordered mb-0">
                                            <tr>
                                                <th class="text-nowrap">Total Earnings</th>
                                                <td id="totalEarnings" class="text-end">₹0.00</td>
                                            </tr>
                                            <tr>
                                                <th class="text-nowrap">Total Deductions</th>
                                                <td id="totalDeductions" class="text-end">₹0.00</td>
                                            </tr>
                                            <tr class="table-primary">
                                                <th class="text-nowrap">Net Salary</th>
                                                <td id="netSalary" class="text-end">₹0.00</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-primary">Generate Payslip</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('body').append(generatePayslipModal);


    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 2; year <= currentYear + 1; year++) {
        $('#year').append(`<option value="${year}">${year}</option>`);
    }

    let availableComponents = [];
    let currentEarnings = [];
    let currentDeductions = [];

    $(document).on('click', '.generate-payslip', function() {
        const employeeId = $(this).data('employee-id');
        $('#employeeId').val(employeeId);
        
        $('#earningsContainer').empty();
        $('#deductionsContainer').empty();
        updateTotals();

        $.ajax({
            url: 'api/getEmployeeDetails.php',
            type: 'GET',
            headers: {
                "Authorization": token
            },
            data: { employeeId: employeeId },
            success: function(res) {
                console.log("Response data:", JSON.stringify(res, null, 2));
                
                if (res.status) {
                    $('#generateEmployeeName').text(res.data.employee.name || '-');
                    $('#generateEmployeeDept').text(res.data.employee.department || '-');
                    $('#generateEmployeeDesig').text(res.data.employee.designation || '-');
                    $('#generateEmployeeEmail').text(res.data.employee.email || '-');
                    $('#generateEmployeePhone').text(res.data.employee.phone || '-');

                    availableComponents = res.data.available_components || { earnings: [], deductions: [] };
                    currentEarnings = res.data.current_earnings || [];
                    currentDeductions = res.data.current_deductions || [];

                    console.log("Available Components:", JSON.stringify(availableComponents, null, 2));
                    console.log("Current Earnings:", JSON.stringify(currentEarnings, null, 2));
                    console.log("Current Deductions:", JSON.stringify(currentDeductions, null, 2));

                    if (currentEarnings.length > 0) {
                        currentEarnings.forEach(earning => {
                            addComponentRow('earnings', earning);
                        });
                    } else {
                        addComponentRow('earnings');
                    }

                    if (currentDeductions.length > 0) {
                        currentDeductions.forEach(deduction => {
                            addComponentRow('deductions', deduction);
                        });
                    } else {
                        addComponentRow('deductions');
                    }

                    updateTotals();
                } else {
                    Swal.fire('Error', res.message || 'Failed to fetch employee details', 'error');
                }
            },
            error: function(err) {
                console.error("Error fetching employee details:", err);
                Swal.fire('Error', 'Failed to fetch employee details', 'error');
            }
        });
    });

    function addComponentRow(type, existingData = null) {
        const container = type === 'earnings' ? '#earningsContainer' : '#deductionsContainer';
        const components = type === 'earnings' ? 
            (availableComponents.earnings || []) : 
            (availableComponents.deductions || []);
        
        console.log(`Adding ${type} row with components:`, JSON.stringify(components, null, 2));
        
        const row = $(`
            <div class="row g-2 mb-2 component-row">
                <div class="col-12 col-sm-5">
                    <select class="form-select component-select" required>
                        <option value="">Select ${type === 'earnings' ? 'Earning' : 'Deduction'}</option>
                        ${components.map(c => `
                            <option value="${c.id}" ${existingData && existingData.earning_deduction_id == c.id ? 'selected' : ''}>
                                ${c.description}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div class="col-12 col-sm-5">
                    <div class="input-group">
                        <span class="input-group-text">₹</span>
                        <input type="number" class="form-control component-amount" 
                               placeholder="Amount" required min="0" step="0.01"
                               value="${existingData ? existingData.amount : ''}"
                               style="min-width: 150px;">
                    </div>
                </div>
                <div class="col-12 col-sm-2">
                    <button type="button" class="btn btn-danger w-100 remove-component">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `);

        $(container).append(row);
    }

    $('#addEarning').click(function() {
        addComponentRow('earnings');
    });

    $('#addDeduction').click(function() {
        addComponentRow('deductions');
    });

    $(document).on('click', '.remove-component', function() {
        $(this).closest('.component-row').remove();
        updateTotals();
    });

    $(document).on('input', '.component-amount', updateTotals);

    function updateTotals() {
        let totalEarnings = 0;
        let totalDeductions = 0;

        $('.component-row').each(function() {
            const amount = parseFloat($(this).find('.component-amount').val()) || 0;
            const isEarning = $(this).closest('#earningsContainer').length > 0;
            
            if (isEarning) {
                totalEarnings += amount;
            } else {
                totalDeductions += amount;
            }
        });

        const netSalary = totalEarnings - totalDeductions;

        $('#totalEarnings').text('₹' + totalEarnings.toFixed(2));
        $('#totalDeductions').text('₹' + totalDeductions.toFixed(2));
        $('#netSalary').text('₹' + netSalary.toFixed(2));
    }

    $('#generatePayslipForm').submit(function(e) {
        e.preventDefault();
        
        const components = [];
        let totalEarnings = 0;
        let totalDeductions = 0;

        $('.component-row').each(function() {
            const select = $(this).find('.component-select');
            const amount = parseFloat($(this).find('.component-amount').val()) || 0;
            const isEarning = $(this).closest('#earningsContainer').length > 0;
            
            if (select.val() && amount > 0) {
                components.push({
                    id: select.val(),
                    amount: amount
                });

                if (isEarning) {
                    totalEarnings += amount;
                } else {
                    totalDeductions += amount;
                }
            }
        });

        const formData = {
            employeeId: $('#employeeId').val(),
            month: $('#month').val(),
            year: $('#year').val(),
            components: JSON.stringify({
                items: components,
                totalSalary: totalEarnings - totalDeductions
            })
        };

        $.ajax({
            url: 'api/generatePayslip.php',
            type: 'POST',
            headers: {
                "Authorization": token
            },
            data: formData,
            success: function(res) {
                if (res.status) {
                    Swal.fire('Success', 'Payslip generated successfully', 'success').then(() => {
                        $('#generatePayslipModal').modal('hide');
                    });
                } else {
                    Swal.fire('Error', res.message || 'Failed to generate payslip', 'error');
                }
            },
            error: function(err) {
                Swal.fire('Error', err.responseJSON?.message || 'Failed to generate payslip', 'error');
            }
        });
    });

    const viewYearOptions = new Date().getFullYear();
    for (let year = viewYearOptions - 2; year <= viewYearOptions + 1; year++) {
        $('#viewYear').append(`<option value="${year}">${year}</option>`);
    }

    $(document).on('click', '.view-payslip', function(e) {
        e.preventDefault();
        const employeeId = $(this).data('employee-id');
        $('#viewEmployeeId').val(employeeId);
        
        $.ajax({
            url: 'api/getEmployeeDetails.php',
            type: 'GET',
            headers: {
                "Authorization": token
            },
            data: { employeeId: employeeId },
            success: function(res) {
                if (res.status) {
                    $('#viewEmployeeName').text(res.data.employee.name || '-');
                    $('#viewEmployeeDept').text(res.data.employee.department || '-');
                    $('#viewEmployeeDesig').text(res.data.employee.designation || '-');
                    $('#viewEmployeeEmail').text(res.data.employee.email || '-');
                    $('#viewEmployeePhone').text(res.data.employee.phone || '-');
                }
            }
        });
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        
        $('#viewMonth').val(currentMonth);
        $('#viewYear').val(currentYear);
        
        $('#viewPayslipModal').modal('show');
    });

    $('#viewPayslipForm').submit(function(e) {
        e.preventDefault();
        
        const requestData = {
            employeeId: $('#viewEmployeeId').val(),
            month: $('#viewMonth').val(),
            year: $('#viewYear').val()
        };
        
        $.ajax({
            url: 'api/getPayslipId.php',
            type: 'GET',
            headers: {
                "Authorization": token
            },
            data: requestData,
            success: function(res) {
                if (res.status && res.data && res.data.payslipId) {
                    $.ajax({
                        url: 'api/getPayslipDetails.php',
                        type: 'GET',
                        headers: {
                            "Authorization": token
                        },
                        data: { payslipId: res.data.payslipId },
                        success: function(res) {
                            if (res.status) {
                                const data = res.data;
                                let earningsHtml = '';
                                let deductionsHtml = '';
                                let totalEarnings = 0;
                                let totalDeductions = 0;

                                data.earnings.forEach(earning => {
                                    earningsHtml += `
                                        <tr>
                                            <td>${earning.description}</td>
                                            <td class="text-end">₹${parseFloat(earning.amount).toFixed(2)}</td>
                                        </tr>
                                    `;
                                    totalEarnings += parseFloat(earning.amount);
                                });

                                data.deductions.forEach(deduction => {
                                    deductionsHtml += `
                                        <tr>
                                            <td>${deduction.description}</td>
                                            <td class="text-end">₹${parseFloat(deduction.amount).toFixed(2)}</td>
                                        </tr>
                                    `;
                                    totalDeductions += parseFloat(deduction.amount);
                                });

                                const payslipContent = `
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
                                `;

                                $('#payslipDetailsContent').html(payslipContent);
                                $('#viewPayslipModal').modal('hide');
                                $('#payslipDetailsModal').modal('show');
                            } else {
                                Swal.fire('Error', res.message || 'Failed to fetch payslip details', 'error');
                            }
                        },
                        error: function(err) {
                            console.error('Error fetching payslip details:', err);
                            Swal.fire('Error', err.responseJSON?.message || 'Failed to fetch payslip details', 'error');
                        }
                    });
                } else {
                    Swal.fire('Error', 'No payslip found for the selected month and year', 'error');
                }
            },
            error: function(err) {
                console.error('Error fetching payslip ID:', err);
                Swal.fire('Error', err.responseJSON?.message || 'Failed to fetch payslip ID', 'error');
            }
        });
    });
});

function loadEmployees() {
    $.ajax({
        url: "api/viewEmployee.php",
        type: "GET",
        headers: {
            "Authorization": token
        },
        success: function(res) {
            if (res.status && res.data) {
                const employees = res.data;
                const tbody = $("#employeeTableBody");
                tbody.empty();
                
                employees.forEach((employee, index) => {
                    tbody.append(`
                        <tr>
                            <td class="text-nowrap">${index + 1}</td>
                            <td class="text-break">${employee.name}</td>
                            <td class="text-break">${employee.email}</td>
                            <td class="text-nowrap">${employee.dob}</td>
                            <td class="text-nowrap">${employee.phone}</td>
                            <td class="text-break">${employee.department}</td>
                            <td class="text-break">${employee.designation}</td>
                            <td class="text-nowrap">
                                <a href="#" class="btn btn-sm btn-primary generate-payslip" data-employee-id="${employee.id}" data-bs-toggle="modal" data-bs-target="#generatePayslipModal">
                                    <i class="fas fa-file-invoice"></i> Generate
                                </a>
                                <a href="#" class="btn btn-sm btn-info view-payslip" data-employee-id="${employee.id}">
                                    <i class="fas fa-eye"></i> View
                                </a>
                            </td>
                        </tr>
                    `);
                });
            } else {
                Swal.fire({
                    title: "No Data",
                    text: "No employees found",
                    icon: "info"
                });
            }
        },
        error: function(err) {
            Swal.fire({
                title: "Error",
                text: err.responseJSON ? err.responseJSON.message : "An error occurred",
                icon: "error"
            });
        }
    });
} 