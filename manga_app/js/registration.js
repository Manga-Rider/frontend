function handleRegistration(event) {
    event.preventDefault(); 

    const form = document.getElementById("registrationForm");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    if (data.password !== data.confirmPassword) {
        alert("The password and password confirmation do not match.");
        return false; 
    }

    fetch(`/check-user?email=${data.email}`)
    
    .then(response => response.json())

    .then(result => {
        if (result.exists) {

            document.getElementById("userExists").style.display = "block"; 
        } else {
            return fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('Registration successful!');
                    form.reset(); 
                } else {
                    alert('Error: ' + result.message);
                }
            });
        }
    })

    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while checking if the user exists.');
    });

    return false; 
}
