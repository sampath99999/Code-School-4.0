$(document).ready(function(){
    $("#deleteBtn").click(function(e){
        e.preventDefault();
        let idInput = $("#idInput").val()

        $.ajax({
            url: `https://dummyjson.com/users/${idInput}`,
            method: 'DELETE',
            contentType: 'application/json',
            success: function(response) {
                console.log(response);
                Swal.fire("Delete Successful!");
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