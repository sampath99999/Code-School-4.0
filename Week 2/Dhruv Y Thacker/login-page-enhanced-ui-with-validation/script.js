let f1, f2, f3, f4;
f1 = f2 = f3 = f4 = false;
//User Validation
function userNameValidation() {
    let userName = document.getElementById("fname").value.trim();
    let namePattern = /^[a-zA-Z]{4,15}$/;
    let hint = document.getElementById("userName_hint");

    if (userName == "") {
        hint.innerText = "Name Required";
        hint.style.color = "red";
        f1 = false;
    } else if (!namePattern.test(userName)) {
        hint.innerText = "Name should be between 4 and 15 letters, no numbers or special characters!";
        hint.style.color = "red";
        f1 = false;
    } else {
        hint.innerText = " Valid Name!";
        hint.style.color = "green";
        f1 = true;
    }
}

//Email-Id Validation
function emailValidation() {
    let email = document.getElementById("femail").value.trim(); // Correct ID
    let email_hint = document.getElementById("email_hint");

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email == "") {
        email_hint.innerText = "Email is required";
        email_hint.style.color = "red";
        f2 = false;
    } else if (!emailPattern.test(email)) {
        email_hint.innerText = "Invalid Email Format! (e.g., example@gmail.com)";
        email_hint.style.color = "red";
        f2 = false;
    } else {
        email_hint.innerText = "Valid Email!";
        email_hint.style.color = "green";
        f2 = true;
    }
}

//password Validation
function passwordValidation() {
    let password = document.getElementById("fpwd").value.trim();
    let password_hint = document.getElementById("password_hint");
    if (password == "") {
        password_hint.innerText = "Password Required";
        password_hint.style.color = "red";
        f3 = false;
        return;
    }
    else if (password.length < 8) {
        password_hint.innerText = "Password must be at least 8 characters long";
        password_hint.style.color = "red";
        f3 = false;
        return;
    }
    else if (!/[A-Z]/.test(password)) {
        password_hint.innerText = "Password must include at least one uppercase letter (A-Z)";
        password_hint.style.color = "red";
        f3 = false;
        return;
    }
    else if (!/[a-z]/.test(password)) {
        password_hint.innerText = "Password must include at least one lowercase letter (a-z)";
        password_hint.style.color = "red";
        f3 = false;
        return;
    }
    else if (!/[0-9]/.test(password)) {
        password_hint.innerText = "Password must include at least one number (0-9)";
        password_hint.style.color = "red";
        f3 = false;
        return;
    }
    else if (!/[@$!%*?&]/.test(password)) {
        password_hint.innerText = "Password must include at least one special character (@$!%*?&)";
        password_hint.style.color = "red";
        f3 = false;
        return;
    }
    else {
        password_hint.innerText = "valid Password!";
        password_hint.style.color = "green";
        f3 = true;
        return;
    }
}

// phoneNumber validation
function contactValidation() {
    let number = document.getElementById("ftel").value.trim();
    let number_hint = document.getElementById("number_hint");

    if (number === "") {
        number_hint.innerText = "Mobile number is required";
        number_hint.style.color = "red";
        f4 = false;
    }
    else if (isNaN(number)) {
        number_hint.innerText = "Mobile number must contain only digits";
        number_hint.style.color = "red";
        f4 = false;
    }
    else if (number.length !== 10) {
        number_hint.innerText = "Mobile number must be exactly 10 digits";
        number_hint.style.color = "red";
        f4 = false;
    }
    else {
        number_hint.innerText = "Valid Mobile Number!";
        number_hint.style.color = "green";
        f4 = true;
    }
}


function validateForm(event) {

    event.preventDefault();
    // Username validation
    userNameValidation();
    // Email validation
    emailValidation();
    // Password validation
    passwordValidation();
    // phone number validation
    contactValidation();



    // Final validation check
    if (f1 && f2 && f3 && f4) {
        Swal.fire({
            title: "Success!",
            text: "Your operation was completed successfully.",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#FFA500", 
        });
    }else{
        Swal.fire({
            title: "Error!",
            text: "Your operation was not completed successfully.",
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#FFA500", 
        });

    }
}