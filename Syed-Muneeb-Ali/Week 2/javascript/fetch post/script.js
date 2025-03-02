let firstName = document.getElementById("first_name");
let lastName = document.getElementById("last_name");
let age = document.getElementById("age");
let fetchBtn = document.querySelector(".fetchBtn");
let xmlBtn = document.querySelector(".xmlHttpBtn");
let jqueryBtn = document.querySelector(".jqueryBtn");
let showData = document.getElementById("showData");

//POST USING FETCH
fetchBtn.addEventListener("click", function (e) {
  e.preventDefault();

  try {
    fetch("https://dummyjson.com/users/add", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        firstName: firstName.value,
        lastName: lastName.value,
        age: age.value,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        displayData(res);
      });
  } catch (err) {
    console.log(err);
  }
});
function displayData(data) {
  showData.innerHTML = `<b>Response Data <br>First Name: ${data.firstName} <br> Last Name: ${data.lastName} <br> Age:  ${data.age}`;
}

//POST USING XMLhttprequest
xmlBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "https://dummyjson.com/users/add", true);

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function () {
    if (xhr.status < 300) {
      console.log(xhr.responseText);
      const responseData = JSON.parse(xhr.responseText);
      displayData(responseData);
    } else {
      console.log("unable to fetch");
    }
  };
  xhr.send(
    JSON.stringify({
      firstName: firstName.value,
      lastName: lastName.value,
      age: age.value,
    })
  );
});

//POST using jQuery
$(document).ready(function () {
  $(".jqueryBtn").click(function (e) {
    e.preventDefault();

    $.post({
      url: "https://dummyjson.com/users/add",
      contentType: "application/json",
      data: JSON.stringify({
        firstName: firstName.value,
        lastName: lastName.value,
        age: age.value,
      }),
      success: function (response) {
        console.log("Success POST by jquery", response);
        displayData(response);
      },
      error: function (error) {
        console.log("error in jquery function", error);
      },
    });
  });
});
