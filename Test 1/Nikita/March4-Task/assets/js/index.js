$(document).ready(function () {
    // Registration Form Validation
    $("#registrationForm").validate({
        rules: {
            firstName: {
                required: true,
                minlength: 2
            },
            lastName: {
                required: true,
                minlength: 2
            },
            username: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 8,

            },
            confirmPassword: {
                required: true,
                equalTo: "#password"
            }
        },
        messages: {
            firstName: {
                required: "<span style='color: red;'>First name is required</span>",
                minlength: "<span style='color: red;'>First name must be at least 2 characters</span>"
            },
            lastName: {
                required: "<span style='color: red;'>Last name is required</span>",
                minlength: "<span style='color: red;'>Last name must be at least 2 characters</span>"
            },
            username: {
                required: "<span style='color: red;'>Email is required</span>",
                email: "<span style='color: red;'>Enter a valid email</span>"
            },
            password: {
                required: "<span style='color: red;'>Password is required</span>",
                minlength: "<span style='color: red;'>Password must be at least 8 characters</span>"
            },
            confirmPassword: {
                required: "<span style='color: red;'>Confirm password is required</span>",
                equalTo: "<span style='color: red;'>Passwords do not match</span>"
            }
        },
        submitHandler: function (form, event) {
            event.preventDefault(); // Prevent form submission

            $.ajax({
                url: "https://dummyjson.com/users/add",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    firstName: $("#firstName").val(),
                    lastName: $("#lastName").val(),
                    password: $("#password").val(),
                    email: $("#username").val()
                }),
                success: function (response) {
                    console.log(response);
                    Swal.fire({
                        title: "Success!",
                        text: "User added successfully",
                        icon: "success",
                        confirmButtonText: "OK",
                        confirmButtonColor: "rgb(34, 106, 188)",
                    });
                },
                error: function (error) {
                    console.error(error);
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to add user",
                        icon: "error",
                        confirmButtonColor: "red"
                    });
                }
            });
        }
    });

    // Click event for submit button
    $("#registration_btn").click(function () {
        $("#registrationForm").submit();
    });



    //login validation and  post method
    $("#loginForm").validate({
        rules: {
            userName: {
                required: true
            },
            loginPassword: {
                required: true
            }
        },
        messages: {
            userName: {
                required: "<span style='color: red;'>User Name is required</span>"
            },
            loginPassword: {
                required: "<span style='color: red;'>Password is required</span>"
            }
        },
        submitHandler: function (form, event) {
            event.preventDefault(); // Prevent default form submission

            $.ajax({
                url: "https://dummyjson.com/auth/login",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    username: $("#userName").val(),
                    password: $("#password").val(),
                    expiresInMins: 30,
                }),
                success: function (response) {
                    console.log(response);
                    localStorage.setItem("accessToken", response.token);
                    localStorage.setItem("id", response.id);
                    localStorage.setItem("username", response.username);
                    localStorage.setItem("email", response.email);
                    localStorage.setItem("firstName", response.firstName);
                    localStorage.setItem("lastName", response.lastName);


                    console.log("User data stored in localStorage");
                    console.log("User data stored in localStorage username",username);

                    Swal.fire({
                        title: "Success!",
                        text: "Login Done",
                        icon: "success",
                        confirmButtonText: "OK",
                        confirmButtonColor: "rgb(47, 82, 208)"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = "display.html";
                        }
                    });
                },
                error: function (error) {
                    console.error(error);
                    Swal.fire({
                        title: "Error!",
                        text: "User not found",
                        icon: "error",
                        confirmButtonColor: "red"
                    });
                }
            });
        }
    });


    $("#login_btn").click(function () {
        $("#loginForm").submit();
    });


    //display user details:
    const userId = localStorage.getItem("id");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");

    // Display user data
    $("#userId").text(userId);
    $("#userName").text(username);
    $("#userEmail").text(email);
    $("#userFullName").text(`${firstName} ${lastName}`);




});

