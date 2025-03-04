

let isName, isMail, isNumber, isPass, isSamePass, isSelect

function verifyName() {
    let name = document.getElementById('name').value
    let errMessage = document.getElementById('errName')
    errMessage.style.color = 'tomato'
    if (name === null) {
        errMessage.innerHTML = 'Don\'t enter null value'
    }
    else if (name.length < 6) {
        errMessage.innerHTML = 'Please enter minimum 6 characters'
    }
    else if (name.length > 30) {
        errMessage.innerHTML = 'You\'ve entered out of maximum range'
    }
    else {
        errMessage.innerHTML = ''
        isName = true
    }
}

function verifyMail() {
    let mail = document.getElementById('email').value
    let errMessage = document.getElementById('errMail')
    errMessage.style.color = 'tomato'
    if (!mail.includes('@gmail.com') || mail.indexOf('@gmail.com') < 3) {
        errMessage.innerHTML = 'Please enter valid email'
    }
    else {
        errMessage.innerHTML = ''
        isMail = true
    }
}

function verifyNumber() {
    let number = document.getElementById('number').value
    let errMessage = document.getElementById('errNumber')
    errMessage.style.color = 'tomato'
    if (number.length < 10 || number.length > 10) {
        errMessage.innerHTML = 'Please enter valid number'
    }
    else if (number.length == 10) {
        errMessage.innerHTML = ''
        isNumber = true
    }
}

function verifyPassword() {
    let pass = document.getElementById('password').value
    let errMessage = document.getElementById('errPass')
    errMessage.style.color = 'tomato'
    if (pass.length < 6) {
        errMessage.innerHTML = 'Please create minimum 6 characters'
    }
    else {
        errMessage.innerHTML = ''
        isPass = true
    }
}

function samePassword() {
    let pass = document.getElementById('password').value
    let cpass = document.getElementById('cpassword').value
    let errMessage = document.getElementById('errCPass')
    errMessage.style.color = 'tomato'
    if (pass !== cpass) {
        errMessage.innerHTML = 'Please enter password as entered above'
    }
    else {
        errMessage.innerHTML = ''
        isSamePass = true
    }
}

function selectGender() {

    if (document.getElementById('male').checked) {
        isSelect = true
    }
    else if (document.getElementById('female').checked) {
        isSelect = true
    }
    else {
        isSelect = false
    }
}


document.getElementById("form").addEventListener("click", event => {
    event.preventDefault()

    if (isName && isMail && isNumber && isPass && isSamePass && isSelect) {
        Swal.fire({
            title: "Good job!",
            text: "Registered successfully!",
            icon: "success"
        });
    }
    else {
        Swal.fire({
            title: "Data Insufficient",
            text: "Something got missed!",
            icon: "error"
        });
    }
})

// $(document).ready(function () {
//     $('#form').click(function () {
//         validateForm()
//     })
// })

// function validateForm() {
//     let isValid = true
//     for (field of formFields) {
//         isValid = validateFormField(field) && isValid
//     }
//     alert(isValid)
//     if (isValid) alert('Success')
// }


// function validateFormField(field) {
//     let value = $(`#${field.id}`).val()
//     let errorElement = $(`#${field.id}+'Error'`)
//     errorElement.text('')
//     for (let rule of field.rules) {
//         if (rule == 'required') {
//             if (!value || value.length == 0) {
//                 errorElement.text(`${field.label}` + " is required");
//                 return false;
//             }
//             if (rule.includes("min")) {
//                 let splittedRule = rule.split(":");
//                 let minLength = splittedRule[1];
//                 if (value.length < minLength) {
//                     errorElement.innerHTML = field.label + " should be atleast 3 characters";
//                     return false;
//                 }
//             }
//             if (rule == 'phoneNumber') {
//                 if (value.length != 10) {
//                     errorElement.innerHTML = field.label + " should be 10 digit number";
//                     return false;
//                 }
//                 else if (value.length == 10) {
//                     return true;
//                 }
//             }


//         }
//     }

// }

// let formFields = [
//     {
//         id: "name",
//         label: "Full Name",
//         rules: ["required", "min:3", "max:25"],
//     },
//     {
//         id: "phoneNumber",
//         label: "phoneNumber",
//         rules: ["required", "phoneNumber"],
//     },
//     {
//         id: "email",
//         label: "Email",
//         rules: ["required", "@"]
//     },
//     {
//         id: "password",
//         label: "Password",
//         rules: ["required", "@-_#"]
//     }
// ];
