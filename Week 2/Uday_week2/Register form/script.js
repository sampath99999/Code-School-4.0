let a, b, c, d, e, f;
a = false;
b = false;
c = false;
d = false;
e = false;
f = false;
function verifyUsername() {
  var Username = document.getElementById("Username").value;
  if (Username.length < 6) {
    document.getElementById("NameError").innerHTML =
      "Username should have minimum 6 characters";
    a = false;
  } else {
    document.getElementById("NameError").innerHTML = "";
    a = true;
  }
}

function verifyPhonenumber() {
  let Phonenumber = document.getElementById("Phonenumber").value;
  if (Phonenumber.length < 10 || Phonenumber.length > 10) {
    PhoneError.innerHTML = "Phone number should have only 10 numbers";
    b = false;
  } else {
    document.getElementById("PhoneError").innerHTML = "";
    b = true;
  }
}

function verifyEmail() {
  let Email = document.getElementById("Email").value;
  console.log(Email);
  if (Email.indexOf("@gmail.com") < 3) {
    document.getElementById("EmailError").innerHTML = "Enter valid email";
    c = false;
  } else {
    document.getElementById("EmailError").innerHTML = " ";
    c = true;
  }
}

function verifyPassword() {
  let Password = document.getElementById("Password").value;
  console.log(Password);
  if (Password.length < 6) {
    document.getElementById("PasswordError").innerHTML =
      "Password must have atleast 6 characters";
    d = false;
  } else {
    document.getElementById("PasswordError").innerHTML = " ";
    d = true;
  }
}

function verifyConfirmPassword() {
  let Password = document.getElementById("Password").value;
  let ConfirmPassword = document.getElementById("ConfirmPassword").value;
  if (Password != ConfirmPassword) {
    document.getElementById("ConfirmPasswordError").innerHTML =
      "Password not matched";
    e = false;
  } else {
    document.getElementById("ConfirmPasswordError").innerHTML = " ";
    e = true;
  }
}

function verifyGender() {
  let GenderMale = document.getElementById("RadioMale");
  let GenderFemale = document.getElementById("RadioFemale");
  let GenderOther = document.getElementById("RadioOther");

  if (GenderMale.checked || GenderFemale.checked || GenderOther.checked) {
    f = true;
    document.getElementById("GenderError").innerHTML = "";
  } else {
    document.getElementById("GenderError").innerHTML =
      "Select any one of these";
  }
}

function validationForm() {
  verifyUsername();
  verifyPhonenumber();
  verifyEmail();
  verifyPassword();
  verifyConfirmPassword();
  verifyGender();
  if (
    a == true &&
    b == true &&
    c == true &&
    d == true &&
    e == true &&
    f == true
  ) {
    Swal.fire({
      title: "Good job!",
      text: "Your registration completed!",
      icon: "success",
    });
  } else {
    Swal.fire({
      title: "Error!",
      text: "enter all fields!",
      icon: "Error",
    });
  }
}
