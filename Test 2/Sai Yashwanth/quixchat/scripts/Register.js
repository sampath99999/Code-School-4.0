$(document).ready(function () {
  $("#profileImage").change(function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        $("#profilePreview").attr("src", event.target.result).show();
      };
      reader.readAsDataURL(file);
    }
  });

  const fields = [
    {
      id: "username",
      type: "input",
      requiredMsg: "Username is required",
      pattern: /^[a-zA-Z0-9_]{3,50}$/,
      errorMsg: "3–50 characters, alphanumeric or underscores",
    },
    {
      id: "email",
      type: "input",
      requiredMsg: "Email is required",
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      errorMsg: "Invalid email format",
    },
    {
      id: "password",
      type: "input",
      requiredMsg: "Password is required",
      pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
      errorMsg: "Min 8 chars with letters, numbers & symbol",
    },
  ];

  function validateField(field) {
    const $el = $("#" + field.id);
    const val = $el.val().trim();
    const $formFloating = $el.closest(".form-floating");

    if ($("#" + field.id + "Error").length === 0) {
      $el.after(
        `<div class="invalid-feedback d-block" id="${field.id}Error"></div>`
      );
    }

    const $err = $("#" + field.id + "Error");

    if (val === "") {
      $el.addClass("is-invalid");
      $formFloating.addClass("is-invalid");
      $err.text(field.requiredMsg).show();
      return false;
    } else if (field.pattern && !field.pattern.test(val)) {
      $el.addClass("is-invalid");
      $formFloating.addClass("is-invalid");
      $err.text(field.errorMsg).show();
      return false;
    } else {
      $el.removeClass("is-invalid");
      $formFloating.removeClass("is-invalid");
      $err.text("").hide();
      return true;
    }
  }

  fields.forEach((field) => {
    $("#" + field.id).on("input", () => validateField(field));
  });

  $("#confirmPassword").on("input", function () {
    const password = $("#password").val().trim();
    const confirmPassword = $(this).val().trim();
    const $field = $(this);
    const $group = $field.closest(".form-floating");

    if ($("#confirmPasswordError").length === 0) {
      $field.after(
        '<div class="invalid-feedback d-block" id="confirmPasswordError"></div>'
      );
    }

    const $error = $("#confirmPasswordError");

    if (confirmPassword !== password) {
      $field.addClass("is-invalid");
      $group.addClass("is-invalid");
      $error.text("Passwords do not match!").show();
    } else {
      $field.removeClass("is-invalid");
      $group.removeClass("is-invalid");
      $error.text("").hide();
    }
  });

  $("#password").on("input", function () {
    $("#confirmPassword").trigger("input");
  });

  $("#registerForm").submit(function (e) {
    e.preventDefault();

    let isValid = true;
    fields.forEach((field) => {
      isValid = validateField(field) && isValid;
    });

    const password = $("#password").val().trim();
    const confirmPassword = $("#confirmPassword").val().trim();
    const $confirmField = $("#confirmPassword");
    const $confirmGroup = $confirmField.closest(".form-floating");

    if ($("#confirmPasswordError").length === 0) {
      $confirmField.after(
        '<div class="invalid-feedback d-block" id="confirmPasswordError"></div>'
      );
    }

    const $confirmError = $("#confirmPasswordError");

    if (password !== confirmPassword) {
      $confirmField.addClass("is-invalid");
      $confirmGroup.addClass("is-invalid");
      $confirmError.text("Passwords do not match!").show();
      isValid = false;
    } else {
      $confirmField.removeClass("is-invalid");
      $confirmGroup.removeClass("is-invalid");
      $confirmError.hide();
    }

    if (isValid) {
      $("#errorMessage").hide();

      const formData = new FormData();
      formData.append("username", $("#username").val().trim());
      formData.append("email", $("#email").val().trim());
      formData.append("password", password);
      formData.append("profileImage", $("#profileImage")[0].files[0]);

      $.ajax({
        url: "/api/Register.php",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
          Swal.fire({
            icon: "success",
            title: "Registered!",
            text: response.message,
          }).then(() => {
            window.location.href = "index.html";
          });
        },
        error: function (xhr) {
          const msg = xhr.responseJSON?.message || "Registration failed";
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: msg,
          });
        },
      });
    }
  });
});
