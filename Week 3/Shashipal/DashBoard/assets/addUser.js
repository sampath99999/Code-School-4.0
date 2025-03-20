if(window.localStorage.getItem("token")){
    window.location.href="profile.html"
}
let userData={}
let formFields = [
    {

        type: "text",
        id: "first-name",
        label: "First Name",
        key: "firstName",
        rules: ["required",]
    },
    {
        type: "text",
        id: "last-name",
        label: "Last Name",
        key: "lastName",
        rules: ["required",]
    },
    {
        type: "text",
        id: "user-name",
        label: "User Name",
        key: "userName",
        rules: ["required", "regex:^[a-zA-Z]+$"]
    },
    {
        type: "email",
        id: "email",
        label: "Email",
        key: "email",
        rules: ["required", "regex:^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"]
    },
    {
        type: "number",
        id: "phone-number",
        label: "Phone Number",
        key: "phone",
        rules: ["required", "min:10", "max:10"]
    }, {
        type: "date",
        id: "date-of-birth",
        key: "birthDate",
        label: "Date of Birth",
        rules: ["required"]
    },
    {
        type: "radio",
        id: "female",
        label: "Gender",
        name: "gender",
        key: "gender",
        rules: ["required"]
    },
    {
        type: "number",
        id: "age",
        label: "Age",
        key: "age",
        rules: ["required"]
    },
    {
        type: "password",
        id: "password",
        label: "Password",
        key: "password",
        rules: ["required", "min:8", "max:20"]
    }

]

function validateFormField(field) {
    let value;
    let errorElement = $(`#${field.id} ~ p`)
    if (field.type == "radio") {
        value = $(`input[name=${field.name}]:checked`).val()

    }
    else {
        value = $(`#${field.id}`).val()
    }
    userData[field.key]=value
    for (rule of field.rules) {
        if (rule == "required") {
            if (!value || value.length == 0) {
                errorElement.text(`${field.label} is required`)
                errorElement.addClass("text-danger")
                return false
            }
        }
        if (rule.includes("min")) {
            let splittedRule = rule.split(":")
            let minLength = splittedRule[1]
            if (value.length < minLength) {
                errorElement.text(`${field.label} should be at least ${minLength} characters`)
                errorElement.addClass("text-danger")
                return false
            }

        }
        if (rule.includes("max")) {
            let splittedRule = rule.split(":")
            let maxLength = splittedRule[1]
            if (value.length > maxLength) {
                errorElement.text(`${field.label} should not exceed ${maxLength} characters`)
                errorElement.addClass("text-danger")
                return false
            }

        }
        if (rule.includes("regex")) {
            let pattern = new RegExp(rule.split(":")[1]);
            if (!pattern.test(value)) {
                errorElement.text(`Enter a valid ${field.label}`);
                errorElement.addClass("text-danger")
                return false;
            }
        }
    }
    errorElement.text("")
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
    $("#add").click(function () {
        if (validateForm()) {
           $.ajax({
            url: "https://dummyjson.com/users/add",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(userData),
            success: function (res) {
                console.log(res)
                Swal.fire({
                    title: "Success",
                    text: "Added Successful",
                    icon: "success"
                });
            },
            error: function(err){
                console.log(err.responseJSON.message)
            }
           })
        }


    })
})
