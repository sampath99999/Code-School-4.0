
//login

$(document).ready(function () {
  $("#loginUser").click(function () {
    $("#allPages").load("Login.html");
  });
  $("#loginSubmit").click(function () {
    var userName = $("#userName").val();
    var password = $("#password").val();

    $.ajax({
      type: "POST",
      url: "https://dummyjson.com/user/login",
      contentType: "application/json",
      data: JSON.stringify({
        username: userName,
        password: password,
      }),
      success: function (response) {
        console.log(`login Successful:`, response);
      },
      error: function (xhr, status, error) {
        console.log("Error: " + xhr.responseText);
      },
    });
  });
});

// Register

$(document).ready(function () {
  $("#addUser").click(function () {
    $("#allPages").load("register.html");
  });

  $("#jQuerySubmit").click(function () {
    var firstName = $("#firstName").val();
    var lastName = $("#lastName").val();
    var age = $("#age").val();
    $.post(
      "https://dummyjson.com/users/add",
      {
        firstName: firstName,
        lastName: lastName,
        age: age,
      },
      function (data, status) {
        console.log(data);
        document.querySelector(".successMessage").textContent =
          "Data Posted successfully!";
        document.querySelector(".successMessage").style.color = "green";
      }
    );
  });
});

// update

$(document).ready(function () {
  $("#updateUser").click(function () {
    $("#allPages").load("update.html");
  });
  $("#updateSubmit").click(function () {
    var userId = $("#userId").val();
    var lastName = $("#lastName").val();

    $.ajax({
      type: "PUT",
      url: `https://dummyjson.com/users/${userId}`,
      contentType: "application/json",
      data: JSON.stringify({
        lastName: lastName,
      }),
      success: function (response) {
        console.log(`Updated Successful:`, response);
      },
      error: function (xhr, status, error) {
        console.log("Error: " + xhr.responseText);
      },
    });
  });
});


// Delete

$(document).ready(function(){
  $("#deleteUser").click(function(){
    $("#allPages").load("Delete.html");
  });

  $("#deleteSubmit").click(function(){
    var deleteUser = $("#deleteUserId").val();

    $.ajax({
      type: "DELETE",
      url: `https://dummyjson.com/users/${deleteUser}`,
      contentType: "application/json",
      success: function (response) {
        console.log(`Deleted Successful:`, response);
      },
      error: function (xhr, status, error) {
        console.log("Error: " + xhr.responseText);
      }
    })
  })
})