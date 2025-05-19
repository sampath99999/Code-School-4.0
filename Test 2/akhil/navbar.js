$(document).ready(function(){
    $.ajax({
        url:'/api/navbar.php',
        type:'GET',
        headers:{
            'Authorization':  localStorage.getItem('token')
        },
        success:function(data){
            console.log("data fetched")
        },
        error:function(){
            console.log("error")
        }
    })
})