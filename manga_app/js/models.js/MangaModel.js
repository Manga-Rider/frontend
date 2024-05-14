class MangaModel {
    static getMangaList(authorId) {
        const authToken = UserModel.getAuthToken();
        return fetch(`http://18.199.96.125:8080/api/v1/mangas/authors/${authorId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching manga list');
            }
            return response.json();
        });
    }

    static uploadCoverImage(mangaId, formData) {
        const authToken = UserModel.getAuthToken();
        return fetch(`http://18.199.96.125:8080/api/v1/mangas/${mangaId}/coverImage`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error uploading manga cover image');
            }
            return response.json();
        });
    }

    static updateManga(data, mangaId) {
        const authToken = UserModel.getAuthToken();
        return fetch(`http://18.199.96.125:8080/api/v1/mangas/${mangaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error updating manga');
            }
            return response.json();
        });
    }

    static getMangaDetails(mangaId) {
        const authToken = UserModel.getAuthToken();
        return fetch(`http://18.199.96.125:8080/api/v1/mangas/${mangaId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching manga data');
            }
            return response.json();
        });
    }
}
