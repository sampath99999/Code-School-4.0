$(document).ready(function(){
  if(!localStorage.getItem("accessToken")){
    window.location.href = "index.html"
  }
})

if (!localStorage.getItem("lastAssignedId")) {
 localStorage.setItem("lastAssignedId", "30"); 
}

$(document).ready(function () {
  $(document).on("click", ".edit-btn", function () {
    const id = $(this).data("id"); 
    editRow(id); 
    console.log("Edit button clicked for ID:", id);
  });

  $(document).on("click", ".del-btn", function () {
    const id = $(this).data("id");
    deleteRow(id);
    console.log("Del button clicked for ID:", id);
  });

  $(document).on("click", ".save-btn", function () {
    const id = $(this).data("id");
    saveRow(id);
    console.log("Save button clicked for ID:", id);
  });

  loadDataFromLocalStorage();

  $(document).ready(function () {
    $("#signOut").click(function () {
      localStorage.clear();
      window.location.href = "index.html";
    });
  });

 
  $(document).ready(function () {
    $("#userForm")
      .off("submit")
      .on("submit", function (event) {
        event.preventDefault();
        validateForm(event);
        $("#userForm")[0].reset();
      });
  });


  $(document).ready(function () {
    $("#getUsers").click(function () {
      $.ajax({
        url: "https://dummyjson.com/users",
        method: "GET",
        success: function (response) {
          if (!localStorage.getItem("result")) {
            localStorage.setItem("result", JSON.stringify(response));
          }
          let data = JSON.parse(localStorage.getItem("result"));
          displayUsers(data.users);
        },
        error: function (error) {
          console.log("Error fetching users", error);
        },
      });
    });
  });
});

function loadDataFromLocalStorage() {
  let data = JSON.parse(localStorage.getItem("result")) || { users: [] };
  if (data.users.length > 0) {
    displayUsers(data.users);
  }
}

function validateFirstName() {
  const firstName = document.getElementById("firstName").value;
  const firstNameErr = document.getElementById("firstName-error");

  if (firstName === "" || /\d/.test(firstName)) {
    firstNameErr.textContent = "Please enter your first name without numbers.";
    return false;
  }
  firstNameErr.textContent = "";
  return true;
}

function validateLastName() {
  const lastName = document.getElementById("lastName").value;
  const lastNameErr = document.getElementById("lastName-error");

  if (lastName === "" || /\d/.test(lastName)) {
    lastNameErr.textContent = "Please enter your last name without numbers.";
    return false;
  }
  lastNameErr.textContent = "";
  return true;
}

function validateEmail() {
  const email = document.getElementById("email").value;
  const emailErr = document.getElementById("email-error");

  if (email === "" || !email.includes("@") || !email.includes(".")) {
    emailErr.textContent = "Please enter a valid email address.";
    return false;
  }
  emailErr.textContent = "";
  return true;
}

function validatePhone() {
  const phone = document.getElementById("phone").value;
  const phoneErr = document.getElementById("phone-error");

  if (phone === "" || !/^\d{10}$/.test(phone)) {
    phoneErr.textContent = "Please enter a valid 10-digit phone number.";
    return false;
  }
  phoneErr.textContent = "";
  return true;
}

