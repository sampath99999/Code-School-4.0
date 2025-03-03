const form = document.getElementById("signup-form");
const username = document.getElementById("fullname");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("confirm-password");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (validateInputs()) {
    Swal.fire({
      title: " YO Successfull!",
      icon: "success",
      draggable: true,
    });
    form.submit();
  }
});

const setError = (element, message) => {
  const errorDisplay = element.nextElementSibling;
  errorDisplay.innerText = message;
  element.classList.add("error-border");
  element.classList.remove("success-border");
};

const setSuccess = (element) => {
  const errorDisplay = element.nextElementSibling;
  errorDisplay.innerText = "";
  element.classList.add("success-border");
  element.classList.remove("error-border");
};

const isValidUsername = (username) => {
  const re = /^[A-Za-z\s]{3,30}$/;
  return re.test(username);
};

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
};

const isValidPhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

const isValidDob = (dob) => {
  const inputDate = new Date(dob);
  const today = new Date();

  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 18);

  if (inputDate > today) {
    return "date cannot be in future";
  }
  if (inputDate > minDate) {
    return "you must be atleast 18yrs old";
  }
  return null;
};

const isValidPassword = (password) => {
  return password.length >= 8;
};

const validateInputs = () => {
  let isValid = true;

  const usernameValue = username.value.trim();
  const phoneValue = phone.value.trim();
  const emailValue = email.value.trim();
  const dobValue = dob.value.trim();
  const passwordValue = password.value.trim();
  const password2Value = password2.value.trim();

  if (usernameValue === "") {
    setError(username, "Username is required");
  } else if (!isValidUsername(usernameValue)) {
    setError(
      username,
      "Username must contain only letters and spaces (3-30 chars)"
    );
  } else {
    setSuccess(username);
  }

  if (phoneValue === "") {
    setError(phone, "Phone Number is required");
    isValid = false;
  } else if (!isValidPhone(phoneValue)) {
    setError(phone, "Enter a valid 10-digit phone number");
    isValid = false;
  } else {
    setSuccess(phone);
  }

  if (dobValue === "") {
    setError(dob, "Date of Birth is required");
    isValid = false;
  } else {
    const dobError = isValidDob(dobValue);
    if (dobError) {
      setError(dob, dobError);
    } else {
      setSuccess(dob);
    }
  }

  if (emailValue === "") {
    setError(email, "Email is required");
    isValid = false;
  } else if (!isValidEmail(emailValue)) {
    setError(email, "Provide a valid email address");
    isValid = false;
  } else {
    setSuccess(email);
  }

  if (passwordValue === "") {
    setError(password, "Password is required");
    isValid = false;
  } else if (!isValidPassword(passwordValue)) {
    setError(password, "Password must be at least 8 characters");
    isValid = false;
  } else {
    setSuccess(password);
  }

  if (password2Value === "") {
    setError(password2, "Please confirm your password");
    isValid = false;
  } else if (password2Value !== passwordValue) {
    setError(password2, "Passwords don't match");
    isValid = false;
  } else {
    setSuccess(password2);
  }

  return isValid;
};

username.addEventListener("input", () => {
  const usernameValue = username.value.trim();
  if (usernameValue === "") {
    setError(username, "Username is invalid");
  } else if (!isValidUsername(usernameValue)) {
    setError(username, "Username must contian atleast 3 letter");
  } else {
    setSuccess(username);
  }
});

phone.addEventListener("input", () => {
  const phoneValue = phone.value.trim();
  if (phoneValue === "") {
    setError(phone, "Number is invalid");
  } else if (!isValidPhone(phoneValue)) {
    setError(phone, "must contain only number");
  } else {
    setSuccess(phone);
  }
});

dob.addEventListener("input", () => {
  const dobValue = dob.value.trim();
  if (dobValue === "") {
    setError(dob, "age is invalid");
  } else if (isValidDob(dobValue)) {
    set(dob, "age should be at least 18yr");
  } else {
    setSuccess(dob);
  }
});

email.addEventListener("input", () => {
  const emailValue = email.value.trim();
  if (emailValue === "") {
    setError(email, "enter email");
  } else if (!isValidEmail(emailValue)) {
    setError(email, "enter correct email");
  } else {
    setSuccess(email);
  }
});

password.addEventListener("input", () => {
  const passwordValue = password.value.trim();
  if (passwordValue === "") {
    setError(password, "enter password");
  } else if (!isValidPassword(passwordValue)) {
    setError(password, "create correct password");
  } else {
    setSuccess(password);
  }
});
