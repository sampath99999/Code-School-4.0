
let formFields =[
    {
        id:"name",
        label:"Name",
        rules:["required","min:3","max:12"],
    },
    {
        id:"phoneNumber",
        label:"Phone Number",
        rules:["required","length:10","/^[+]{1}(?:[0-9\-\\(\\)\\/.]\s?){6,15}[0-9]{1}$/"],
    },
    {
        id:"email",
        label:"Email address",
        rules:["required","email","/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/"]
    },
    {
        id:"password",
        label:"Password",
        rules:["required","password","/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/"]
    },
    {
        id:"confirmPassword",
        label:"Confirm Password",
        rules:["required","password","/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/"]
    }
];

function validateFormField(field){
    let value = document.getElementById(field.id).value;
    let errorElement = document.getElementById(field.id + "Error");
    errorElement.innerHTML = "";
    for(let rule of field.rules){
        if(rule === 'required'){
            if(!value || value.length == 0){
                errorElement.innerHTML = field.label + " is required!!";
                return;
            }
        }
        if(rule.includes("min")){
            let splittedRule = rule.split(":");
            let minLength = splittedRule[1];
            if(value.length < minLength){
                errorElement.innerHTML = field.label + " should be at least 3 characters";
                return;
            }
        }
        if (rule === "email") {
            let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(value)) {
                errorElement.innerHTML = "Enter a valid email address.";
                return false;
            }
        }

        if (rule === "password") {
            let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
            if (!passwordRegex.test(value)) {
                errorElement.innerHTML = "Password must be 8-15 characters long, include at least one uppercase, one lowercase letter, one digit, and one special character.";
                return false;
            }
        }

        if (rule.match(/^\/.*\/$/)) {
            let regex = new RegExp(rule.slice(1, -1));
            if (!regex.test(value)) {
                errorElement.innerHTML = `Invalid format for ${field.label}.`;
                return false;
            }
        }
    }
    return true;
}
function validateForm(event) {
    let isValid = true;
    for (let field of formFields) {
        if (!validateFormField(field)) {
            isValid = false;
        }
    }
    return isValid;
}

document.getElementById("myForm").addEventListener("submit", function (event) {
if (!validateForm(event)) {
    event.preventDefault(); 
}
});

