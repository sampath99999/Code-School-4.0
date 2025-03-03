$("#sidebar").load("sidebar.html")
if(!localStorage.getItem("token")){
    window.location.href="index.html"
}
$(document).ready(function () {
    let searchParam = new URLSearchParams(window.location.search)
    let userId = searchParam.get("userId")
    let username = searchParam.get("username")
    console.log(userId)
    console.log(username)
    $.ajax({
        url: 'https://dummyjson.com/users/' + userId,
        type: "GET",
        datatype: "json",
        success: function (user) {
            console.log(user)
            $("#first-name").val(user.firstName)
            $("#last-name").val(user.lastName)
            $("#user-name").val(user.username)
            $("#age").val(user.age)
            $("#email").val(user.email)
        },
        error:function(err){
            console.log(err)
        }
    })
    $("#update-btn").click(function(){
        $.ajax({
            url: "https://dummyjson.com/user/login",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                username,
                password:$("#password").val(),
                expiresInMins: 30
            }),
            success: function (res) {
                $.ajax({
                    url:'https://dummyjson.com/users/'+userId,
                    type:"PATCH",
                    datatype:"json",
                     contentType: "application/json",
                    data:JSON.stringify({
                        firstName:$("#first-name").val(),
                        lastName:$("#last-name").val(),
                        age:$("#age").val(),
                        email:$("#email").val()
                    }),
                    success:function(res){
                        console.log(res)
                        Swal.fire({
                            title:"Success",
                            text:`Updated ${username}'s Details Successfully`,
                            icon:"success"
                        })
                    }
                })
            },
            error: function(err){
                console.log(err.responseJSON.message)
                $("#password + p").text(err.responseJSON.message)
            }
        })
    })
})