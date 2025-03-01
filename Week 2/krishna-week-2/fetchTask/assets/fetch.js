$(document).ready(function () {
  if (!localStorage.getItem("accessToken")) {
    window.location.href = "login.html";
  }

  // Load Register Page
  $("#register").click(function () {
    $("#page").load("register.html");
  });

  $(document).on("click", "#registerBtn", function (event) {
    event.preventDefault();
    const firstName = $("#firstName").val();
    const lastName = $("#lastName").val();
    const username = $("#userName").val();
    const password = $("#password").val();
    const confirmPassword = $("#confirmPassword").val();

    if (!firstName || !lastName || !username || !password || !confirmPassword) {
      $("#response").html(
        `<p class="text-danger">All fields are required!</p>`
      );
      return;
    }

    if (password !== confirmPassword) {
      $("#response").html(`<p class="text-danger">Passwords do not match!</p>`);
      return;
    }

    $.ajax({
      type: "POST",
      url: "https://dummyjson.com/users/add",
      contentType: "application/json",
      data: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
      }),
      success: function (response) {
        $("#response").html(`
          <h4>Registration Successful:</h4>
          <p><strong>Name:</strong> ${response.firstName} ${response.lastName}</p>
          <p><strong>Username:</strong> ${response.username}</p>
        `);
      },
      error: function (error) {
        $("#response").html(`<p class="text-danger">Failed to register!</p>`);
      },
    });
  });

  // Load Update Page
  $("#updateUserId").click(function () {
    $("#page").load("update.html");
  });

  $(document).on("click", "#updateBtn", function (event) {
    event.preventDefault();
    const UserId = $("#UserId").val();
    // console.log(updateUserId)
    const firstName = $("#firstName").val();
    const lastName = $("#lastName").val();
    const username = $("#userName").val();
    const password = $("#password").val();

    if (!firstName || !lastName || !username || !password) {
      $("#response").html(
        `<p class="text-danger">All fields are required for update!</p>`
      );
      return;
    }

    $.ajax({
      type: "PUT",
      url: `https://dummyjson.com/users/${UserId}`, // Replace with dynamic user ID if needed
      contentType: "application/json",
      data: JSON.stringify({
        updateUserId: updateUserId,
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
      }),
      success: function (response) {
        $("#response").html(`
          <h4>Update Successful:</h4>
          <p><strong>Name:</strong> ${response.firstName} ${response.lastName}</p>
          <p><strong>Username:</strong> ${response.username}</p>
        `);
      },
      error: function (error) {
        $("#response").html(
          `<p class="text-danger">Failed to update user!</p>`
        );
      },
    });
  });

  // Load Remove User Page
  $("#deleteUser").click(function () {
    $("#page").load("removeUser.html");
  });

  $(document).on("click", "#deleteBtn", function (event) {
    event.preventDefault();
    const userId = $("#userId").val();
    console.log(userId);

    if (!userId) {
      $("#response").html(`<p class="text-danger">Please enter a User ID!</p>`);
      return;
    }

    $.ajax({
      type: "DELETE",
      url: `https://dummyjson.com/users/${userId}`,
      success: function (response) {
        $("#response").html(`
          <h4>Response:</h4>
          <p><strong>Name:</strong> ${response.firstName} ${
          response.lastName
        }</p>
          <p><strong>Maiden Name:</strong> ${response.maidenName || "N/A"}</p>
          <p><strong>Gender:</strong> ${response.gender}</p>
          <p><strong>Status:</strong> Deleted</p>
          <p><strong>Deleted On:</strong> ${response.deletedOn}</p>
        `);
      },
      error: function (error) {
        $("#response").html(
          `<p class="text-danger">Failed to delete user. Please try again ${error}.</p>`
        );
      },
    });
  });
});

$("#getAllUser").click(function () {
  $("#page").load("getALLUsers.html");
});

$("#allUserBtn").click(function (event) {
  event.preventDefault();

  $.ajax({
    url: "https://dummyjson.com/users",
    method: "GET",
    success: function (response) {
      let usersHtml = "<h4>Users List:</h4>";

      response.users.forEach((user) => {
        usersHtml += `
            <div class="user-card">

              <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
              <p><strong>Maiden Name:</strong> ${user.maidenName || "N/A"}</p>
              <p><strong>Gender:</strong> ${user.gender}</p>
            </div>
            <hr>
          `;
      });

      $("#response").html(usersHtml);
    },
    error: function (error) {
      $("#response").html(
        `<p class="text-danger">Failed to get all user data. Please try again. Error: ${error.statusText}</p>`
      );
    },
  });
});

