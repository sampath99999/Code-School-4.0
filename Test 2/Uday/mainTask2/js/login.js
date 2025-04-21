$(document).ready(() => {
  $(".submit").click((event) => {
    event.preventDefault();

    let formFields = [
      {
        id: "email",
        label: "Email",
        rules: ["required", "email"],
      },
      {
        id: "password",
        label: "Password",
        rules: ["required", "min:6", "max:25"],
      },
    ];

    function validateFormField(field) {
      let value = document.getElementById(field.id).value;
      let errorElement = document.getElementById(field.id + "Error");
      errorElement.innerHTML = "";

      for (let rule of field.rules) {
        if (rule === "required") {
          if (!value || value.length == 0) {
            errorElement.innerHTML = field.label + " is required";
            return false;
          }
        }

        if (rule.includes("min")) {
          let splitedRule = rule.split(":");
          let minLength = splitedRule[1];
          if (value.length < minLength) {
            errorElement.innerHTML =
              field.label + " should be atleast " + minLength + " characters";
            return false;
          }
        }

        if (rule.includes("max")) {
          let splitedRule = rule.split(":");
          let maxLength = splitedRule[1];
          if (value.length > maxLength) {
            errorElement.innerHTML =
              field.label + " should be less then " + maxLength + " characters";
            return false;
          }
        }

        if (rule === "email") {
          let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(value)) {
            errorElement.innerHTML = "Invalid email format";
            return false;
          }
        }
      }
      return true;
    }

    function validation() {
      let status = true;
      for (let field of formFields) {
        status = validateFormField(field) && status;
      }
      return status;
    }
    if (validation()) {
      let email = $("#email").val();
      let password = $("#password").val();
      const role = $("#role").val();
      console.log(role);

      let spinner = `<div class="spinner-border" role="status">
                                      <span class="visually-hidden">Loading...</span>
                                    </div>`;
      $(".submit").html(spinner);

      $.ajax({
        method: "POST",
        url: "API/utils/login.php",
        data: {
          email: email,
          password: password,
          role: role,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then(
        (response) => {
          let result = JSON.parse(response);
          console.log(result.data.token);
          if (result.status != "false") {
            localStorage.setItem("token", result.data.token);
            localStorage.setItem("role", role);

            $("#email").val("");
            $("#password").val("");
            window.location.href = "dashboard.html";
          } else {
            Swal.fire({
              title: "Error!",
              text: "Invalid Email or Password",
              icon: "error",
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      Swal.fire({
        title: "Error!",
        text: "Please correct the errors and try again.",
        icon: "error",
      });
    }
  });
});
