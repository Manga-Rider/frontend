document.addEventListener("DOMContentLoaded", function() {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
        window.location.href = "login.html";
        return;
    }

    fetchUserData(authToken);

    document.getElementById("editButton").onclick = function() {
        document.getElementById("editModal").style.display = "block"; 
    };

    document.getElementById("closeModal").onclick = function() {
        document.getElementById("editModal").style.display = "none"; 
    };

    document.getElementById("editProfileForm").onsubmit = handleProfileUpdate; 
    document.getElementById("uploadAvatarButton").onclick = function() {
        document.getElementById("avatarInput").click();
    };

    document.getElementById("uploadMangaButton").onclick = function() {
        window.location.href = "upload_manga.html"; 
    };    

    document.getElementById("avatarInput").addEventListener("change", handleAvatarUpload);
});

function fetchUserData(authToken) {
    fetch('http://18.199.96.125:8080/api/v1/users/personal/account', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error while retrieving user data');
        }
    })
    .then(data => {
        document.getElementById("avatar").src = data.image;
        document.getElementById("displayNickname").textContent = data.username;
        document.getElementById("displayCountry").textContent = data.location;
        document.getElementById("displayBirthdate").textContent = data.birthday;
    })
    .catch(error => {
        console.error("Error while retrieving user data:", error);
    });
}

function handleProfileUpdate(event) {
    event.preventDefault(); 

    const authToken = localStorage.getItem("authToken");
    const form = document.getElementById("editProfileForm");
    const formData = new FormData(form);
    const rawBirthdate = formData.get("birthdate"); 
    const dateParts = rawBirthdate.split('-'); 
    const formattedBirthdate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    const data = {};

    if (formData.get("nickname")) {
        data.username = formData.get("nickname");
    }

    if (formData.get("country")) {
        data.location = formData.get("country");
    }

    if (formData.get("birthdate")) {
        data.birthday = formattedBirthdate;
    }

    fetch('http://18.199.96.125:8080/api/v1/users/personal/account', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    })
    .then(response => {
        if (response.ok) {
            alert("Profile data has been successfully updated!");
        } else {
            throw new Error("Error updating profile data");
        }
    })
    .catch(error => {
        console.error("Error updating profile data:", error);
        alert("An error occurred while updating your profile information.");
    });

    document.getElementById("editModal").style.display = "none";
    fetchUserData(authToken);
    return false; 
}

function handleLogout() {
    localStorage.removeItem("authToken"); 
    window.location.href = "login.html"; 
}

function handleAvatarUpload() {
    const fileInput = document.getElementById("avatarInput");
    const file = fileInput.files[0];
    
    if (!file) {
        alert("Choose File.");
        return;
    }

    if (!file.type.match('image/jpeg')) {
        alert("Please select a JPEG file.");
        return;
    }

    const authToken = localStorage.getItem("authToken");

    fetch('http://18.199.96.125:8080/api/v1/users/personal/account', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error while retrieving user data');
        }
    })
    .then(data => {
        if (data.image) {
            alert("You already have an avatar. You cannot download it again.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        fetch('http://18.199.96.125:8080/api/v1/users/personal/account/images', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        })
        .then(response => {
            if (response.ok) {
                alert("The avatar has been successfully uploaded.");
            } else {
                throw new Error("Error loading avatar.");
            }
        })
        .catch(error => {
            console.error("Error loading avatar:", error);
            alert("There was an error loading your avatar.");
        });
    })
    .catch(error => {
        console.error("Error while retrieving user data:", error);
        alert("An error occurred while checking for an avatar.");
    });

    fetchUserData(authToken);
}
