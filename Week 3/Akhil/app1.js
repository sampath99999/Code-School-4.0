document.getElementById("Fetch").addEventListener("click", function(){
  fetch("https://dummyjson.com/users/add",{method:"POST",
  headers:{"Content-Type":"application/json", "X-FakeAPI-Action":"register"},
  body:JSON.stringify({
    firstName : document.getElementById("firstname").value,
    lastName : document.getElementById("lastname").value,
    age: document.getElementById("age").value,
  })})
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    document.getElementById('firstFetch').innerHTML = data.firstName;
    document.getElementById('secondFetch').innerHTML = data.lastName;
    document.getElementById('thirdFetch').innerHTML = data.age;
  })
  .catch(error => {console.error('Error:', error);});
});


document.getElementById("Xml").addEventListener("click",function(){
  let xhr = new XMLHttpRequest();
  xhr.open("POST","https://dummyjson.com/users/add",true);
  xhr.setRequestHeader("Content-Type","application/json");
  xhr.onload = function(){
    if(xhr.status == 200 || xhr.status < 300){
      let responseText = JSON.parse(xhr.responseText)
        document.getElementById('firstFetch').innerHTML =responseText.firstName,
        document.getElementById('secondFetch').innerHTML =  responseText.lastName,
        document.getElementById('thirdFetch').innerHTML =responseText.age
        console.log("Success:",responseText);
    }
    else{
      console.log("Error: unable to fetch data");
    }
  }
  xhr.send(JSON.stringify({
    firstName : document.getElementById("firstname").value,
    lastName : document.getElementById("lastname").value,
    age: document.getElementById("age").value,
  }))
});

$(document).ready(function () {
  $("#Jquery").click(function () {
    $.ajax({
      url: "https://dummyjson.com/users/add",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        firstName: $('#firstname').val(),
        lastName: $('#lastname').val(),
        age: $('#age').val(),
      }),
      success: function (response) {
        $("#firstFetch").text(response.firstName);
        $("#secondFetch").text(response.lastName);
        $("#thirdFetch").text(response.age)
        console.log("Success:", response);
      },
      error: function (xhr, status, error) {
        console.log("Error:", error);
      }
    });
  });
});
