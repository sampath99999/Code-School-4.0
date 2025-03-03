
const btn = document.getElementById("btn");
btn.disabled = true; 


let a1, a2, a3, a4;
a1 = a2 = a3 = a4 = true;


function validateFullName() {
  let fullName = document.getElementById("fullName").value;
  let fullNameError = document.getElementById("fullNameError");
  let namePattern = /^[a-zA-Z ]{3,}$/;

  if (fullName.trim() === "") {
      fullNameError.textContent = "Full name is required.";
      a1 = true;
  } else if (!namePattern.test(fullName)) {
      fullNameError.textContent = "Enter a valid name (at least 3 alphabets).";
      a1 = true;
  } else {
      fullNameError.textContent = "";
      a1 = false;
  }
  updateButtonState();
}


function validateEmail() {
  let email = document.getElementById("email").value;
  let emailError = document.getElementById("emailError");
  let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;

  if (email.trim() === "") {
      emailError.textContent = "Email is required.";
      a2 = true;
  } else if (!emailPattern.test(email)) {
      emailError.textContent = "Enter a valid email address.";
      a2 = true;
  } else {
      emailError.textContent = "";
      a2 = false;
  }
  updateButtonState();
}


function validatePassword() {
  let password = document.getElementById("password").value;
  let passwordError = document.getElementById("passwordError");
  let passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{7,}$/;

  if (password.trim() === "") {
      passwordError.textContent = "Password is required.";
      a3 = true;
  } else if (!passwordPattern.test(password)) {
      passwordError.textContent = "Password must be at least 7 characters long and contain both letters and numbers.";
      a3 = true;
  } else {
      passwordError.textContent = "";
      a3 = false;
  }
  updateButtonState();
}


function validateDob() {
  let dob = document.getElementById("dateOfBirth").value;
  let dobError = document.getElementById("dobError");

  if (dob.trim() === "") {
      dobError.textContent = "Date of birth is required.";
      a4 = true;
  } else {
      let birthDate = new Date(dob);
      let today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      let monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }

      if (age < 18) {
          dobError.textContent = "You must be at least 18 years old.";
          a4 = true;
      } else {
          dobError.textContent = "";
          a4 = false;
      }
  }
  updateButtonState();
}


function updateButtonState() {
    btn.disabled = a1 || a2 || a3 || a4;
}


document.getElementById("fullName").addEventListener("input", validateFullName);
document.getElementById("email").addEventListener("input", validateEmail);
document.getElementById("password").addEventListener("input", validatePassword);
document.getElementById("dateOfBirth").addEventListener("input", validateDob);


document.getElementById("btn").addEventListener("click", (event) => {
  if (!btn.disabled) {  
      event.preventDefault();
      Swal.fire({
        title: "Good job!",
        text: "You clicked the button!",
        icon: "success"
      });
  }
});
