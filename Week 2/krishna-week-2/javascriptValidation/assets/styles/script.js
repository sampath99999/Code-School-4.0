function validateFullName() {
  const fullName = document.getElementById("fullName").value;
  const fullNameErr = document.getElementById("fullNameErr");
  if (fullName.length < 10 || fullName === "") {
    fullNameErr.innerHTML = "Please enter a valid full name (at least 10 letters).";
    return false;
  } else {
    fullNameErr.innerHTML = "";
    return true;
  }
}

function validateEmail() {
  const email = document.getElementById("email").value;
  const emailErr = document.getElementById("emailErr");
  if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
    emailErr.innerHTML = "Please enter a valid email address.";
    return false;
  } else {
    emailErr.innerHTML = "";
    return true;
  }
}

function validateDateOfBirth() {
  const dateOfBirth = document.getElementById("dob").value;
  const dateOfBirthErr = document.getElementById("dateOfBirthErr");
  let errorMessage = "";
  if (dateOfBirth === "") {
    dateOfBirthErr.innerHTML = "Date of Birth cannot be empty.";
    return false;
  } else {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    let monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {

    }
    if (age < 18 || age > 65) {
      dateOfBirthErr.innerHTML = "You must be between 18 and 65 years old.";
      return false;
    } else {
      dateOfBirthErr.innerHTML = "";
      return true;
    }
  }
}

function validatePhoneNumber() {
  const phoneNum = document.getElementById("phone").value;
  const phoneNumErr = document.getElementById("phoneNumErr");
  if (!phoneNum.match(/^\d{10}$/)) {
    phoneNumErr.innerHTML = "Please enter a valid 10-digit phone number.";
    return false;
  } else {
    phoneNumErr.innerHTML = "";
    return true;
  }
}

function validateNationality() {
  const nationality = document.getElementById("nationality").value;
  const nationalityErr = document.getElementById("nationalityErr");
  if (nationality === "select") {
    nationalityErr.innerHTML = "Please select your nationality.";
    return false;
  } else {
    nationalityErr.innerHTML = "";
    return true;
  }
}

function validatePassword() {
  const password = document.getElementById("password").value;
  const passwordErr = document.getElementById("passwordErr");
  if (password.length < 6) {
    passwordErr.innerHTML = "Password must be at least 6 characters.";
    return false;
  } else {
    passwordErr.innerHTML = "";
    return true;
  }
}

function validateConfirmPassword() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const confirmPasswordErr = document.getElementById("confirmPasswordErr");
  if (confirmPassword !== password || confirmPassword === "") {
    confirmPasswordErr.innerHTML = "Passwords do not match.";
    return false;
  } else {
    confirmPasswordErr.innerHTML = "";
    return true;
  }
}

function validateGender() {
  const gender = document.querySelector('input[name="gender"]:checked');
  const genderErr = document.getElementById("genderErr");
  if (!gender) {
    genderErr.innerHTML = "Please select your gender.";
    return false;
  } else {
    genderErr.innerHTML = "";
    return true;
  }
}

function validateForm(event) {
  event.preventDefault();
  clearMessages();
  let isValid = true;

isValid = validateFullName();
isValid = validateEmail();
isValid = validateDateOfBirth();
isValid = validatePhoneNumber();
isValid = validateNationality();
isValid = validatePassword();
isValid = validateConfirmPassword();
isValid = validateGender();


  if (isValid) {
    Swal.fire({
      title: "Good job!",
      text: "Your Registration was Successful!",
      icon: "success",
    });
  }
}

function clearMessages() {
  document.getElementById("fullNameErr").innerHTML = "";
  document.getElementById("emailErr").innerHTML = "";
  document.getElementById("dateOfBirthErr").innerHTML = "";
  document.getElementById("phoneNumErr").innerHTML = "";
  document.getElementById("nationalityErr").innerHTML = "";
  document.getElementById("passwordErr").innerHTML = "";
  document.getElementById("confirmPasswordErr").innerHTML = "";
  document.getElementById("genderErr").innerHTML = "";
}