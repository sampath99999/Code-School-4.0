let data = {}
let formFields = [
    {
        id: "user-name",
        label: "User Name",
        key: "username",
        rules: ["required"]
    },
    {
        id: "password",
        label: "Password",
        key: "password",
        rules: ["required"]
    }
]
function validateFormField(field) {
    let element = $(`#${field.id}`)
    let errorElement = $(`#${field.id} + p`)
    let value = $(`#${field.id}`).val()
    data[field.key] = value

    for (let rule of field.rules) {
        if (rule == "required") {
            if (!value.trim() || value.length == 0) {
                errorElement.text(`${field.label} is required`)
                element.addClass("is-invalid")
                errorElement.addClass("invalid-feedback")

                return false
            }
        }
    }
    errorElement.text("")
    element.removeClass("is-invalid")
    element.addClass("is-valid")
    errorElement.removeClass("invalid-feedback")
    return true
}
function validateForm() {
    let status = true
    for (field of formFields) {
        status = validateFormField(field) && status
    }
    return status
}


$(document).ready(function () {
    $.ajax({
        url: 'https://dummyjson.com/quotes/random',
        type: "GET",
        dataType: "json",
        success: function (response) {
            let quote = response.quote
            $("#random-quote").text(quote)
        },
        error: function (error) {
            $("#random-quote").text( error.responseJSON.message)
        }
    })
    $("#login").click(function(){
      if(validateForm()){
        $(this).html(`<div class="spinner-border text-white" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`)
        $.ajax({
            url: 'https://dummyjson.com/auth/login',
            type: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            credentials: 'include' ,
            success: function (response) {
                localStorage.setItem("accessToken",response.accessToken)
                $("#login").html("Login")
                Swal.fire({
                    title: "Success",
                    icon: "success",
                    text: "Login Successfully"
                })
            },
            error: function (error) {
                $("#login").html("Login")
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: error.responseJSON.message
                })
            }
        })
      }
    })
   
})