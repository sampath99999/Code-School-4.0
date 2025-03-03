let employees = JSON.parse(localStorage.getItem("employees")) || [];
let uploadedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];

function clearErrors() {
  const inputs = document.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.style.border = "";
  });

  const radioGroups = document.querySelectorAll('input[type="radio"]');
  radioGroups.forEach((radio) => {
    radio.style.border = "";
  });
}

function validateForm(event) {
  event.preventDefault();

  let isValid = true;
  const employee = {};

  clearErrors();

  function markError(fieldId, radioGroupName, message = "") {
    if (fieldId) {
      const input = document.getElementById(fieldId);
      if (input) {
        input.style.border = "1px solid red";
        if (message) {
          console.log(`${fieldId}: ${message}`);
        }
      }
    } else if (radioGroupName) {
      const radios = document.querySelectorAll(
        `input[name="${radioGroupName}"]`
      );
      if (radios.length > 0) {
        radios[0].style.border = "1px solid red";
        if (message) {
          console.log(`${radioGroupName}: ${message}`);
        }
      }
    }
    isValid = false;
  }

  const scaleType = document.getElementById("scaleType");
  if (scaleType.value === "Select") {
    markError("scaleType");
  } else {
    employee["scaleType"] = scaleType.value;
  }

  const employeeCode = document.getElementById("employeeCode");
  if (!employeeCode.value.trim() || employeeCode.value.trim().length !== 10) {
    markError("employeeCode", null, "Employee code length should be 10");
  } else {
    employee["employeeCode"] = employeeCode.value.trim();
  }

  const billId = document.getElementById("billId");
  if (billId.value === "SELECT") {
    markError("billId");
  } else {
    employee["billId"] = billId.value;
  }

  const employeeName = document.getElementById("employeeName");
  if (!employeeName.value.trim()) {
    markError("employeeName", null, "Employee name is required");
  } else {
    const nameRegex = /^[A-Za-z\s'-]+$/;
    if (!nameRegex.test(employeeName.value.trim())) {
      markError(
        "employeeName",
        null,
        "Employee name should not contain special characters"
      );
    } else {
      employee["employeeName"] = employeeName.value.trim();
    }
  }

  const cader = document.getElementById("cader");
  if (cader.value === "SELECT") {
    markError("cader");
  } else {
    employee["cader"] = cader.value;
  }

  const gender = document.getElementById("gender");
  if (gender.value === "SELECT") {
    markError("gender");
  } else {
    employee["gender"] = gender.value;
  }

  const workingStatus = document.getElementById("workingStatus");
  if (workingStatus.value === "SELECT") {
    markError("workingStatus");
  } else {
    employee["workingStatus"] = workingStatus.value;
  }

  const subType = document.getElementById("subType");
  if (subType.value === "SELECT") {
    markError("subType");
  } else {
    employee["subType"] = subType.value;
  }

  const dob = document.getElementById("dob");
  if (!dob.value) {
    markError("dob", null, "Date of birth is required");
  } else {
    const dobDate = new Date(dob.value);
    const today = new Date("2025-02-24");
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dobDate.getDate())
    ) {
      age--;
    }
    if (age < 18 || age > 65) {
      markError("dob", null, "Age must be between 18 and 65 years");
    } else {
      employee["dob"] = dob.value;
    }
  }

  const designation = document.getElementById("designation");
  if (designation.value === "SELECT") {
    markError("designation");
  } else {
    employee["designation"] = designation.value;
  }

  const tsgliNo = document.getElementById("tsgliNo");
  if (!tsgliNo.value.trim()) {
    markError("tsgliNo");
  } else {
    employee["tsgliNo"] = tsgliNo.value.trim();
  }

  const cpsRadios = document.querySelectorAll('input[name="cps"]');
  let cpsChecked = false;
  let cpsValue = null;
  cpsRadios.forEach((radio) => {
    if (radio.checked) {
      cpsChecked = true;
      cpsValue = radio.value;
    }
  });
  if (!cpsChecked) {
    markError(null, "cps");
  } else {
    employee["cps"] = cpsValue;
  }

  const gpfNo = document.getElementById("gpfNo");
  if (!gpfNo.value.trim()) {
    markError("gpfNo");
  } else {
    employee["gpfNo"] = gpfNo.value.trim();
  }

  const aadhaarNo = document.getElementById("aadhaarNo");
  if (!aadhaarNo.value.trim()) {
    markError("aadhaarNo", null, "Aadhaar number is required");
  } else {
    const aadhaarRegex = /^\d{12}$/;
    if (!aadhaarRegex.test(aadhaarNo.value.trim())) {
      markError("aadhaarNo", null, "Aadhaar number must be exactly 12 digits");
    } else {
      employee["aadhaarNo"] = aadhaarNo.value.trim();
    }
  }

  const martialStatus = document.getElementById("martialStatus");
  if (martialStatus.value === "SELECT") {
    markError("martialStatus");
  } else {
    employee["martialStatus"] = martialStatus.value;
  }

  const panNo = document.getElementById("panNo");
  if (!panNo.value.trim()) {
    markError("panNo");
  } else {
    employee["panNo"] = panNo.value.trim();
  }

  const email = document.getElementById("email");
  if (!email.value.trim() || !email.value.includes("@")) {
    markError("email");
  } else {
    employee["email"] = email.value.trim();
  }

  const address = document.getElementById("address");
  if (!address.value.trim()) {
    markError("address");
  } else {
    employee["address"] = address.value.trim();
  }

  const mobileNo = document.getElementById("mobileNo");
  if (!mobileNo.value.trim()) {
    markError("mobileNo", null, "Mobile number is required");
  } else {
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobileNo.value.trim())) {
      markError(
        "mobileNo",
        null,
        "Mobile number must start with 6-9 and be 10 digits"
      );
    } else {
      employee["mobileNo"] = mobileNo.value.trim();
    }
  }

  const earnedLeaves = document.getElementById("earnedLeaves");
  if (!earnedLeaves.value.trim()) {
    markError("earnedLeaves");
  } else {
    employee["earnedLeaves"] = earnedLeaves.value.trim();
  }

  const halfPayLeaves = document.getElementById("halfPayLeaves");
  if (!halfPayLeaves.value.trim()) {
    markError("halfPayLeaves");
  } else {
    employee["halfPayLeaves"] = halfPayLeaves.value.trim();
  }

  const bankAccNo = document.getElementById("bankAccNo");
  if (!bankAccNo.value.trim()) {
    markError("bankAccNo");
  } else {
    employee["bankAccNo"] = bankAccNo.value.trim();
  }

  const confirmBankAccNo = document.getElementById("confirmBankAccNo");
  if (
    !confirmBankAccNo.value.trim() ||
    confirmBankAccNo.value !== bankAccNo.value
  ) {
    markError("confirmBankAccNo");
  } else {
    employee["confirmBankAccNo"] = confirmBankAccNo.value.trim();
  }

  const ifsc = document.getElementById("ifsc");
  if (!ifsc.value.trim()) {
    markError("ifsc");
  } else {
    const ifscCode = ifsc.value.trim().toUpperCase();
    if (ifscData[ifscCode]) {
      employee["ifsc"] = ifscCode;
      employee["bankName"] = ifscData[ifscCode].bank;
      employee["branchName"] = ifscData[ifscCode].branch;
      document.getElementById("bankName").value = ifscData[ifscCode].bank;
      document.getElementById("branchName").value = ifscData[ifscCode].branch;
    } else {
      markError("ifsc", null, "Invalid IFSC code");
    }
  }

  const cadreRadios = document.querySelectorAll('input[name="cadre"]');
  let cadreChecked = false;
  let cadreValue = null;
  cadreRadios.forEach((radio) => {
    if (radio.checked) {
      cadreChecked = true;
      cadreValue = radio.value;
    }
  });
  if (scaleType.value === "State Scales" && !cadreChecked) {
    markError(null, "cadre");
  } else if (cadreChecked) {
    employee["cadre"] = cadreValue;
  }

  const joiningServiceDate = document.getElementById("joiningServiceDate");
  if (scaleType.value === "State Scales" && !joiningServiceDate.value) {
    markError("joiningServiceDate");
  } else if (joiningServiceDate.value) {
    employee["joiningServiceDate"] = joiningServiceDate.value;
  }

  const lastIncrementDate = document.getElementById("lastIncrementDate");
  if (
    scaleType.value === "State Scales" &&
    (!lastIncrementDate.value ||
      new Date(lastIncrementDate.value) <= new Date(joiningServiceDate.value))
  ) {
    markError("lastIncrementDate");
  } else if (lastIncrementDate.value) {
    employee["lastIncrementDate"] = lastIncrementDate.value;
  }

  const joiningPostDate = document.getElementById("joiningPostDate");
  if (scaleType.value === "State Scales" && !joiningPostDate.value) {
    markError("joiningPostDate");
  } else if (joiningPostDate.value) {
    employee["joiningPostDate"] = joiningPostDate.value;
  }

  const gisCategory = document.getElementById("gisCategory");
  if (scaleType.value === "State Scales" && gisCategory.value === "SELECT") {
    markError("gisCategory");
  } else if (gisCategory.value !== "SELECT") {
    employee["gisCategory"] = gisCategory.value;
  }

  const quartersRadios = document.querySelectorAll('input[name="Yes"]');
  let quartersChecked = false;
  let quartersValue = null;
  quartersRadios.forEach((radio) => {
    if (radio.checked) {
      quartersChecked = true;
      quartersValue = radio.value;
    }
  });
  if (scaleType.value === "State Scales" && !quartersChecked) {
    markError(null, "Yes");
  } else if (quartersChecked) {
    employee["quarters"] = quartersValue;
  }

  const prcSelect = document.getElementById("prcSelect");
  if (prcSelect.value === "Select") {
    markError("prcSelect", "Please select a PRC");
  } else {
    employee["prcSelect"] = prcSelect.value;
  }

  const auditorSelect = document.getElementById("auditorSelect");
  if (auditorSelect.value === "Select") {
    markError("auditorSelect", null, "Please select an Auditor");
  } else {
    employee["auditorSelect"] = auditorSelect.value;
  }

  if (isValid) {
    employees.push(employee);
    localStorage.setItem("employees", JSON.stringify(employees));
    updateTable();
    clearErrors();
    document.querySelector("form").reset();
    alert("Employee added successfully!");

    window.location.href = `profile.html?index=${employees.length - 1}`;
  }

  return isValid;
}