$("#logout").click(function () {
  localStorage.clear();
  location.reload();
});
// // $(document).ready(function () {
// //   $("#login").click(function () {
// //     $("#page").load("login.html");
// //   });

// //   $(document).on("click", "#loginBtn", function (event) {
// //     event.preventDefault();
// //     const username = $("#userName").val();
// //     const password = $("#password").val();

// //     if (!username || !password) {
// //       alert("Please enter both username and password.");
// //       return;
// //     }

// //     $.ajax({
// //       type: "POST",
// //       url: "https://dummyjson.com/auth/login",
// //       contentType: "application/json",
// //       data: JSON.stringify({ username: username, password: password }),
// //       success: function (response) {
// //         console.log("Login successful:", response);
// //         // alert("Login successful!");
// //       },
// //       error: function (error) {
// //         console.error("Login failed:", error);
// //         // alert("Invalid credentials!");
// //       },
// //     });
// //   });

// //   //  Register Page
// //   $("#register").click(function () {
// //     $("#page").load("register.html");
// //   });

// //   $(document).on("click", "#registerBtn", function (event) {
// //     event.preventDefault();
// //     const firstName = $("#firstName").val();
// //     const lastName = $("#lastName").val();
// //     const username = $("#userName").val();
// //     const password = $("#password").val();
// //     const confirmPassword = $("#confirmPassword").val();

// //     if (!firstName || !lastName || !username || !password || !confirmPassword) {
// //       alert("All fields are required!");
// //       return;
// //     }

// //     if (password !== confirmPassword) {
// //       alert("Passwords do not match!");
// //       return;
// //     }

// //     $.ajax({
// //       type: "POST",
// //       url: "https://dummyjson.com/users/add",
// //       contentType: "application/json",
// //       data: JSON.stringify({
// //         firstName: firstName,
// //         lastName: lastName,
// //         username: username,
// //         password: password,
// //       }),
// //       success: function (response) {
// //         console.log("Register successful:", response);
// //         // alert("Registration successful!");
// //       },
// //       error: function (error) {
// //         console.error("Register failed:", error);
// //         // alert("Failed to register!");
// //       },
// //     });
// //   });

// //   // Load Update Page
// //   $("#updateUser").click(function () {
// //     $("#page").load("update.html");
// //   });

// //   $(document).on("click", "#updateBtn", function (event) {
// //     event.preventDefault();
// //     const firstName = $("#firstName").val();
// //     const lastName = $("#lastName").val();
// //     const username = $("#userName").val();
// //     const password = $("#password").val();

// //     if (!firstName || !lastName || !username || !password) {
// //       alert("All fields are required for update!");
// //       return;
// //     }

// //     $.ajax({
// //       type: "PATCH",
// //       url: "https://dummyjson.com/users/2",
// //       contentType: "application/json",
// //       data: JSON.stringify({
// //         firstName: firstName,
// //         lastName: lastName,
// //         username: username,
// //         password: password,
// //       }),
// //       success: function (response) {
// //         console.log("Update successful:", response);
// //         // alert("User updated successfully!");
// //       },
// //       error: function (error) {
// //         console.error("Update failed:", error);
// //         // alert("Failed to update user!");
// //       },
// //     });
// //   });

// //   // Load Remove User Page
// //   $("#userId").click(function () {
// //     $("#page").load("removeUser.html");
// //   });

// //   $(document).on("click", "#deleteBtn", function (event) {
// //     event.preventDefault();
// //     const userId = $("#userId").val();

// //     if (!userId) {
// //       // alert("Please enter a User ID");
// //       return;
// //     }

// //     $.ajax({
// //       type: "DELETE",
// //       url: `https://dummyjson.com/users/${userId}`,
// //       success: function (response) {
// //         console.log("Delete successful:", response);
// //         alert("User deleted successfully!");
// //       },
// //       error: function (error) {
// //         console.error("Delete failed:", error);
// //         alert("Failed to delete user. Please try again.");
// //       },
// //     });
// //   });
// // });
