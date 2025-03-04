//////////////////// validation ////////////////////
document.addEventListener("DOMContentLoaded", function () {
  let selectScaleType = document.getElementById("selectScaleType");
  let stateScaleSection = document.querySelector(
    ".additonal-details-for-state-scale-employee"
  );

  const ifscData = {
    SBIN0001234: {
      bank: "State Bank of India",
      branch: "Shadnagar Main Branch",
    },
    HDFC0005678: { bank: "HDFC Bank", branch: "Hyderabad Khajaguda" },
    ICIC0009876: { bank: "ICICI Bank", branch: "Bangalore Hubbali" },
  };

  function toggleStateScaleSection() {
    if (selectScaleType.value === "State Scales") {
      stateScaleSection.classList.remove("d-none");
    } else {
      stateScaleSection.classList.add("d-none");
    }
  }

  selectScaleType.addEventListener("change", toggleStateScaleSection);
  toggleStateScaleSection();

  document.getElementById("ifscSearch").addEventListener("click", function () {
    let ifscInput = document.getElementById("ifsc");
    let ifscCode = ifscInput.value.trim().toUpperCase();

    if (ifscData[ifscCode]) {
      document.getElementById("bankName").value = ifscData[ifscCode].bank;
      document.getElementById("branchName").value = ifscData[ifscCode].branch;
    } else {
      document.getElementById("bankName").value = "";
      document.getElementById("branchName").value = "";
    }
  });

  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();
    let isValid = true;
    let formData = {};

    let requiredFields = [
      { id: "selectScaleType", type: "select" },
      { id: "employeeCode", type: "input", pattern: /^\d{10}$/ },
      { id: "billId", type: "select" },
      { id: "employeeName", type: "input", pattern: /^[A-Za-z\s]+$/ },
      { id: "selectCader", type: "select" },
      { id: "selectGender", type: "select" },
      { id: "currentWorkingStatus", type: "select" },
      { id: "subType", type: "select" },
      { id: "dateOfBirth", type: "input", validate: validateDOB },
      { id: "designation", type: "select" },
      { id: "tsgliNo", type: "input" },
      { id: "gpfNumber", type: "input" },
      { id: "aadharNumber", type: "input", pattern: /^\d{12}$/ },
      { id: "maritalStatus", type: "select" },
      { id: "panNumber", type: "input", pattern: /^[A-Z]{5}[0-9]{4}[A-Z]$/ },
      {
        id: "email",
        type: "input",
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      },
      { id: "mobileNumber", type: "input", pattern: /^[6-9]\d{9}$/ },
      { id: "earnedLeaves", type: "input" },
      { id: "halfPayLeaves", type: "input" },
      { id: "bankAccountNumber", type: "input" },
      { id: "confirmBankAccountNumber", type: "input" },
      { id: "ifsc", type: "input" },
    ];

    let stateScaleFields = [
      { id: "lastIncrementDate", type: "input" },
      { id: "dateOfJoiningService", type: "input" },
      { id: "selectPrc", type: "select" },
    ];

    function validateField(field) {
      let element = document.getElementById(field.id);
      if (!element) return true;

      let value = element.value.trim();
      formData[field.id] = value;

      if (
        (field.type === "input" && value === "") ||
        (field.type === "select" && value === "SELECT")
      ) {
        element.classList.add("border-danger");
        return false;
      } else if (field.pattern && !field.pattern.test(value)) {
        element.classList.add("border-danger");
        return false;
      } else if (field.validate && !field.validate(value)) {
        element.classList.add("border-danger");
        return false;
      } else {
        element.classList.remove("border-danger");
        return true;
      }
    }

    requiredFields.forEach(
      (field) => (isValid = validateField(field) && isValid)
    );

    if (selectScaleType.value === "State Scales") {
      stateScaleFields.forEach(
        (field) => (isValid = validateField(field) && isValid)
      );

      let joinDate = document.getElementById("dateOfJoiningService").value;
      let incrementDate = document.getElementById("lastIncrementDate").value;
      if (
        joinDate &&
        incrementDate &&
        new Date(incrementDate) <= new Date(joinDate)
      ) {
        isValid = false;
        document
          .getElementById("dateOfJoiningService")
          .classList.add("border-danger");
        document
          .getElementById("lastIncrementDate")
          .classList.add("border-danger");
        // alert("Increment Date must be after Joining Date.");
      }

      let countedChecked = document.getElementById("countedUnderSS").checked;
      let exemptedChecked = document.getElementById("exempted").checked;

      if (!countedChecked && !exemptedChecked) {
        isValid = false;
        // alert("Please select a Cadre Strength option.");
        document.getElementById("countedUnderSS").classList.add("is-invalid");
        document.getElementById("exempted").classList.add("is-invalid");
      } else {
        formData["cadreStrength"] = countedChecked
          ? "Counted under Sanctioned Strength"
          : "Exempted";

        document
          .getElementById("countedUnderSS")
          .classList.remove("is-invalid");
        document.getElementById("exempted").classList.remove("is-invalid");
      }

      let govtQuarterYes = document.getElementById("govtQuarterYes").checked;
      let govtQuarterNo = document.getElementById("govtQuarterNo").checked;

      if (!govtQuarterYes && !govtQuarterNo) {
        isValid = false;
        // alert("Please select if the employee is living in Govt Quarters.");
        document.getElementById("govtQuarterYes").classList.add("is-invalid");
        document.getElementById("govtQuarterNo").classList.add("is-invalid");
      } else {
        formData["govtQuarters"] = govtQuarterYes ? "Yes" : "No";
        document
          .getElementById("govtQuarterYes")
          .classList.remove("is-invalid");
        document.getElementById("govtQuarterNo").classList.remove("is-invalid");
      }
    }

    let cpsChecked = document.getElementById("cps").checked;
    let gpfChecked = document.getElementById("gpf").checked;

    if (!cpsChecked && !gpfChecked) {
      isValid = false;
      // alert("Please select either CPS or GPF.");
      document.getElementById("cps").classList.add("is-invalid");
      document.getElementById("gpf").classList.add("is-invalid");
    } else {
      formData["cpsGpfType"] = cpsChecked ? "CPS" : "GPF";
      document.getElementById("cps").classList.remove("is-invalid");
      document.getElementById("gpf").classList.remove("is-invalid");
    }

    if (
      document.getElementById("bankAccountNumber").value.trim() !==
      document.getElementById("confirmBankAccountNumber").value.trim()
    ) {
      isValid = false;
      // alert("Bank Account numbers do not match!");
      document
        .getElementById("bankAccountNumber")
        .classList.add("border-danger");
      document
        .getElementById("confirmBankAccountNumber")
        .classList.add("border-danger");
    }

    if (isValid) {
      let optionalFields = [
        "surName",
        "emailId",
        "address",
        "bankName",
        "branchName",
        "dateOfJoiningPresentPost",
        "gisCategory",
        "auditor",
      ];

      optionalFields.forEach((fieldId) => {
        let fieldElement = document.getElementById(fieldId);
        if (fieldElement) {
          formData[fieldId] = fieldElement.value;
        }
      });

      localStorage.setItem("employeeFormData", JSON.stringify(formData));

      Swal.fire({
        title: "Success!",
        text: "Form submitted successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        document.querySelector("form").submit();
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Please fill all the required fields",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  });

  function validateDOB(dob) {
    let birthDate = new Date(dob);
    let age = new Date().getFullYear() - birthDate.getFullYear();
    return age >= 18 && age <= 65;
  }

  //////////////////////////// file data ////////////////////////////

  const fileInput = document.getElementById("fileInput");
  const addButton = document.getElementById("addButton");
  const fileArea = document.getElementById("fileArea");

  addButton.addEventListener("click", function () {
    if (fileInput.files.length > 0) {
      let file = fileInput.files[0];

      storedFiles.push({ name: file.name });

      displayFiles();

      fileInput.value = "";
    } else {
      // alert("Please select a0 file before adding.");
    }
  });

  localStorage.removeItem("uploadedFiles");

  let storedFiles = [];

  function displayFiles() {
    fileArea.innerHTML = "";

    storedFiles.forEach((file, index) => {
      let fileRow = document.createElement("div");
      fileRow.classList.add(
        "d-flex",
        "justify-content-between",
        "align-items-center",
        "border",
        "p-2",
        "mb-1"
      );

      fileRow.innerHTML = `
                    <span>${file.name}</span>
                    <button class="btn btn-danger btn-sm delete-btn" data-index="${index}"><i class="bi bi-trash-fill"></i></button>
                `;

      fileArea.appendChild(fileRow);
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        let index = this.getAttribute("data-index");
        storedFiles.splice(index, 1);
        localStorage.setItem("uploadedFiles", JSON.stringify(storedFiles));
        displayFiles();
      });
    });
  }

  //////////////////////////// employee table ////////////////////////////

  const employeeTable = document.getElementById("employeeTable");

  function saveEmployeeData(formData) {
    let employeeList = JSON.parse(localStorage.getItem("employees")) || [];
    employeeList.push(formData);
    localStorage.setItem("employees", JSON.stringify(employeeList));
    displayEmployeeTable();
  }

  function displayEmployeeTable() {
    let employeeList = JSON.parse(localStorage.getItem("employees")) || [];
    employeeTable.innerHTML = "";

    if (employeeList.length === 0) {
      employeeTable.innerHTML = `<p class="text-center">No employees found.</p>`;
      return;
    }

    let tableHTML = `
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th >Employee Name</th>
                        <th class="justify-content-around d-flex">Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

    employeeList.forEach((employee, index) => {
      tableHTML += `
            <tr>
                <td >${employee.employeeName || "N/A"}</td>
                <td class="justify-content-around d-flex">
                    <button type="button" class="btn create-btn text-white btn-sm view-btn me-2" style="width:100px" data-index="${index}">View</button>
                    <button type="button" class="btn btn-danger btn-sm delete-btn" style="width:40px" data-index="${index}"><i class="bi bi-trash-fill"></i></button>
                </td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table>`;
    employeeTable.innerHTML = tableHTML;

    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        let index = this.getAttribute("data-index");
        window.location.href = `content.html?index=${index}`;
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        let index = this.getAttribute("data-index");
        deleteEmployee(index);
      });
    });
  }

  function deleteEmployee(index) {
    let employeeList = JSON.parse(localStorage.getItem("employees")) || [];

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        employeeList.splice(index, 1);
        localStorage.setItem("employees", JSON.stringify(employeeList));
        displayEmployeeTable();

        Swal.fire({
          title: "Deleted!",
          text: "The employee has been removed.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  }

  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();

    if (!localStorage.getItem("employeeFormData")) {
      // alert("Validation failed or no data available!");
      return;
    }

    let formData = JSON.parse(localStorage.getItem("employeeFormData"));
    saveEmployeeData(formData);

    localStorage.removeItem("employeeFormData");
    // alert("Employee data saved successfully!");
    this.reset();
  });

  displayEmployeeTable();
});
