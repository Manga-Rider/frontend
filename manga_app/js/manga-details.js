const authToken = localStorage.getItem("authToken"); 
function getMangaIdFromQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

document.addEventListener("DOMContentLoaded", function() {
    const mangaId = getMangaIdFromQuery(); 

    fetch(`http://18.199.96.125:8080/api/v1/mangas/${mangaId}`, {
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
    })
    .then(data => {
        displayMangaInfo(data); 
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function fetchAuthorInfo(authorId) {
    fetch(`http://18.199.96.125:8080/api/v1/users/${authorId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error fetching author info');
        }
        return response.json();
    })
    .then(data => {
        displayAuthorInfo(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayMangaInfo(mangaData) {
    const mangaTitle = document.getElementById('mangaTitle');
    const mangaDescription = document.getElementById('mangaDescription');
    const mangaPreviewImage = document.getElementById('mangaPreviewImage');
    const mangaImagesContainer = document.getElementById('mangaImagesContainer');
    const mangaStatus = document.getElementById('mangaStatus');
    const mangaPublishedAt = document.getElementById('mangaPublishedAt');

    fetchAuthorInfo(mangaData.author)

    mangaTitle.textContent = mangaData.title;
    mangaDescription.textContent = mangaData.description;
    mangaStatus.textContent = mangaData.status;
    mangaPublishedAt.textContent = new Date(mangaData.publishedAt).toLocaleDateString();

    mangaPreviewImage.src = mangaData.image;
    
    mangaData.images.forEach(imageUrl => {
        const imageElement = document.createElement('img');
        imageElement.src = imageUrl;
        imageElement.alt = "Manga Image";
        mangaImagesContainer.appendChild(imageElement);
    });
}

function displayAuthorInfo(authorData) {
    const mangaAuthorName = document.getElementById('mangaAuthorName');
    const mangaAuthorAvatar = document.getElementById('mangaAuthorAvatar');

    mangaAuthorName.textContent = authorData.username;
    mangaAuthorAvatar.src = authorData.image;
}