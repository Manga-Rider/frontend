class RegistrationController {
    static handleRegistration(event) {
        event.preventDefault();

        const form = document.getElementById("registrationForm");
        const formData = new FormData(form);

        const username = formData.get("username");
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");
        const rawBirthdate = formData.get("birthdate");
        const dateParts = rawBirthdate.split('-');
        const formattedBirthdate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

        const data = {
            email: formData.get("email"),
            username: formData.get("username"),
            password: formData.get("password"),
            birthday: formattedBirthdate,
            location: formData.get("country")
        };

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (username.length < 8) {
            alert("Username must be at least 8 characters long.");
            return;
        }

        if (password.length < 8) {
            alert("Password must be at least 8 characters long.");
            return;
        }

        RegistrationModel.registerUser(data)
            .then(() => {
                console.log("Registration successful");
                alert("Registration successful!");
                form.reset();
            })
            .catch((error) => {
                console.error("Registration error", error.message);
                alert(error.message);
            });
    }
}

document.getElementById("registrationForm").onsubmit = RegistrationController.handleRegistration;