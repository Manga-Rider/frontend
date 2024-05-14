class UploadMangaModel {
    static uploadManga(data) {
        const authToken = localStorage.getItem("authToken");
        return fetch('http://18.199.96.125:8080/api/v1/mangas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error uploading manga');
            }
            return response.json();
        });
    }
}
