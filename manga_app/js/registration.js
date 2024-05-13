document.getElementById("registrationForm").onsubmit = handleRegistration;

function handleRegistration(event) {

    event.preventDefault();

    console.log("Form submission intercepted");

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

    console.log("Form data:", data);

    fetch("http://18.199.96.125:8080/api/v1/users/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (response.ok) {
                console.log("Registration successful");
                alert("Registration successful!");
                form.reset();
            } else if (response.status === 409) {
                document.getElementById("userExists").style.display = "block";
            }
            else {
                console.error("Registration error", response.statusText);
                alert("An error occurred during registration. Please try again.");
            }
        })
        .catch((error) => {
            console.error("Fetch error:", error);
            alert("An unexpected error occurred.");
        });
}