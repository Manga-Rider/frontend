document.addEventListener('DOMContentLoaded', function () {
    const mangaDetailsSection = document.getElementById('manga-details');
    const addToFavoritesButton = document.getElementById('add-to-favorites'); 
    const removeFromFavoritesButton = document.getElementById('remove-from-favorites'); 

    const urlParams = new URLSearchParams(window.location.search);
    const mangaId = parseInt(urlParams.get('id'), 10);

    fetch('http://localhost:5000/mangas')
        .then(response => response.json())
        .then(mangaData => {
            const manga = mangaData.find(m => m.id === mangaId);

            if (!manga) {
                console.error("Manga not found.");
                return;
            }

            const titleElement = document.createElement('h1');
            titleElement.textContent = manga.title;            
            
            const imagesContainer = document.createElement('div');
            imagesContainer.className = 'manga-images';

            const coverImage = document.createElement('img');
            coverImage.src = manga.cover; 
            coverImage.alt = manga.title;
            imagesContainer.appendChild(coverImage)

            manga.images.forEach((image) => {
              const imageElement = document.createElement('img');
              imageElement.src = image; 
              imagesContainer.appendChild(imageElement);
            });

            const authorsElement = document.createElement('div');
            authorsElement.className = 'manga-authors'; 
            authorsElement.textContent = `Авторы: ${manga.authors.join(', ')}`;

            mangaDetailsSection.appendChild(titleElement)
            mangaDetailsSection.appendChild(imagesContainer);
            mangaDetailsSection.appendChild(authorsElement);

            const token = localStorage.getItem('jwt');
            if (!token) {
                addToFavoritesButton.style.display = 'none';
                removeFromFavoritesButton.style.display = 'none';
                return;
            }

            fetch('http://localhost:5000/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                const isFavorite = data.favoriteMangas?.includes(mangaId);

                if (isFavorite) {
                    addToFavoritesButton.style.display = 'none'; 
                    removeFromFavoritesButton.style.display = 'block'; 
                } else {
                    addToFavoritesButton.style.display = 'block'; 
                    removeFromFavoritesButton.style.display = 'none'; 
                }

                addToFavoritesButton.addEventListener('click', function () {
                    fetch('http://localhost:5000/favorites/add', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ mangaId })
                    })
                    .then(res => res.json())
                    .then(data => {
                        alert(data.message);
                        addToFavoritesButton.style.display = 'none'; 
                        removeFromFavoritesButton.style.display = 'block';
                    })
                    .catch(() => {
                        alert("Ошибка сервера.");
                    });
                });

                removeFromFavoritesButton.addEventListener('click', function () {
                    fetch('http://localhost:5000/favorites/remove', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ mangaId })
                    })
                    .then(res => res.json())
                    .then(data => {
                        alert(data.message);
                        removeFromFavoritesButton.style.display = 'none'; 
                        addToFavoritesButton.style.display = 'block';
                    })
                    .catch(() => {
                        alert("Ошибка сервера.");
                    });
                });

            })
            .catch(() => {
                console.error("Ошибка получения данных пользователя.");
            });
        })
        .catch(error => {
            console.error("Ошибка загрузки манги:", error);
        });
});
