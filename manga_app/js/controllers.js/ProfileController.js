class ProfileController {
    static fetchUserDataAndRender() {
        ProfileModel.fetchUserData()
            .then(data => View.renderUserData(data))
            .catch(error => console.error("Error fetching user data:", error));
    }

    static handleProfileUpdate(event) {
        event.preventDefault(); 

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

        ProfileModel.updateProfile(data)
            .then(() => {
                alert("Profile data has been successfully updated!");
                ProfileController.fetchUserDataAndRender();
            })
            .catch(error => {
                console.error("Error updating profile data:", error);
                alert("An error occurred while updating your profile information.");
            });
    }

    static handleAvatarUpload() {
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

        const formData = new FormData();
        formData.append('file', file);

        ProfileModel.uploadAvatar(formData)
            .then(() => {
                alert("The avatar has been successfully uploaded.");
                ProfileController.fetchUserDataAndRender();
            })
            .catch(error => {
                console.error("Error uploading avatar:", error);
                alert("There was an error loading your avatar.");
            });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    ProfileController.fetchUserDataAndRender();

    document.getElementById("editProfileForm").onsubmit = ProfileController.handleProfileUpdate; 
    document.getElementById("uploadAvatarButton").onclick = function() {
        document.getElementById("avatarInput").click();
    };

    document.getElementById("avatarInput").addEventListener("change", ProfileController.handleAvatarUpload);
});