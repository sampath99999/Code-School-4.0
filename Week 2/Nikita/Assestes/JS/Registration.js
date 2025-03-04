let flag_1,flag_2,flag_3, flag_4,flag_5;
flag_1=flag_2=flag_3=flag_4=flag_5=true;

//User Validation
function userNameValidation() {
    let userName = document.getElementById("userName");
    let trimUserName = userName.value.trim();
    let namePattern = /^[a-zA-Z]{4,15}$/; // Allows only letters, 4 to 15 characters
    let hint = document.getElementById("userName_hint");

    if (trimUserName == "") {
        hint.innerText = "Name Required";
        hint.style.color = "teal";
        flag_1=false;
    } else if (!namePattern.test(trimUserName)) {
        hint.innerText = "Name should be between 4 and 15 letters, no numbers or special characters!";
        hint.style.color = "teal";
        flag_1=false;
    } else {
        hint.innerText = " Valid Name!";
        hint.style.color = "white";
        flag_1=true;
    }
}

//password Validation

// At least 8 characters long
//  At least one uppercase letter (A-Z)
//  At least one lowercase letter (a-z)
// At least one number (0-9)
// At least one special character (!@#$%^&*)

function passwordValidation() {
    let password = document.getElementById("password").value.trim();
    let password_hint = document.getElementById("password_hint");
    if (password == "") {
        password_hint.innerText = "Password Required";
        password_hint.style.color = "teal";
        flag_2=false;
        return;
    }
    else if (password.length < 8) {
        password_hint.innerText = "Password must be at least 8 characters long";
        password_hint.style.color = "teal";
        flag_2=false;
        return;
    }
    else if (!/[A-Z]/.test(password)) {
        password_hint.innerText = "Password must include at least one uppercase letter (A-Z)";
        password_hint.style.color = "teal";
        flag_2=false;
        return;
    }
    else if (!/[a-z]/.test(password)) {
        password_hint.innerText = "Password must include at least one lowercase letter (a-z)";
        password_hint.style.color = "teal";
        flag_2=false;
        return;
    }
    else if (!/[0-9]/.test(password)) {
        password_hint.innerText = "Password must include at least one number (0-9)";
        password_hint.style.color = "teal";
        flag_2=false
        return;
    }
    else if (!/[@$!%*?&]/.test(password)) {
        password_hint.innerText = "Password must include at least one special character (@$!%*?&)";
        password_hint.style.color = "teal";
        flag_2=false
        return;
    }
    password_hint.innerText = "Strong Password!";
    password_hint.style.color = "white";
    flag_2=true;
}

//Email-Id Validation
// Must contain "@" and "."
//  Should start with a letter or number
//  Cannot contain spaces or special characters (except . and _)
//  The domain should be valid (e.g., gmail.com, yahoo.co.in)

function emailValidation() {
    let email = document.getElementById("emailId").value.trim(); // Correct ID
    let email_hint = document.getElementById("email_hint");

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email == "") {
        email_hint.innerText = "Email is required";
        email_hint.style.color = "teal";
        flag_3=false;
    } else if (!emailPattern.test(email)) {
        email_hint.innerText = "Invalid Email Format! (e.g., example@gmail.com)";
        email_hint.style.color = "teal";
        flag_3=false;
    } else {
        email_hint.innerText = "Valid Email!";
        email_hint.style.color = "white";
        flag_3=true;
    }
}

//  The number should contain only digits.
//  It should be exactly 10 digits long.
//  It should not contain letters or special characters.
function contactValidation() {
    let number = document.getElementById("contactNo").value.trim(); 
    let number_hint = document.getElementById("number_hint"); 

    // Check if input is empty
    if (number == "") {
        number_hint.innerText = "Mobile number is required";
        number_hint.style.color = "teal";
        flag_4=false;
    }
    // Check if the number contains only digits
    else if (isNaN(number)) {
        number_hint.innerText = "Mobile number must contain only digits";
        number_hint.style.color = "teal";
        flag_4=false;
    }
    // Check if the number has exactly 10 digits
    else if (number.length !== 10) {
        number_hint.innerText = "Mobile number must be exactly 10 digits";
        number_hint.style.color = "teal";
        flag_4=false;
    }
    // If valid
    else {
        number_hint.innerText = "Valid Mobile Number!";
        number_hint.style.color = "white";
        flag_4=true;
    }
}



//Form Submition
function validateForm(event) {
    event.preventDefault(); // Prevent form submission
    let genderHint = document.getElementById("gender_hint");
    let maleRadio = document.getElementById("male");
    let femaleRadio = document.getElementById("female");
    let isValid = true;

    

    // Username validation
    userNameValidation();
    // Password validation
    passwordValidation();
    // Email validation
    emailValidation();
    // Contact number validation
    contactValidation();
    // // Gender validation
    if (!maleRadio.checked && !femaleRadio.checked) {
        genderHint.innerText = "Please select your gender";
        genderHint.style.color = "teal";
        flag_5=false;
    } else {
        genderHint.innerText = "";
        flag_5=true;
    }

    // Final validation check
    if (flag_1&&flag_2&&flag_3&&flag_4&&flag_5) {
       
        // Swal.fire("Registration Successful",
            
        // );
        Swal.fire({
            title: "Success!",
            text: "Your operation was completed successfully.",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#FFA500", // Orange color
        });
    }
}
 
