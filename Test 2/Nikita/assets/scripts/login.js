$(document).ready(function () {
    $("#loginForm").submit(function (event) {
        console.log("login form is loaded");
        event.preventDefault();

        let name = $("#username").val().trim();
        let password = $("#password").val().trim();

        $(".is-invalid").removeClass("is-invalid");
        $(".text-danger").text("");

        if (name.length < 3) {
            $("#username").addClass("is-invalid");
            $("#usernameError").text("Name must be at least 3 characters.").addClass("text-danger");
            return;
        } else {
            $("#username").addClass("is-valid");
        }

        if (password.length < 6) {
            $("#password").addClass("is-invalid");
            $("#passwordError").text("Password must be at least 6 characters.").addClass("text-danger");
            return;
        } else {
            $("#password").addClass("is-valid");
        }

        $("#loginBtn").prop("disabled", true).text("Logging in...");

        $.ajax({
            method: "POST",
            url: "/API/login.php",
            data: {
                username: name,
                password: password
            },
            dataType: "json"
        }).done(function (response) {
            console.log("Success Response:", response);

            if (response.status === true) {
                let user = response.data;
                localStorage.setItem("token", user.token);
                localStorage.setItem("username", user.username);
                localStorage.setItem("role", user.role);

                Swal.fire({
                    title: "Login Successful!",
                    text: "Welcome, " + user.username + "!",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    let dashboardUrl = (user.role === "owner") ? "/owner-dashboard.html" : "/guard-dashboard.html";
                    window.location.href = dashboardUrl;
                });
            } else {
                $("#serverError").text(response.message).addClass("text-danger").show();
                Swal.fire("Login Failed!", response.message, "error");
            }
        }).fail(function (xhr) {
            let errorMessage = xhr.responseJSON ? xhr.responseJSON.message : "Something went wrong!";
            $("#serverError").text(errorMessage).addClass("text-danger").show();
            Swal.fire("Oops!", errorMessage, "error");
        }).always(function () {
            $("#loginBtn").prop("disabled", false).text("Login");
        });
    });


    $(".form-control").on("input", function () {
        $(this).removeClass("is-invalid is-valid");
        $("#" + $(this).attr("id") + "Error").text("");
    });
});
