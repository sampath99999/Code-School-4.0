$(document).ready(function () {
  // $("#login").click(function () {
  //   $("#content-display").load("login.html");
  // });

  if(localStorage.getItem("accessToken") === ""){
    return window.location.href ="./login.html"
  }

  const userId = localStorage.getItem("id")
  const token = localStorage.getItem("accessToken")

  if(!userId || !token){
    console.log("local storage is empty")
  }

  $.ajax({
    url: `https://dummyjson.com/auth/me`,
    method : 'GET',
    headers:{
      'Authorization': `Bearer ${token}`
    },
    credentials : "include",
    success: function (response){
      console.log(response)
      // $("#card").html(`<h1>${response.username}<h1>`)
      $("#card").html(`
        <div class="card" style="width: 18rem;">
      <img src="${response.image}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${response.username}</h5>
        <p class="card-text">${response.age}</p>
        <p class="card-text">${response.gender}</p>
        <p class="card-text">${response.address.address}</p>  
        <a href="#" class="btn btn-primary">Update</a>
      </div>
    </div>
        `);
    }
  })


  

  $("#register").click(function () {
    $("#content-display").load("register.html");
  });

  $("#update").click(function () {
    $("#content-display").load("update.html");
  });

  $("#delete").click(function () {
    $("#content-display").load("delete.html");
  });
});
