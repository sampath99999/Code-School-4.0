$(document).ready(function(){
  //register page
  $("#registerPage").click(function(){
    window.location.href = "register.html";
  })

  // $("#btnRegister").click(function(){
  //   var firstNameRegister = $("#firstNameRegister").val();
  //   var lastNameRegister = $("#lastNameRegister").val();
  //   var userNameRegister = $("#userNameRegister").val();
  //   var ageRegister = $("#ageRegister").val();
  //   var emailRegister = $("#emailRegister").val();
  //   var passwordRegister = $("#passwordRegister").val();

  //   $.ajax({
  //     type: "POST",
  //     url:'https://dummyjson.com/users/add',
  //     contentType: 'application/json',
  //     data: JSON.stringify({
  //       firstName:firstNameRegister,
  //       lastName:lastNameRegister,
  //       userName:userNameRegister,
  //       age:ageRegister,
  //       email:emailRegister,
  //       password:passwordRegister,
  //   }),
  //   success: function(response) {
  //     console.log(`Registration Successful:`, response);
  //   },
  //     error: function(xhr, status, error) {
  //       console.error('Error:', xhr.responseText);
  //     }
  //   })
  //update page
  $("#updatePage").click(function(){
    window.location.href = "update.html";
  })

  // $("#btnUpdate").click(function(){
  //   var userId =  $("#userId").val();
  //   var userNameUpdate = $("#userNameUpdate").val();
  //   var ageUpdate = $("#ageUpdate").val();
  //   var emailUpdate = $("#emailUpdate").val();
  //   var passwordNew = $("#passwordNew").val();

  //   $.ajax({
  //     type: "PUT",
  //     url:`https://dummyjson.com/users/${userId}`,
  //     contentType: 'application/json',
  //     data: JSON.stringify({
  //       userId:userId,
  //       username:userNameUpdate,
  //       age:ageUpdate,
  //       email:emailUpdate,
  //       password:passwordNew,
  //   }),
  //   success: function(response) {
  //     console.log(`Successfully Updated:`, response.id);
  //     console.log(`Successfully Updated:`, response.username);
  //     console.log(`Successfully Updated:`, response.email);
  //     console.log(`Successfully Updated:`, response.password);
  //   },
  //     error: function(xhr, status, error) {
  //       console.error('Error:', xhr.responseText);
  //     }
  //   })
  // })



    $("#RemovePage").click(function(){
      window.location.href = "delete.html";
  })

  // $("#btnRemove").click(function(){
  //   var userId =  $("#userId").val();

  //   $.ajax({
  //     type: "DELETE",
  //     url:`https://dummyjson.com/users/${userId}`,
  //     contentType: 'application/json',
  //     data: JSON.stringify({
  //       userId:userId,
  //   }),
  //   success: function(response) {
  //     console.log(`Successfully Removed:`, response.isDeleted);
  //   },
  //     error: function(xhr, status, error) {
  //       console.error('Error:', xhr.responseText);
  //     }
  //   })
  // })

  //homePage
  $("#homePage").click(function(){
    window.location.href = "home.html";
  })
  //usersPage
  $("usersPage").click(function(){
    window.location.href = "getUsers.html";
  })
  //logout 
  $("#logOut").click(function(){
    localStorage.removeItem("accessToken");
    window.location.href = "login.html";
  })
})
