let uploadedImages = []; 
const authToken = localStorage.getItem("authToken"); 

document.getElementById('updateCoverForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const mangaId = getMangaIdFromQuery(); 
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

document.getElementById('editMangaForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const mangaId = getMangaIdFromQuery();
    const title = document.getElementById('mangaTitle').value;
    const description = document.getElementById('mangaDescription').value;
    const status = document.getElementById('mangaStatus').value;

    const mangaData = {
        title: title,
        description: description,
        status: status
    };

    fetch(`http://18.199.96.125:8080/api/v1/mangas/${mangaId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(mangaData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error updating manga');
        }
        return response.json();
    })
    .then(data => {
        console.log('Manga successfully updated:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

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