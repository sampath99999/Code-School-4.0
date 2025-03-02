const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

form.addEventListener('submit', e => {
    e.preventDefault();
    
    if(validateInputs()){
        Swal.fire({
            title: "Drag me!",
            icon: "success",
            draggable: true
          });
    }else{
    Swal.fire({
        title: "Error",
        icon: "error",
        draggable: true
      })};
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const validateInputs = () => {
    let isValid = false;

    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();

    if(usernameValue === '') {
        setError(username, 'Username is required');
        isValid=false;
    } else {
        setSuccess(username);
        isValid=true;
    }

    if(emailValue === '') {
        setError(email, 'Email is required');
        isValid=false;
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
        isValid=false;
    } else {
        setSuccess(email);
        isValid=true;
    }

    if(passwordValue === '') {
        setError(password, 'Password is required');
        isValid=false;
    } else if (passwordValue.length < 8 ) {
        setError(password, 'Password must be at least 8 character.');
        isValid=false;
    } else {
        setSuccess(password);
        isValid=true;
    }

    if(password2Value === '') {
        setError(password2, 'Please confirm your password');
        isValid=false;
    } else if (password2Value !== passwordValue) {
        setError(password2, "Passwords doesn't match");
        isValid=false;
    } else {
        setSuccess(password2);
        isValid=true;
    }
    return isValid;

};



