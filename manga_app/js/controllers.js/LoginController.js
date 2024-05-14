class LoginController {
    static handleLogin(event) {
        event.preventDefault(); 

        const form = document.getElementById("loginForm");
        const formData = new FormData(form);
        const data = {
            email: formData.get("email"),
            password: formData.get("password")
        };

        UserModel.login(data)
            .then(user => {
                localStorage.setItem("authToken", user.token); 
                window.location.href = "profile.html"; 
            })
            .catch(error => {
                console.error("Authorization error:", error);
                alert("An error occurred during authorization. Please try again.");
            });
    }

    static checkAuthAndRedirect() {
        const authToken = UserModel.getAuthToken();
        if (!authToken) {
            View.showLoginForm();
        } else {
            window.location.href = "profile.html";
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    LoginController.checkAuthAndRedirect();

    document.getElementById("loginForm").onsubmit = LoginController.handleLogin; 
});
