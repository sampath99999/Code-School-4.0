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

$(document).ready(function(){
    $("#login").click(function (event) {
    console.log("Form submitted");
  event.preventDefault();

  let status = true;
  for (let field of formfields) {
    let valid = form_validation(field);
    status = status && valid;
  }

  if (status) {
    $.ajax({
      url: "/api/admin.php",
      method: "POST",
      data: {
        username: $("#username").val(),
        password: $("#password").val(),
        admin: "true",
      },
      dataType: "json",
      success: function (response) {
        console.log("Login successful:", response);
        localStorage.setItem("token", response.data.token);
        window.location.href="adminMain.html";
      },
      error: function (xhr) {
        console.error("Login failed:", xhr.responseText);
        try {
          const msg = JSON.parse(xhr.responseText);
          $("#msg").text(msg.message).addClass("text-danger");
        } catch (e) {
          $("#msg").text("Unknown error").addClass("text-danger");
        }
      },
    });
  }
});
})
