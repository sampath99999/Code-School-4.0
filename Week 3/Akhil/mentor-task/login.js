const loginform = [
  {
    id : 'username',
    lable : 'username',
    rules : ['required']
  },
  {
    id : 'password',
    lable : 'password',
    rules : ['required']
  }
]
function loginValidation(field){
  let element = $(`#${field.id}`).val()
  let valid = true
  for(let rule of field.rules){
    if(rule == 'required'){
      if(!element || element.length == 0 ){
        $(`#error${field.lable}`).text(`Please enter your ${field.lable}`);
        valid = false;
      }
    }
  }
  if(!valid){
    $(`#${field.id}`).css("border", "2px solid red")
  }
  else{
    $(`#${field.id}`).css("border", "");
    $(`#error${field.lable}`).text('');
  }
  return valid
}
if(localStorage.getItem('accessToken')){
  window.location.href = 'employee.html'
  console.log("login")
}
else{
    $(document).ready(function(){
      $('#submit').click(function(event){
        event.preventDefault();
        let status = true;
        for(let field of loginform){
          status = loginValidation(field) && status
        }
        if(status){
          $.ajax({
            url : 'https://dummyjson.com/auth/login',
            method : 'POST',
            contentType : 'application/json',
            data: JSON.stringify({
              username : $('#username').val(),
              password : $('#password').val(),  
              expiresInMins : 120, 
            }),
      
            success : function(response){
              console.log(response);
              localStorage.setItem('accessToken',response.accessToken);
              window.location.href = 'employee.html'
            },
      
            error :function(error){
              console.log(error)
              $('#response').text(error.responseJSON.message)
            }
          })
        }
      })
    })
}
