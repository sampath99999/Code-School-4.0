
  const formfields = [
    {
      id: "username",
      label: "username",
      rules: ["required"],
    },
    {
      id: "password",
      label: "password",
      rules: ["required"],
    },
  ];

  function form_validation(field) {
    let value = $(`#${field.id}`).val().trim();
    let valid = true;

    // Clear old errors
    $(`#${field.id}`).removeClass('is-invalid');
    $(`#error${field.label}`).text("");

    for (let rule of field.rules) {
      if (rule == "required" && !value) {
        $(`#error${field.label}`).text("Please fill this field");
        $(`#${field.id}`).addClass('is-invalid');
        valid = false;
      }
    }
    return valid;
  }

  function login(event) {
    event.preventDefault();
    let status = true;

    for (let field of formfields) {
      let valid = form_validation(field);
      status = status && valid;
    }

    if (status) {
      $.ajax({
        url: "/api/login.php",
        method: "POST",
        data: {
          username: $("#username").val(),
          password: $("#password").val(),
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        success: function (response) {
             console.log("Raw response:", response);
          const result = JSON.parse(response);
          localStorage.setItem("token", result.data.token);
          console.log("Token stored:", localStorage.getItem("token"));
          $("#username").val("");
          $("#password").val("");
          window.location.replace("home.html");
        },
        error: function (error) {
          const msg = JSON.parse(error.responseText);
          $("#msg").text(msg.message).addClass('text-danger');
        },
      });
    } else {
      console.log("Please fill in the required fields.");
    }
  }

  $(document).ready(function () {
    $("form").submit(login);
  });

