document.addEventListener('DOMContentLoaded', function () {
    const profileInfoSection = document.getElementById('profile-info'); 
    const registrationLoginSection = document.getElementById('registration-login'); 

    const token = localStorage.getItem('jwt');
    let currentUser = null;

    if (token) {
        fetch('http://localhost:5000/verify', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.username) {
                currentUser = data;
                showProfile(currentUser);
            } else {
                localStorage.removeItem('jwt');
                registrationLoginSection.style.display = 'block';
            }
        })
        .catch(() => {
            localStorage.removeItem('jwt');
            registrationLoginSection.style.display = 'block';
        });
    } else {
        registrationLoginSection.style.display = 'block';
    }

    function showProfile(user) {
        profileInfoSection.innerHTML = `
            <h2>Welcome back, ${user.name}!</h2>
            <p>Login: ${user.username}</p>
            <button id="logout">Exit</button>
        `;

        const logoutButton = document.getElementById('logout');
        logoutButton.addEventListener('click', function () {
            localStorage.removeItem('jwt');
            location.reload();
        });

        registrationLoginSection.style.display = 'none';
    }

    const registrationForm = document.getElementById('registration-form');
    registrationForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('reg-name').value;
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;

        fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, username, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('jwt', data.token);
                showProfile({ name, username });
            } else {
                alert("Registration error.");
            }
        })
        .catch(() => {
            alert("Server error.");
        });
    });

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('jwt', data.token);
                showProfile({ username });
            } else {
                alert("Incorrect login or password.");
            }
        })
        .catch(() => {
            alert("Server error");
        });
    });
});
