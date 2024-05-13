document.addEventListener("DOMContentLoaded", function() {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
        var element = document.getElementById("loginFormContainer");
        element.style.display = "block";
        document.getElementById("loginForm").onsubmit = handleLogin; 
    } else {
        window.location.href = "profile.html";
    }
});

function handleLogin(event) {
    event.preventDefault(); 

    const form = document.getElementById("loginForm");
    const formData = new FormData(form);
    const data = {
        email: formData.get("email"),
        password: formData.get("password")
    };

    fetch('http://18.199.96.125:8080/api/v1/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Authorisation Error");
        }
    })
    .then(user => {
        localStorage.setItem("authToken", user.token); 
        window.location.href = "profile.html"; 
    })
    .catch(error => {
        console.error("Authorization error:", error);
        alert("An error occurred during authorization. Please try again.");
    });

    return false; 
}
