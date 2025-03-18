if(window.localStorage.getItem("token")){
    window.location.href="profile.html"
}
$(document).ready(function () {
    let loginDisabled = false
    $("#login").on("click", function (e) {
        e.preventDefault()
        if (!loginDisabled) {
            $("#login").attr("disabled", "disabled")
            loginDisabled = true
            $("#login").html(`<div class="spinner-border"></div>`)
       
        let username = $("#user-name").val().trim()
        let password = $("#password").val().trim()
        $.ajax({
            url: "https://dummyjson.com/user/login",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                username,
                password,
                expiresInMins: 30
            }),
            success: function (res) {
                console.log(res)
                window.localStorage.setItem("token", res.accessToken)
                localStorage.setItem("username",res.username)
                localStorage.setItem("image",res.image)
                if(loginDisabled){
                    $("#login").removeAttr("disabled", "disabled")
                    loginDisabled = false
                    $("#login").html(`Login`)
                }
                
                Swal.fire({
                    title: "Success",
                    text: "Login Successful",
                    icon: "success"
                }).then(()=>{
                    location.reload()
                })
            },
            error: function (err) {
                console.log(err.responseJSON.message)
                if(loginDisabled){
                    $("#login").removeAttr("disabled", "disabled")
                    loginDisabled = false
                    $("#login").html(`Login`)
                }
            }
        }) }

    })
})