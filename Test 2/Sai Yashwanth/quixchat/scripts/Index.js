$(document).ready(function () {
  let fields = [
    {
      id: "userName",
      type: "input",
      requiredMsg: "Username or email is required",
      pattern: /^[a-zA-Z0-9@.]+$/,
      errorMsg: "Invalid username or email format",
    },
    {
      id: "password",
      type: "input",
      requiredMsg: "Password is required",
      pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,
      errorMsg:
        "Password must be at least 6 characters with letters, numbers & a symbol",
    },
  ];

  function validateField(field) {
    let $element = $("#" + field.id);
    let value = $element.val().trim();
    let $errorElement = $("#" + field.id + "Error");
    let $formFloating = $element.closest(".form-floating");

    if (value === "") {
      showError($element, $errorElement, $formFloating, field.requiredMsg);
      return false;
    } else if (field.pattern && !field.pattern.test(value)) {
      showError($element, $errorElement, $formFloating, field.errorMsg);
      return false;
    } else {
      hideError($element, $errorElement, $formFloating);
      return true;
    }
  }

  function showError($element, $errorElement, $formFloating, message) {
    $element.addClass("is-invalid");
    $formFloating.addClass("is-invalid");
    $errorElement.text(message).show();
  }

  function hideError($element, $errorElement, $formFloating) {
    $element.removeClass("is-invalid");
    $formFloating.removeClass("is-invalid");
    $errorElement.text("").hide();
  }

  fields.forEach((field) => {
    $("#" + field.id).on("input", function () {
      validateField(field);
    });
  });

  $("#loginForm").on("submit", function (event) {
    event.preventDefault();
    let isValid = true;

    fields.forEach((field) => {
      isValid = validateField(field) && isValid;
    });

    if (isValid) {
      let username = $("#userName").val().trim();
      let password = $("#password").val().trim();
      let $joinBtn = $("#joinBtn");
      let $errorMessage = $("#errorMessage");

      $errorMessage.hide().text("");

      $joinBtn.prop("disabled", true).html(`
        <span class="spinner-border spinner-border-sm me-2"></span> Joining...
      `);

      $.ajax({
        method: "POST",
        url: "/api/Login.php",
        data: {
          username: username,
          password: password,
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        dataType: "json",
      })
        .then((response) => {
          const token = response.data.token;
          const userId = response.data.id;
          const username = response.data.username;
          const userImage = response.data.profile_image;

          sessionStorage.setItem("auth_token", token);
          sessionStorage.setItem("user_id", userId);
          sessionStorage.setItem("username", username);
          sessionStorage.setItem("user_image", userImage);

          window.location.href = `chat.html?id=${userId}&username=${encodeURIComponent(
            username
          )}&image=${encodeURIComponent(userImage)}`;
        })
        .catch((error) => {
          let errorMsg = "Login failed! Please try again.";

          if (error.status === 401) {
            errorMsg = "Invalid username or password!";
          } else if (error.responseJSON && error.responseJSON.message) {
            errorMsg = error.responseJSON.message;
          }

          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: errorMsg,
          });

          console.log("Login failed:", errorMsg);
        })
        .always(() => {
          setTimeout(() => {
            $("#joinBtn").prop("disabled", false).html("Join");
          }, 1000);
        });
    }
  });
});