function updateTable() {
  const tbody = document.getElementById("employeeTableBody");
  tbody.innerHTML = "";

  employees.forEach((employee, index) => {
    const rowHtml = `
      <tr>
        <td>${employee.employeeName}</td>
        <td>${employee.employeeCode}</td>
        <td>
          <button class="btn btn-info btn-sm me-2" onclick="viewEmployee(${index})">View</button>
          <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${index})">Delete</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += rowHtml;
  });
}

function viewEmployee(index) {
  const employee = employees[index];
  localStorage.setItem("viewingEmployee", JSON.stringify(employee));
  window.location.href = `profile.html?index=${index}`;
}

function deleteEmployee(index) {
  if (confirm("Are you sure you want to delete this employee?")) {
    employees.splice(index, 1);
    localStorage.setItem("employees", JSON.stringify(employees));
    updateTable();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const scaleTypeSelect = document.getElementById("scaleType");
  const stateScaleDetails = document.getElementById("stateScaleDetails");

  stateScaleDetails.style.display = "none";

  updateTable();

  scaleTypeSelect.addEventListener("change", function () {
    if (this.value === "State Scales") {
      stateScaleDetails.style.display = "block";
    } else {
      stateScaleDetails.style.display = "none";
    }
  });

  const addBtn = document.getElementById("addBtn");
  addBtn.addEventListener("click", handleAddFiles);
});

function handleAddFiles() {
  const fileInput = document.getElementById("documents");
  const uploadedFilesDiv = document.getElementById("uploadedFiles");

  if (!fileInput.files || fileInput.files.length === 0) {
    alert("Please select at least one file to upload.");
    fileInput.style.border = "1px solid red";
    return;
  }

  uploadedFilesDiv.innerHTML = "";
}

const ifscData = {
  SBIN0001234: {
    bank: "State Bank of India",
    branch: "Shadnagar Main Branch",
  },
  HDFC0005678: { bank: "HDFC Bank", branch: "Hyderabad Khajaguda" },
  ICIC0009876: { bank: "ICICI Bank", branch: "Bangalore Hubbali" },
};

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
