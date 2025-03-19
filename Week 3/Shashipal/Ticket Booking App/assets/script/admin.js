localStorage.setItem("adminCredentials", JSON.stringify({
    username: "admin",
    password: "adminpass"
}));
let role=localStorage.getItem("role")
if(role){
    location.href="movies.html"
}

let formFields = [
    {
        id: "username",
        label: "Username",
        required: true
    },
    {
        id: "password",
        label: "Password",
        required: true
    }
];

function validateFields(field) {
    let value = $(`#${field.id}`).val();
    let errorElement = $(`#${field.id}`).next("p");
    errorElement.text("");
    if (field.required) {
        if (value.trim() === "") {
            errorElement.text(`${field.label} is required`);
            return false;
        }
    }
    return true;
}

function validateForm() {
    let status = true;
    for (let field of formFields) {
        status = validateFields(field) && status;
    }
    return status;
}

$(document).ready(function () {
    let adminCredentials = JSON.parse(localStorage.getItem("adminCredentials"));
    
    $("#admin-login").on("click", function (e) {
        e.preventDefault();
        let username = $("#username").val();
        let password = $("#password").val();

        if (!validateForm()) {
            return;
        }

        if (adminCredentials) {
            if (username !== adminCredentials.username || password !== adminCredentials.password) {
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: "Invalid Credentials"
                });
            } else {
                localStorage.setItem("role", "admin");
                Swal.fire({
                    title: "Success",
                    icon: "success",
                    text: "Login Successful"
                }).then(() => {
                    location.reload();
                });
            }
        } else {
            Swal.fire({
                title: "Warning",
                icon: "warning",
                text: "Credentials Unavailable. Click OK to reload."
            }).then(() => {
                location.reload();
            });
        }
    });
});
