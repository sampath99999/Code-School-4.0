(() => {
    'use strict';

    const form = document.querySelector('.validate');

    const validateField = (field, regex) => {
        if (!regex.test(field.value)) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
    };

    form.addEventListener('input', event => {
        const fullName = document.getElementById('fullName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const dateOfBirth = document.getElementById('dateOfBirth');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const genderRadios = document.querySelectorAll('input[name="gender"]');

        const nameRegex = /^[A-Za-z.\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6789]\d{9}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (event.target === fullName) validateField(fullName, nameRegex);
        if (event.target === email) validateField(email, emailRegex);
        if (event.target === phone) validateField(phone, phoneRegex);
        if (event.target === password) validateField(password, passwordRegex);

        if (event.target === confirmPassword) {
            if (confirmPassword.value !== password.value || confirmPassword.value === '') {
                confirmPassword.classList.add('is-invalid');
                confirmPassword.classList.remove('is-valid');
            } else {
                confirmPassword.classList.remove('is-invalid');
                confirmPassword.classList.add('is-valid');
            }
        }

        if (event.target === dateOfBirth) {
            const dob = new Date(dateOfBirth.value);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            if (age < 18 || age > 60 || isNaN(age)) {
                dateOfBirth.classList.add('is-invalid');
                dateOfBirth.classList.remove('is-valid');
            } else {
                dateOfBirth.classList.remove('is-invalid');
                dateOfBirth.classList.add('is-valid');
            }
        }

        let genderSelected = false;
        genderRadios.forEach(radio => {
            if (radio.checked) genderSelected = true;
        });

        if (!genderSelected) {
            genderSelected = false;
            genderRadios[0].parentNode.classList.add('is-invalid');
            document.getElementById('Male').classList.add("is-invalid");
            document.getElementById('Female').classList.add("is-invalid");

        } else {
            genderRadios[0].parentNode.classList.remove('is-invalid');
            document.getElementById('Male').classList.remove("is-invalid");
            document.getElementById('Female').classList.remove("is-invalid");
            genderSelected = true;
        }

        form.classList.remove('was-validated');
    });

    form.addEventListener('submit', event => {
        let isValid = form.checkValidity();

        const genderRadios = document.querySelectorAll('input[name="gender"]');
        let genderSelected = false;
        genderRadios.forEach(radio => {
            if (radio.checked) genderSelected = true;
        });

        if (!genderSelected) {
            isValid = false;
            genderRadios[0].parentNode.classList.add('is-invalid');
        } else {
            genderRadios[0].parentNode.classList.remove('is-invalid');
        }

        if (!isValid) {
            event.preventDefault();
            event.stopPropagation();
            Swal.fire({
                title: "Error !",
                text: "Please fill the correct details!",
                icon: "error"
            });
        } else {
            event.preventDefault();
            Swal.fire({
                title: "Good job!",
                text: "You have successfully registered!",
                icon: "success"
            }).then(() => {
                form.reset();
                form.classList.remove('was-validated');
                document.querySelectorAll('.is-valid, .is-invalid').forEach(field => field.classList.remove('is-valid', 'is-invalid'));
            });
        }

        form.classList.add('was-validated');
    }, false);
})();
