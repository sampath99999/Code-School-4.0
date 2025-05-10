//Post data using jquery

$(document).ready(function () {
  $("#jqueryButton").click(function () {
    let firstNameValue = $("#firstName").val();
    let lastNameValue = $("#lastName").val();
    let ageValue = $("#age").val();

    if (!firstNameValue || !lastNameValue || !ageValue) {
      alert("All flelds are required");
    }
    else {
      $.post(
        "https://dummyjson.com/users/add",
        {
          firstName: firstNameValue,
          lastName: lastNameValue,
          age: ageValue,
        },
        function (data) {
          console.log(data);
          alert("your post request is successfully completed");
        }
      ).fail(function () {
        console.error("Request failed.");
        $("#errorOccurs").text(`Failed to add user. Please try again`);
      });
    }
  });
});

//Post data using fetch with javascript

const fetchButton = document.getElementById("fetchButton");
fetchButton.addEventListener("click", function (event) {
  event.preventDefault();

  let firstNameValue = document.getElementById("firstName").value;
  let lastNameValue = document.getElementById("lastName").value;
  let ageValue = document.getElementById("age").value;

  if (!firstNameValue || !lastNameValue || !ageValue) {
    alert("All flelds are required");
  } 
  else {
    fetch("https://dummyjson.com/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: firstNameValue,
        lastName: lastNameValue,
        age: ageValue,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        alert("your post request is successfully completed");
      })
      .catch((error) => {
        console.log("Error:", error);
        document.getElementById(
          "errorOccurs"
        ).innerHTML = `<p">Failed to add user. Please try again.</p>`;
      });
  }
});

//Post data using AJAX

const xmlButton = document.getElementById("XMLButton");
xmlButton.addEventListener("click", function (event) {
  event.preventDefault();

  let firstNameValue = document.getElementById("firstName").value;
  let lastNameValue = document.getElementById("lastName").value;
  let ageValue = document.getElementById("age").value;

  if (!firstNameValue || !lastNameValue || !ageValue) {
    alert("All flelds are required");
  } 
  else {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://dummyjson.com/users/add", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        console.log(response);
        alert("your post request is successfully completed");
      } else {
        console.log("Error:", xhr.status, xhr.statusText);
        document.getElementById(
          "errorOccurs"
        ).innerHTML = `Failed to add user. Please try again`;
      }
    };

    xhr.onerror = function () {
      console.error("Request failed.");
      document.getElementById(
        "errorOccurs"
      ).innerHTML = `Failed to add user. Please try again`;
    };

    xhr.send(
      JSON.stringify({
        firstName: firstNameValue,
        lastName: lastNameValue,
        age: ageValue,
      })
    );
  }
});
