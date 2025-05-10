$(document).ready(function(){
    $("#updateBtn").click(function(e){
        e.preventDefault();

        $.ajax({
            url: 'https://dummyjson.com/users/2',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                id: $("#id").val(),
                lastName: $("#lastName").val(),
                expiresInMins: 30 // optional, defaults to 60
            }),
            success: function(response) {
                console.log(response);
                Swal.fire("Update Successful!");
            },
            error: function(error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Wrong Credentials"
                  });
            }
        })
    })
})