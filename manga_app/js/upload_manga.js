document.getElementById('uploadMangaForm').addEventListener('submit', function(event) {
    const authToken = localStorage.getItem("authToken");

    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    const mangaData = {
        title: title,
        description: description
    };

    fetch('http://18.199.96.125:8080/api/v1/mangas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(mangaData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error uploading manga');
        }
        return response.json();
    })
    .then(data => {
        console.log('Manga successfully uploaded:', data);        
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
