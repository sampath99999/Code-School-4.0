$(document).ready(function () {
  $("#loginBtn").click(function (e) {
    e.preventDefault();
    
    if (validateForm()) {
      $.ajax({
        url: "https://dummyjson.com/user/login",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          username: $("#userName").val(),
          password: $("#password").val(),
          expiresInMins: 30, // optional, defaults to 60
        }),
        success: function (response) {
          console.log(response);
          // console.log(response.accessToken)
          localStorage.setItem("accessToken" , response.accessToken)
          localStorage.setItem("id" , response.id )  
          Swal.fire("Login Successful!").then((result)=>{
            if(result.isConfirmed){
              window.location.href = "./index.html";
            }
            
          });
          
        },
        error: function (error) {
          console.error("Error:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Incorrect username OR password",
          });
        },
      });
    }
  });

  let formFields = [
    { id: "userName", label: "Username", rules: ["required", "min:3", "max:25"] },
    { id: "password", label: "Password", rules: ["required", "min:6"] },
  ];

  function validateFormField(field) {
    let value = $("#" + field.id).val().trim(); 
    let errorElement = $("#" + field.id + "Error");
    errorElement.html(""); 

    for (let rule of field.rules) {
      if (rule === "required" && value.length === 0) {
        errorElement.html(field.label + " is required");
        return false;
      }

      if (rule.includes("min")) {
        let splittedRule = rule.split(":");
        let minLength = parseInt(splittedRule[1]);

        if (value.length < minLength) {
          errorElement.html(field.label + " should be at least " + minLength + " characters");
          return false;
        }
      }

      if (rule.includes("max")) {
        let splittedRule = rule.split(":");
        let maxLength = parseInt(splittedRule[1]);

        if (value.length > maxLength) {
          errorElement.html(field.label + " should be at most " + maxLength + " characters");
          return false;
        }
      }
    }
    return true;
  }

  function validateForm() {
    let status = true;

    for (let field of formFields) {
      status = validateFormField(field) && status;
    }

    return status;
  }

  $("#registerLink").click(function () {
    $("#content-display").load("register.html");
  });
});
