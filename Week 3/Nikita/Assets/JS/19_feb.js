//For Loading pages
$(document).ready(function () {
    // Load Register Page
    $('#register-link').click(function (e) {
        e.preventDefault();
        console.log("You clicked Registration link");
        $("#main-content").load("registration.html");
        console.log('registration link is working');
    });
    // Load Delete Account Page 
    $("#delete-link").click(function (e) {
        e.preventDefault();
        $("#main-content").load("delete.html");
    });
    //Load Update Account Page
    $("#update-link").click(function (e) {
        e.preventDefault();
        $("#main-content").load("update.html");
    });
    //Load Display User details
    $("#display-link").click(function (e) {
        e.preventDefault();
        $("#main-content").load("display.html");
    });

    //post Request for sent data into dummy api
    //For Registration Pages
    $("#registration_btn").click(function (event) {
        event.preventDefault(); // Prevent default form submission

        $.post({
            url: "https://dummyjson.com/users/add",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                firstName: $("#firstName").val(),
                lastName: $("#lastName").val(),
                password: $("#password").val(),
                email: $("#emailId").val()
            }),
            success: function (response) {
                console.log(response);
                // alert("User added successfully!(JQuery)");
                Swal.fire({
                    title: "Success!",
                    text: "User added successfully",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "rgb(110, 169, 149)",
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
    });


    //For Login send value into dummy Api
    // $("#login_btn").click(function (event) {
    //     event.preventDefault(); // Prevent default form submission

    //     $.post({
    //         url: "https://dummyjson.com/auth/login",
    //         method: "POST",
    //         contentType: "application/json",
    //         data: JSON.stringify({
    //             username: $("#userName").val(),
    //             password: $("#password").val(),

    //         }),
    //         credentials: 'include',
    //         success: function (response) {
    //             console.log(response);
    //             Swal.fire({
    //                 title: "Success!",
    //                 text: "Login Done",
    //                 icon: "success",
    //                 confirmButtonText: "OK",
    //                 confirmButtonColor: "rgb(110, 169, 149)",
    //             });
    //             //load user dashboard page

    //             $("#main-display").load("19_Feb.html");


    //         },
    //         error: function (error) {
    //             console.error(error);
    //             Swal.fire({
    //                 title: "Error!",
    //                 text: "User not found",
    //                 icon: "error",
    //                 confirmButtonColor: "red"
    //             });
    //         }
    //     });
    // });


    $("#login_btn").click(function (event) {
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
                console.log(response.accessToken);
                localStorage.setItem("accessToken", response.accessToken);
                localStorage.setItem("id", response.id);
                console.log(localStorage.getItem("accessToken", response.accessToken));
                console.log("Access Token stored in localStorage");

                Swal.fire({
                    title: "Success!",
                    text: "Login Done",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "rgb(110, 169, 149)"
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Redirect or load user dashboard
                        // $("#main-display").load("home.html");
                        window.location.href = "home.html";
                        // $("#main-content").html(``)
                       
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
    });


    //for Delete Form

    $('#delete_btn').click(function (e) {
        e.preventDefault();
        let userId = $("#userId").val();
        $.ajax({
            url: `https://dummyjson.com/users/${userId}`,
            method: "DELETE",
            contentType: "application/json",
            success: function (response) {
                console.log("Deleted User:", response);
                Swal.fire({
                    title: "Deleted!",
                    text: `User with ID ${userId} has been deleted.`,
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "rgb(110, 169, 149)"
                });
            },
            error: function (error) {
                console.error("Error:", error);
                Swal.fire({
                    title: "Error!",
                    text: "User not found or could not be deleted.",
                    icon: "error",
                    confirmButtonColor: "red"
                });
            }
        });
    });

    //for update form
    $('#update_btn').click(function (e) {
        e.preventDefault();
        let userId = $("#userId").val();
        $.ajax({
            url: `https://dummyjson.com/users/${userId}`,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify({
                lastName: $("#lastName").val(),

            }),
            success: function (response) {
                console.log("Updated User:", response);
                Swal.fire({
                    title: "Updated!",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "rgb(110, 169, 149)"
                });
            },
            error: function (error) {
                console.error("Error:", error);
                Swal.fire({
                    title: "Error!",
                    text: "User not found",
                    icon: "error",
                    confirmButtonColor: "red"
                });
            }
        });
    });
    //for display 
    $('#display_btn').click(function (e) {
        e.preventDefault();

        let userId = $("#userId").val();
        $.ajax({
            url: `https://dummyjson.com/users/${userId}`,
            method: "GET",
            contentType: "application/json",
            success: function (response) {
                console.log("Display user based on the Id:", response.firstName, response.lastName, response.age, response.gender);

                $("#display_container").html(`
                    
                        <h5>User Retrieved Successfully!</h5>
                        <p><strong>First Name:</strong> ${response.firstName}</p>
                        <p><strong>Last Name:</strong> ${response.lastName}</p>
                        <p><strong>Age:</strong> ${response.age}</p>
                        <p><strong>Gender:</strong> ${response.gender}</p>
                    
                `);
            },
            error: function (error) {
                console.error("Error:", error);
                Swal.fire({
                    title: "Error!",
                    text: "User not found or could not be retrieved.",
                    icon: "error",
                    confirmButtonColor: "red"
                });
            }
        });
    });



    //Validations
    //login
    $("#loginForm").validate({


        rules: {
            userName: {
                required: true,
                minlength: 4
            },

            userPassword: {
                required: true,
                minlength: 8,

            }

        },
        messages: {
            userName: {
                required: "User name required",
                minlength: "user name must be contain minimum 4 character ",

            },

            userPassword: {
                required: "Password required",

            }
        }

    });
    //registration
    $("#registrationForm").validate({


        rules: {
            firstName: {
                required: true,
                minlength: 4
            },
            lastName: {
                required: true,
                minlength: 4
            },

            userPassword: {
                required: true,
                minlength: 8

            },
            userEmail: {
                required: true,
                email: true
            }

        },
        messages: {
            firstName: {
                required: "User name required",
                minlength: "user name must be contain minimum 4 character "

            },
            lastName: {
                required: "Last name required",
                minlength: "Last name must be contain minimum 4 character "
            },

            userPassword: {
                required: "Password required",

            },
            userEmail: {
                required: "Email required",
                email: "email should be name@gmail.com formate"
            }
        }

    });
    //update
    $("#updateForm").validate({
        rules: {
            lastName: {
                required: true,
                minlength: 3
            },
            userId: {
                required: true
            }
        },
        messages: {
            lastName: {
                required: "Last Name Required",
                minlength: "character must be 3 or greater"
            },
            userId: {
                required: "User Id required"
            }
        }
    })
    //Delete

    // //for each profile ...displaying home.html's 'main-content'
    // $.ajax({
    //     url: 'https://dummyjson.com/auth/${localStorage.getItem("id")} ',
    //     method: "GET",
    //     headers: {
    //         'Authorization': 'Bearer  ${localStorage.getItem("accessToken")} ', // Pass JWT via Authorization header
    //     },
    //     contentType: "application/json",
    //     credentials: 'include',
    //     success: function (response) {
    //         console.log(response);
    //       $("#main-content").html(`
    //         <p>Name: ${response.userName}</p>
    //          <p>Age: ${response.age}</p>
    //           <p>Gender: ${response.gender}</p>
    //           <p>email: ${response.email}</p>
    //         `)
    //     },
    //     error: function (error) {
    //         console.error(error);
    //         Swal.fire({
    //             title: "Error!",
    //             text: "User not found",
    //             icon: "error",
    //             confirmButtonColor: "red"
    //         });
    //     }
    // });

});//End 



