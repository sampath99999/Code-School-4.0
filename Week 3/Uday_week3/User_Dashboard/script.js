

$(document).ready(function () {

  function loadButtonClickEvent(buttonId, loadPageDiv, loadPage) {
    $(buttonId).click(function (event) {
      event.preventDefault();
      $(loadPageDiv).load(loadPage);
    });
  }

 

  //sign in page

  loadButtonClickEvent("#logIn", "#pageLoad", "signIn.html");
  $("#logInButton").click(function (event) {
    event.preventDefault();
    let userNameValue = $("#userName").val();
    let passwordValue = $("#password").val();

    if (userNameValue == "" || passwordValue == "") {
      alert("enter all fields");
    } else {
      $.post(
        "https://dummyjson.com/auth/login",
        {
          username: userNameValue,
          password: passwordValue,
        },
        function (response) {
          console.log("Success:", response);
          const accessToken=response.accessToken;
          if(accessToken){
            localStorage.setItem('AccessToken',accessToken);

            window.location.href="dashboard.html"
          }
         
          $("#output").text("Log in successful").css("color", "green");
        }
      ).fail(function (error) {
        console.log("Login failed" + error);
        $("#output").text("Log in failed").css("color", "red");
      });
    }
  });

  //sign Up page

  loadButtonClickEvent("#signUp", "#pageLoad", "signUp.html");
  $("#signUpButton").click(function (event) {
    event.preventDefault();

    let registerFirstNameValue = $("#firstName").val();
    let registerLastNameValue = $("#lastName").val();
    let registerEmailValue = $("#signUpEmail").val();
    let registerPassword = $("#signUpPassword").val();

    if (
      registerFirstNameValue == "" ||
      registerLastNameValue == "" ||
      registerEmailValue == "" ||
      registerPassword == ""
    ) {
      alert("enter all fields");
    } else {
      $.post(
        "https://dummyjson.com/users/add",
        {
          firstName: registerFirstNameValue,
          lastName: registerLastNameValue,
          email: registerEmailValue,
          password: registerPassword,
        },
        function (data, status) {
          $("#output").text("Registration successful").css("color", "green");
          console.log(data);
        }
      ).fail(function (error) {
        $("#output").text("Registration failed").css("color", "red");
        console.log("Error:" + error);
      });
    }
  });

  //Update a user

  loadButtonClickEvent("#update", "#pageLoad", "updateUser.html");

  $("#updateButton").click(function (event) {
    event.preventDefault();
    let userId = $("#userId").val();
    let updateUserName = $("#updateUserName").val();
    let updateFirstName = $("#updateFirstName").val();
    let updateLastName = $("#updateLastName").val();
    let updateEmail = $("#updateEmail").val();
    let updatePassword = $("#updatePassword").val();
    $.ajax({
      url: `https://dummyjson.com/users/${userId}`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify({
        id: userId,
        username: updateUserName,
        firstName: updateFirstName,
        lastName: updateLastName,
        email: updateEmail,
        password: updatePassword,
      }),
      success: function (result) {
        $("#output").text("Update user data successful").css("color", "green");
        console.log("User updated successfully:", result);
      },
      error: function (request, msg, error) {
        $("#output").text("Update user data failed").css("color", "red");
        console.error("Error Status:", request.status);
        console.error("Error Message:", error);
      },
    });
  });

  //Delete user
  loadButtonClickEvent("#delete", "#pageLoad", "deleteUser.html");

  $('#deleteButton').click(function (event) {
    event.preventDefault()
    let userId = $("#userId").val();
    if(userId==""){
      alert("enter all fields");
    }
    else{
      $.ajax({
        url: `https://dummyjson.com/users/${userId}`,
        method: 'DELETE',
        success: function (data) {
            if (data.isDeleted) {
                console.log("User deleted successfully:", data);
                $("#output").text("Successfully deleted the user is: "+userId).css("color", "green");
            }
        },
        error: function (request, msg, error) {
            console.error("Error Status:", request.status); 
            console.error("Error Message:", msg);
        }
    });
    }
  })

  $("#logOut").click(
    function(){
      localStorage.clear();
      location.reload()
    }
  )

});
