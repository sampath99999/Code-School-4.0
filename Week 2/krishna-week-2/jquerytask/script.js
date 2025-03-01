// Selecting elements
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const age = document.getElementById("age");
const fetchBtn = document.querySelector(".btn-primary");
const xhttpBtn = document.querySelector(".btn-secondary");
const queryBtn = document.querySelector(".btn-dark");
const message = document.getElementById("message");


function failed() {
  message.innerHTML = "Please enter all details";
}


fetchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  if (firstName.value.trim() === "" || lastName.value.trim() === "" || age.value.trim() === "") {
    failed();
    return;
  }

  fetch("https://dummyjson.com/users/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: firstName.value,
      lastName: lastName.value,
      age: age.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("User added:", data);
      message.innerHTML = "User added successfully!";
    })
    .catch((err) => {
      console.error("Error:", err);
      message.innerHTML = "Something went wrong!";
    });
});




$(document).ready(function () {
  $("#post").on("click", function (event) {
    event.preventDefault();

    const firstName = $("#firstName").val();
    const lastName = $("#lastName").val();
    const age = $("#age").val();

    if (firstName === "" || lastName === "" || age === "") {
      $("#message").html("Please enter all details");
      return;
    }

    

    $.ajax({
      url: "https://dummyjson.com/users/add",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        age: age,
      }),
      success: function (data) {
        console.log("User data fetched successfully:", data);
        $("#message").html("User added successfully!");
      },
      error: function (error) {
        console.log("Error adding user:", error);
        $("#message").html("Something went wrong!");
      },
    });
  });
});


xhttpBtn.addEventListener("click", function (event) {
  event.preventDefault();

  if (firstName.value.trim() === "" || lastName.value.trim() === "" || age.value.trim() === "") {
    failed();
    return;
  }

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "https://dummyjson.com/users/add", true);
  xhttp.setRequestHeader("Content-Type", "application/json");

  xhttp.onload = function () {
    console.log(JSON.parse(xhttp.responseText))

  }

  xhttp.onerror = function () {
    console.error("Request failed.");
    message.innerHTML = "Request failed.";
  };

  xhttp.send(
    JSON.stringify({
      firstName: firstName.value,
      lastName: lastName.value,
      age: age.value,
    })
  );
});
