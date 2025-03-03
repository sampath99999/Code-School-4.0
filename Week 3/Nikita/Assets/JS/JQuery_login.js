$(document).ready(function () {
   
$("#loginForm").validate({

   
   
rules:{
    userName:{
        required:true,
        minlength:8
    },
    userEmail:{
        required:true,
        email:true
    },
    userPassword:{
        required:true,
        minlength:8,
        
    }
    
},
messages:{
    userName:{
        required:"User name required",
        minlength:"user name must be contain minimum 8 character "
    },
    userEmail:{
        required:"Email required",
        email:"Invalid Email"
    },
    userPassword:{
        required:"Password required",
       
    }
},



});



});