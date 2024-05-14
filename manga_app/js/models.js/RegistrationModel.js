class RegistrationModel {
    static registerUser(data) {
        return fetch("http://18.199.96.125:8080/api/v1/users/registration", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 409) {
                    throw new Error('User already exists');
                } else {
                    throw new Error("An error occurred during registration. Please try again.");
                }
            });
    }
}
