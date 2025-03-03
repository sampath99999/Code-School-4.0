$(document).ready(function(){
    $('#submit').click(function(event){
      event.preventDefault();
      console.log($('#username').val())
      console.log($('#password').val())
      $.ajax({
        url : 'https://dummyjson.com/auth/login',
        method : 'POST',
        contentType : 'application/json',
        data: JSON.stringify({
          username : $('#username').val(),
          password : $('#password').val()
        }),
  
        success : function(response){
          console.log(response);
          localStorage.setItem('accessToken',response.accessToken);
          window.location.href = 'employePage.html'
        },
  
        error :function(error){
          console.log(error)
          $('#response').text(error.responseJSON.message)
        }
      })
    })
  })