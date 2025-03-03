localStorage.setItem("userCredentials", JSON.stringify({
    username: "user1",
    password: "user1pass"
}));
let role= localStorage.getItem("role")
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
    let userCredentials = JSON.parse(localStorage.getItem("userCredentials"));
    
    $("#admin-login").on("click", function (e) {
        e.preventDefault();
        let username = $("#username").val();
        let password = $("#password").val();

        if (!validateForm()) {
            return;
        }

        if (userCredentials) {
            if (username !== userCredentials.username || password !== userCredentials.password) {
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: "Invalid Credentials"
                });
            } else {
                localStorage.setItem("role", "user");
                Swal.fire({
                    title: "Success",
                    icon: "success",
                    text: "Login Successful"
                }).then(()=>{
                    window.location.reload()
                });
            }
        } else {
            Swal.fire({
                title: "Warning",
                icon: "warning",
                text: "Credentials Unavailable. Click OK to reload."
            }).then(() => {
                window.location.reload();
            });
        }
    });
});
