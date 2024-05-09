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

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = manga.description;
            mangaDetailsSection.appendChild(descriptionElement);

            const imagesContainer = document.createElement('div');
            imagesContainer.className = 'manga-images';

            const coverImage = document.createElement('img');
            coverImage.src = manga.cover_image;
            coverImage.alt = manga.title;
            imagesContainer.appendChild(coverImage);

            mangaDetailsSection.appendChild(titleElement);
            mangaDetailsSection.appendChild(imagesContainer);
            mangaDetailsSection.appendChild(descriptionElement);

            const chaptersContainer = document.createElement('div');
            chaptersContainer.className = 'manga-chapters';

            if (manga.chapters && manga.chapters.length > 0) {
                manga.chapters.forEach((chapter, index) => {
                    const chapterLink = document.createElement('a');
                    chapterLink.href = `chapter.html?id=${mangaId}&chapter=${index + 1}`;
                    chapterLink.textContent = chapter.title || `Chapter ${index + 1}`;
                    chaptersContainer.appendChild(chapterLink);
                    chaptersContainer.appendChild(document.createElement('br'));
                });
            } else {
                chaptersContainer.textContent = 'No chapters found';
            }

            mangaDetailsSection.appendChild(chaptersContainer);

            const authorsElement = document.createElement('div');
            authorsElement.className = 'manga-authors';
            authorsElement.textContent = `Authors: ${manga.authors.join(', ')}`;
            mangaDetailsSection.appendChild(authorsElement);

            const commentsSection = document.createElement('div');
            commentsSection.className = 'manga-comments';
            commentsSection.textContent = 'Comments section';
            mangaDetailsSection.appendChild(commentsSection);

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
                        alert("Server error.");
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
                        alert("Server error.");
                    });
                });

            })
            .catch(() => {
                console.error("Error retrieving user data.");
            });
        })
        .catch(error => {
            console.error("Error loading manga:", error);
        });
});
