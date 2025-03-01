function warningMessage(element, text, display = "visible") {
    const errorElement = document.querySelector(`${element} + p`);
    errorElement.textContent = text;
    errorElement.style.color = "red";
    errorElement.style.padding = "10px 5px 0px"
    errorElement.style.display = display
}

function validateName() {
    const fullName = document.querySelector("#fullName").value;
    if (fullName.trim() === "") {
        warningMessage("#fullName", "Full Name is required");
        return false
    }
    else if (fullName.length < 3) {
        warningMessage("#fullName", "Full Name must be greater than 3 characters");
        return false
    }
    else {
        warningMessage("#fullName", "", "none")
        return true
    }
}

function validateEmail() {
    const email = document.querySelector("#email").value;
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    if (email.trim() === "") {
        warningMessage("#email", "Email is Required")
        return false
    }
    else if (!(pattern.test(email))) {
        warningMessage("#email", "Enter valid Email address")
        return false
    }
    else {
        warningMessage("#email", "", "none")
        return true
    }

}

function validateDateOfBirth() {
    const dateOfBirth = document.querySelector("#dateOfBirth").value
    if (!dateOfBirth) {
        warningMessage("#dateOfBirth", "Date of Birth is Required")
        return false
    }
    else {
        warningMessage("#dateOfBirth", "", "none")
        return true
    }
}

function validateGender() {
    const gender = document.querySelector("input[name='gender']:checked")
    if (!gender) {
        warningMessage("label[for='female']", "Gender is Required")
        return false
    }
    else {
        warningMessage("label[for='female']", "", "none")
        return true
    }
}
function validatePassword() {
    const password = document.querySelector("#password").value
    const pattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/;
    if (password.trim() === "") {
        warningMessage("#password", "Password is Required")
        return false
    }
    else if (password.length < 8) {
        warningMessage("#password", "Password must be more than 8 characters")
        return false
    }
    else if (!(pattern.test(password))) {
        warningMessage("#password", "Password must contain numbers and alphabets")
        return false
    }
    else {
        warningMessage("#password", "", "none")
        return true
    }


}

function validateConfirmPassword() {
    const confirmPassword = document.querySelector("#confirmPassword").value
    const password = document.querySelector("#password").value

    if (confirmPassword.trim() === "") {
        warningMessage("#confirmPassword", "Confirm your Password")
        return false
    }
    else if (confirmPassword !== password) {
        warningMessage("#confirmPassword", "Password doesn't match")
        return false
    }
    else {
        warningMessage("#confirmPassword", "", "none")
        return true
    }
}



document.getElementById("submit-btn").addEventListener("click", (e) => {
    e.preventDefault();
    validateConfirmPassword()
    validateDateOfBirth()
    validateEmail()
    validateGender()
    validatePassword()
    validateName()
    if (validateName() && validateEmail() && validateDateOfBirth() && validateGender() && validatePassword() && validateConfirmPassword()) {
        swal("Registration Successful", "You have Registered successfully", "success").then(() => {
            location.reload()
        })

    }

})

