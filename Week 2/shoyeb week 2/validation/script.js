document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    function validateField(input, pattern, errorMsg) {
        let value = input.value.trim();
        let errorElement = input.nextElementSibling;

        if (!errorElement || !errorElement.classList.contains("error-message")) {
            errorElement = document.createElement("div");
            errorElement.classList.add("error-message");
            input.parentNode.appendChild(errorElement);
        }

        if (value === "") {
            input.classList.add("is-invalid");
            input.classList.remove("is-valid");
            errorElement.innerText = `❌ ${errorMsg}`;
            errorElement.style.color = "red";
            return false;
        }

        if (pattern && !pattern.test(value)) {
            input.classList.add("is-invalid");
            input.classList.remove("is-valid");
            errorElement.innerText = "❌ Invalid format!";
            errorElement.style.color = "red";
            return false;
        }

        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        errorElement.innerText = "";
        return true;
    }

    document.querySelectorAll("input").forEach((input) => {
        input.addEventListener("input", function () {
            validateInput(input);
        });
    });

    function validateInput(input) {
        const id = input.id;
        let isValid = false;

        if (id === "first_name") {
            isValid = validateField(input, null, "Enter First Name");
        } else if (id === "middle_name") {
            isValid = validateField(input, null, "Enter Middle Name");
        } else if (id === "last_name") {
            isValid = validateField(input, null, "Enter Last Name");
        } else if (id === "email_add") {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = validateField(input, emailPattern, "Enter a valid Email");
        } else if (id === "ph_number") {
            const phonePattern = /^[0-9]{10}$/;
            isValid = validateField(input, phonePattern, "Enter a 10-digit Phone Number");
        } else if (id === "DOB") {
            isValid = validateField(input, null, "Select Date of Birth");
        } else if (id === "password") {
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            isValid = validateField(input, passwordPattern, "Password must have at least 8 characters, including uppercase, lowercase, number, and special character");
        }

        return isValid;
    }

    // Form submission event
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent the default form submission

        let isValidForm = true;
        // Validate each input field
        document.querySelectorAll("input").forEach((input) => {
            if (!validateInput(input)) {
                isValidForm = false;
            }
        });

        // If all fields are valid, show the success message and submit the form
        if (isValidForm) {
            Swal.fire({
                title: "Register Successfully!",
                icon: "success",
                draggable: true,
            }).then(() => {
                form.submit(); // Submit the form after the success alert
            });
        } else {
            Swal.fire({
                title: "Oops, Something went wrong!",
                text: "Enter the fields",
                icon: "error",
                draggable: true,
            });
        }
    });
});
