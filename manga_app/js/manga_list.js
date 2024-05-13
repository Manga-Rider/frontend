document.addEventListener("DOMContentLoaded", function() {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
        window.location.href = "login.html";
        return;
    }

    fetchUserData(authToken);
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
        const authorId = data.userId; 
        console.log("UserId" + data.userId);
        console.log("AuthorId" + authorId);
        fetchMangaList(authorId, authToken); 
    })
    .catch(error => {
        console.error("Error while retrieving user data:", error);
    });
}

function fetchMangaList(authorId, authToken) {
    fetch(`http://18.199.96.125:8080/api/v1/mangas/authors/${authorId}`, {
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
    })
    .then(data => {
        displayMangaList(data); 
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayMangaList(mangaList) {
    const mangaListContainer = document.getElementById('mangaList');

    mangaListContainer.innerHTML = '';

    if (!mangaList.content || !Array.isArray(mangaList.content)) {
        console.error('Error: mangaList.content is not an array:', mangaList);
        return;
    }

    mangaList.content.forEach(manga => {
        const mangaItem = document.createElement('div');
        mangaItem.classList.add('manga-item');
        
        const titleElement = document.createElement('h3');
        titleElement.textContent = manga.title;
        
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = manga.description;

        mangaItem.appendChild(titleElement);
        mangaItem.appendChild(descriptionElement);

        mangaItem.addEventListener('click', function () {
            const mangaId = manga.mangaId;
            window.open(`manga-update.html?id=${mangaId}`, '_blank');
        });

        mangaListContainer.appendChild(mangaItem);
    });
}