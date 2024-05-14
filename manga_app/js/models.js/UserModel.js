class UserModel {
    static login(data) {
        return fetch('http://18.199.96.125:8080/api/v1/users/login', {
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
                throw new Error("Authorization Error");
            }
        });
    }

    static getAuthToken() {
        return localStorage.getItem("authToken");
    }
}
