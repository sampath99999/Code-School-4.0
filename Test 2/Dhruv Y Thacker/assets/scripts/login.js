let data={}
let formFields = [

    {
        id: "email",
        label: "Email",
        rules: ["required", "regex:^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"],
        key: "email"
    },
    {
        id: "password",
        label: "Password",
        rules: ["required","min:6"],
        key: "password"
    },

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
        if (rule.includes("regex")) {
            let pattern = new RegExp(rule.split(":")[1])
            if (!pattern.test(value)) {
                errorElement.text(`Enter valid ${field.label}`)
                element.addClass("is-invalid")
                errorElement.addClass("invalid-feedback")
                return false
            }
        }
        if (rule.includes("min")) {
            let minLength = rule.split(":")[1]
            if (value.length < minLength) {
                errorElement.text(`Enter at least ${minLength} characters`)
                element.addClass("is-invalid")
                errorElement.addClass("invalid-feedback")
                return false
            }
        }
        if (rule.includes("max")) {
            let maxLength = rule.split(":")[1]
            if (value.length > maxLength) {
                errorElement.text(`Length should not exceed ${maxLength} characters`)
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


$(document).ready(function(){
    $("#login").click(function(e){
        e.preventDefault()
        if(validateForm()){
            console.log(data)
            $.ajax({
                url:"api/login.php",
                type:"POST",
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded'
                },
                data:data,
                success:function(res){
                    sessionStorage.setItem("token",res.data.token)
                    Swal.fire("Success",res.message,"success").then(()=>{
                        if(res.data.role=="admin"){
                            window.location.href="admin.html"
                        }
                        else{
                            window.location.href="user.html"

                        }
                    })
                },
                error:function(err){
                    Swal.fire("Error",err.responseJSON.message,"error")
                }
            })
        }

    })
})