let uploadedImages = []; 

document.getElementById('updateCoverForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const mangaId = getMangaIdFromQuery(); 
    const authToken = localStorage.getItem("authToken");
    const coverImageFile = document.getElementById('coverImageFile').files[0];

    const formData = new FormData();
    formData.append('file', coverImageFile);

    fetch(`http://18.199.96.125:8080/api/v1/mangas/${mangaId}/coverImage`, {
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
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json(); 
    } else {
        return {}; 
    }   
    })
    .then(data => {
        console.log('Manga cover image successfully uploaded:', data);        
    })
    .catch(error => {
        console.error('Error:', error);
    });

});

const formDataImages = new FormData();

document.getElementById('updateImagesForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const mangaId = getMangaIdFromQuery(); 
    const authToken = localStorage.getItem("authToken");

    const formData = new FormData(); 
    uploadedImages.forEach(file => {
        formData.append('files', file);
    });

    fetch(`http://18.199.96.125:8080/api/v1/mangas/${mangaId}/image`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${authToken}`
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error uploading manga image');
        }
        const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
            return response.json(); 
        } else {
            return {}; 
        }   
    })
    .then(data => {
        console.log('Manga image successfully uploaded:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function getMangaIdFromQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

const uploadedImagesList = document.getElementById('uploadedImagesList');

document.getElementById('mangaImageFiles').addEventListener('change', function(event) {
    const selectedFile = event.target.files[0]; 

    uploadedImagesList.innerHTML = ''; 

    if (selectedFile) {
        uploadedImages.push(selectedFile);
        uploadedImages.forEach(file => {
            const imageElement = document.createElement('img');
            imageElement.src = URL.createObjectURL(file); 
            uploadedImagesList.appendChild(imageElement);
        });
    } else {
        uploadedImagesList.textContent = 'No images selected'; 
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const mangaId = getMangaIdFromQuery(); 
    const authToken = localStorage.getItem("authToken"); 

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

function displayMangaInfo(mangaData) {

    const mangaDescription = document.getElementById('mangaDescription');
    const mangaPreviewImage = document.getElementById('mangaPreviewImage');
    const mangaImagesContainer = document.getElementById('mangaImagesContainer');
    const mangaAuthor = document.getElementById('mangaAuthor');
    const mangaStatus = document.getElementById('mangaStatus');
    const mangaPublishedAt = document.getElementById('mangaPublishedAt');
    const titleElement = document.getElementById('mangaTitle');

    titleElement.textContent = mangaData.title;
    mangaDescription.textContent = mangaData.description;
    mangaAuthor.textContent = mangaData.author;
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

