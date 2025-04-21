$(document).ready(function(){
    $("#registerBtn").click(function(e){
        e.preventDefault();

        $.ajax({
            url: 'https://dummyjson.com/users/add',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                firstName: $("#firstName").val(),
                lastName: $("#lastName").val(),
                email: $("#email").val(),
                password: $("#password").val(),

                expiresInMins: 30 // optional, defaults to 60
            }),
            success: function(response) {
                console.log(response);
                if(response === ""){
                    $("#contentDisplay").text("response")
                    Swal.fire("Enter Details");
                }
                Swal.fire("Register Successful!");
            },
            error: function(error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Passwords do not match! Please try again."
                  });
            }
        })

    })

    $("#username")

})