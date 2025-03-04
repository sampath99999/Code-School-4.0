let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let age = document.getElementById("age");
let fetchButton = document.getElementById("fetchSubmit");
let xmlButton = document.getElementById("xmlSubmit");
let jQueryButton = document.getElementById("jQuerySubmit");
let successMessages = document.querySelectorAll(".success"); // Select all span elements

fetchButton.addEventListener("click", function (e) {
  e.preventDefault();

  try {
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
        console.log(data);
        successMessages[0].textContent = "Data Posted successfully!";
        successMessages[0].style.color = "green";
      });
  } catch (error) {
    console.error("Error:", error.message);
    successMessages[0].textContent = "Failed!";
    successMessages[0].style.color = "red";
  }
});

xmlButton.addEventListener("click", function (e) {
  e.preventDefault();

  var http = new XMLHttpRequest();
  var url = "https://dummyjson.com/users/add";
  var method = "POST";

  var data = JSON.stringify({
    firstName: firstName.value,
    lastName: lastName.value,
    age: age.value,
  });

  http.open(method, url);
  http.setRequestHeader("Content-Type", "application/json");
  http.send(data);
  http.onload = function () {
    console.log(http.responseText);
    successMessages[1].textContent = "Data Posted successfully!";
    successMessages[1].style.color = "green";
  };
});

$(document).ready(function () {
  $("#jQuerySubmit").on("click", function () {
    $.post(
      "https://dummyjson.com/users/add",
      {
        firstName: firstName.value,
        lastName: lastName.value,
        age: age.value,
      },
      function (data, status) {
        console.log(data);
        successMessages[2].textContent = "Data Posted successfully!";
        successMessages[2].style.color = "green";
      }
    );
  });
});