function validateAge() {
  const age = document.getElementById("age").value;
  const ageErr = document.getElementById("age-error");

  if (age === "" || age <= 0 || age > 120) {
    ageErr.textContent = "Please enter a valid age.";
    return false;
  }
  ageErr.textContent = "";
  return true;
}
function validateForm(event) {
  console.log("Form submitted");
  event.preventDefault();

  const isFirstNameValid = validateFirstName();
  const isLastNameValid = validateLastName();
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();
  const isAgeValid = validateAge();

  if (
    isFirstNameValid &&
    isLastNameValid &&
    isEmailValid &&
    isPhoneValid &&
    isAgeValid
  ) {
    var firstNameVar = $("#firstName").val();
    var lastNameVar = $("#lastName").val();
    var emailVar = $("#email").val();
    var phoneVar = $("#phone").val();
    var ageVar = $("#age").val();

    let lastAssignedId = parseInt(localStorage.getItem("lastAssignedId"), 10);
    console.log("Last Assigned ID:", lastAssignedId);
    let newId = lastAssignedId + 1;
    console.log("New ID:", newId);

    $.ajax({
      url: "https://dummyjson.com/users/add",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        firstName: firstNameVar,
        lastName: lastNameVar,
        email: emailVar,
        phone: phoneVar,
        age: ageVar,
      }),
      success: function (response) {
        console.log("API Response:", response);

        response.id = newId;
        console.log("New ID:", newId);
        localStorage.setItem("lastAssignedId", newId.toString());

        let data = JSON.parse(localStorage.getItem("result")) || { users: [] };
        data.users.push(response);
        localStorage.setItem("result", JSON.stringify(data));
        const userRow = `
                <tr id="row${newId}">
                    <th scope="row">${newId}</th>
                    <td>${response.firstName}</td>
                    <td>${response.lastName}</td>
                    <td>${response.email}</td>
                    <td>${response.phone}</td>
                    <td>${response.age}</td>
                   <td>
                     <button class="btn btn-success edit-btn"  data-id="${newId}">Edit</button>
                     <button class="btn btn-outline-danger del-btn" data-id="${newId}">Delete</button>
                  </td>
                </tr>
            `;
        console.log(userRow);
        console.log("Appended Row:", userRow);
        $("#content tbody").append(userRow);

        Swal.fire({
          title: "Success!",
          text: "Your account has been created successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
      },
    });
  } else {
    Swal.fire({
      title: "Error!",
      text: "Please fix the errors before submitting.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}
document.getElementById("userForm").reset();
function resetErrors() {
  document.getElementById("firstName-error").textContent = "";
  document.getElementById("lastName-error").textContent = "";
  document.getElementById("email-error").textContent = "";
  document.getElementById("phone-error").textContent = "";
  document.getElementById("age-error").textContent = "";
}

if (localStorage.getItem("accessToken")) {
  console.log(localStorage.getItem("accessToken"));
  $.ajax({
    url: "https://dummyjson.com/auth/me",
    method: "GET",
    contentType: "application/json",
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        `Bearer ${localStorage.getItem("accessToken")}`
      );
    },
    success: function (response) {
      console.log("success", response);
      $("#userImg").attr("src", response.image);
      $("#brand").append(`Welcome, ${response.firstName} ${response.lastName}`);
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function displayUsers(users) {
  let content = "";
  users.forEach((user, index) => {
    content += `
      <tr id="row${user.id}">
          <th scope="row">${index + 1}</th>
         
          <td>${user.firstName}</td>
          <td>${user.lastName}</td>
          <td>${user.email}</td>
          <td>${user.phone}</td>
          <td>${user.age}</td>
          <td>
              <button class="btn btn-success edit-btn" data-id="${user.id}">Edit</button>
              <button class="btn btn-outline-danger del-btn" data-id="${ user.id}">Delete</button>
          </td>
      </tr>`;
  });
  $("tbody").html(content);
}

function editRow(id) {
  console.log(id);
  let parse = JSON.parse(localStorage.getItem("result"));
  let users = parse.users;
  let user = users.find((u) => u.id == id);
  parse.users = users;
  localStorage.setItem("result", JSON.stringify(parse));
  if (!user) {
    console.error("User not found");
    return;
  }

  $(`#row${id}`).html(`
      <th scope="row">${id}</th>
      <td><input id="editfirstName" value="${user.firstName}"></td>
      <td><input id="editlastName" value="${user.lastName}"></td>
      <td><input id="editemail" value="${user.email}"></td>
      <td><input id="editphone" value="${user.phone}"></td>
      <td><input id="editage" value="${user.age}"></td>
      <td>
          <button class="btn btn-primary save-btn" data-id="${id}">Save</button>
          <button class="btn btn-outline-warning del-btn" data-id="${id}">Delete</button>
      </td>
  `);
}

function saveRow(id) {
  let parse = JSON.parse(localStorage.getItem("result"));
  let users = parse.users;
  let user = users.find((user) => user.id == id);

  user.firstName = $("#editfirstName").val();
  user.lastName = $("#editlastName").val();
  user.email = $("#editemail").val();
  user.phone = $("#editphone").val();
  user.age = $("#editage").val();

  parse.users = users;
  localStorage.setItem("result", JSON.stringify(parse));

  $(`#row${id}`).html(`
      <th scope="row">${id}</th>
      <td>${user.firstName}</td>
      <td>${user.lastName}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>${user.age}</td>
      <td>
          <button class="btn btn-success edit-btn" data-id ="${id}">Edit</button>
          <button class="btn btn-outline-danger del-btn" data-id ="${id}">Delete</button>
      </td>
  `);
}

function deleteRow(id) {
  let parse = JSON.parse(localStorage.getItem("result"));
  let users = parse.users.filter((user) => user.id != id);
  parse.users = users;
  localStorage.setItem("result", JSON.stringify(parse));

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      $(`#row${id}`).remove();
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });
    }
  });
}

//for checkbox  selecting all the other checkboxes
$("#master").click(function(){
  if($(this).is(":checked",true)){
    $('.check-box').prop("checked", true);
  }
  else{
    $('.check-box').prop("checked", false);
  }
})


//for del button only for selected rows
$("#deleteCheck").click(function(){
  var allVals = [];
  const id = $(this).data("id");
  $(".check-box:checked").each(function(){
    allVals.push(id);
    console.log(allVals)
  })
  if(allVals.length <=0){
    Swal.fire({
      title: "Error!",
      text: "Please select A row Before deleting",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
  else{
    WRN_PROFILE_DELETE = "Are you sure you want to delete this row?";  
    var check = confirm(WRN_PROFILE_DELETE);  
    if(check == true){  
      $.each(allVals, function( index, value ) {
        $('table tr').filter(`#row${id}`).remove();
      });
    } 
  }
})
