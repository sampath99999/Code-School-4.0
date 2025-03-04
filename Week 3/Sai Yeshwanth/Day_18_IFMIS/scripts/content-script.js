///////////////////// switch tabs linked to radios ///////////////////////
document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll("input[name='tabs']");
  const sections = {
    tab1: document.getElementById("basicDetailsSection"),
    tab2: document.getElementById("payDetailsSection"),
    tab3: document.getElementById("eAndDDetailsSection"),
  };

  function showSection(selectedTab) {
    Object.values(sections).forEach((section) =>
      section.classList.add("d-none")
    );

    if (sections[selectedTab]) {
      sections[selectedTab].classList.remove("d-none");
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("change", function () {
      showSection(this.id);
    });

    if (tab.checked) {
      showSection(tab.id);
    }
  });

  ///////////////////////// get url parameters ///////////////////////////

  function getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  let index = getUrlParam("index");

  if (index !== null) {
    let employeeList = JSON.parse(localStorage.getItem("employees")) || [];

    index = parseInt(index);

    let employee = employeeList[index];

    if (employee) {
      console.log(employee);

      $.each(employee, function (key, value) {
        let $spanElement = $("#" + key);
        if ($spanElement.length) {
          $spanElement.text(value);
        }
      });
    } else {
      console.log("Employee Not Found");
    }
  } else {
    console.log("Index Missing");
  }
});

/////////////////////////////// earnings and deductions /////////////////////////////////

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("index");

let employees = JSON.parse(localStorage.getItem("employees")) || [];
let employee = employees[userId] || {};

if (!employee.earnings) employee.earnings = [];
if (!employee.deductions) employee.deductions = [];

let earnings = employee.earnings;
let deductions = employee.deductions;

function updateTable() {
  const earningsTable = document.getElementById("earningsTable");
  const deductionsTable = document.getElementById("deductionsTable");
  let totalEarnings = 0;
  let totalDeductions = 0;

  earningsTable.innerHTML = "";
  earnings.forEach((item, index) => {
    totalEarnings += parseFloat(item.amount);
    earningsTable.innerHTML += `
      <tr>
          <td>${item.description}</td>
          <td class="text-center">${item.amount}</td>
          <td class="text-center">${item.date}</td>
          <td class="text-center"><button class="btn btn-danger btn-sm" onclick="deleteEarning(${index})"><i class="bi bi-trash-fill"></i></button></td>
      </tr>
    `;
  });

  deductionsTable.innerHTML = "";
  deductions.forEach((item, index) => {
    totalDeductions += parseFloat(item.amount);
    deductionsTable.innerHTML += `
      <tr>
          <td>${item.description}</td>
          <td class="text-center">${item.amount}</td>
          <td class="text-center">${item.recovered_installments || "-"}</td>
          <td class="text-center">${item.init_installments || "-"}</td>
          <td class="text-center">${item.max_installments || "-"}</td>
          <td class="text-center">${item.policy_no || "-"}</td>
          <td class="text-center"><a href="#" class="text-primary">Change</a></td>
          <td class="text-center">
            <button class="btn btn-danger btn-sm ms-2" onclick="deleteDeduction(${index})">
              <i class="bi bi-trash-fill"></i>
            </button>
          </td>
      </tr>
    `;
  });

  document.getElementById("totalEarnings").innerText = totalEarnings.toFixed(2);
  document.getElementById("totalDeductions").innerText =
    totalDeductions.toFixed(2);
  document.getElementById("netTotal").innerText = (
    totalEarnings - totalDeductions
  ).toFixed(2);

  employees[userId] = employee;
  localStorage.setItem("employees", JSON.stringify(employees));
}

window.addEarning = function () {
  let modalElement = document.getElementById("earningModal");
  let modal = new bootstrap.Modal(modalElement);
  modal.show();

  document.getElementById("saveEarning").onclick = function () {
    const form = document.getElementById("earningForm");
    const desc = document.getElementById("earningDesc").value.trim();
    const amount = document.getElementById("earningAmount").value.trim();
    const date = document.getElementById("earningDate").value.trim();

    if (desc && amount && date) {
      earnings.push({ description: desc, amount, date });
      updateTable();
      modal.hide();

      modalElement.addEventListener(
        "hidden.bs.modal",
        function () {
          form.reset();
        },
        { once: true }
      );
    } else {
      Swal.fire("Error", "All fields are required!", "error");
    }
  };
};

window.addDeduction = function () {
  let modalElement = document.getElementById("deductionModal");
  let modal = new bootstrap.Modal(modalElement);
  modal.show();

  document.getElementById("saveDeduction").onclick = function () {
    const form = document.getElementById("deductionForm");
    const desc = document.getElementById("desc").value.trim();
    const amount = document.getElementById("amount").value.trim();
    const recoveredInstallments = document
      .getElementById("recoveredInstallments")
      .value.trim();
    const initInstallments = document
      .getElementById("initInstallments")
      .value.trim();
    const maxInstallments = document
      .getElementById("maxInstallments")
      .value.trim();
    const policyNo = document.getElementById("policyNo").value.trim();
    const lastDate = document.getElementById("lastDate").value.trim();

    if (desc && amount) {
      deductions.push({
        description: desc,
        amount,
        recovered_installments: recoveredInstallments || "-",
        init_installments: initInstallments || "-",
        max_installments: maxInstallments || "-",
        policy_no: policyNo || "-",
        last_date: lastDate || "-",
      });

      updateTable();
      modal.hide();

      modalElement.addEventListener(
        "hidden.bs.modal",
        function () {
          form.reset();
        },
        { once: true }
      );
    } else {
      Swal.fire(
        "Error",
        "Description and Amount are required fields!",
        "error"
      );
    }
  };
};

window.deleteEarning = function (index) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to undo this action!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      earnings.splice(index, 1);
      updateTable();

      Swal.fire({
        title: "Deleted!",
        text: "The earning has been removed.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  });
};

window.deleteDeduction = function (index) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to undo this action!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      deductions.splice(index, 1);
      updateTable();

      Swal.fire({
        title: "Deleted!",
        text: "The deduction has been removed.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  });
};

updateTable();

//////////////  Api  //////////////////////
$(document).ready(function () {
  $.ajax({
    url: "http://127.0.0.1:5000/get-random-name",
    type: "GET",
    dataType: "json",
    success: function (response) {
      $("#userNameApi").text(response.name);
    },
    error: function (xhr, status, error) {
      console.error("Error fetching name:", error);
    },
  });
});
