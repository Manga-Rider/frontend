class ProfileModel {
    static fetchUserData() {
        const authToken = UserModel.getAuthToken();
        return fetch('http://18.199.96.125:8080/api/v1/users/personal/account', {
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
        });
    }

    static updateProfile(data) {
        const authToken = UserModel.getAuthToken();
        return fetch('http://18.199.96.125:8080/api/v1/users/personal/account', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) 
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error updating profile data");
            }
        });
    }

    static uploadAvatar(formData) {
        const authToken = UserModel.getAuthToken();
        return fetch('http://18.199.96.125:8080/api/v1/users/personal/account/images', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Error uploading avatar");
            }
        });
    }
}
