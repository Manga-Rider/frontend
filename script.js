document.addEventListener('DOMContentLoaded', function () {
    const mangaContainer = document.getElementById('manga-container'); // Контейнер для манги
    const loadMoreButton = document.getElementById('load-more'); // Кнопка "Загрузить еще"
    const searchInput = document.getElementById('search-manga'); // Поле поиска
    const sortFavoritesButton = document.getElementById('sort-favorites'); // Кнопка "Избранное"
    const sortAlphabeticallyButton = document.getElementById('sort-alphabetically'); // Кнопка "По алфавиту"
    const resetSortingButton = document.getElementById('reset-sorting'); // Кнопка "Сбросить"
    
    let currentIndex = 0; 
    const loadBatchSize = 3; 

    fetch('http://localhost:5000/mangas')
        .then(response => response.json()) 
        .then(mangaData => {
            const originalMangaData = [...mangaData];
            let displayedMangaData = [...originalMangaData];

            function loadManga(mangas) {
                mangas.forEach(manga => {
                    const mangaElement = document.createElement('div');
                    mangaElement.className = 'manga-item';
                    mangaElement.innerHTML = `
                        <img src="${manga.cover}" alt="${manga.title}">
                        <h3>${manga.title}</h3>
                        <p>Authors: ${manga.authors.join(', ')}</p>
                    `;

                    mangaElement.addEventListener('click', function () {
                        const mangaId = manga.id;
                        window.open(`manga-details.html?id=${mangaId}`, '_blank'); 
                    });

                    mangaContainer.appendChild(mangaElement);
                });
            }

            loadManga(displayedMangaData.slice(currentIndex, currentIndex + loadBatchSize));
            loadMoreButton.addEventListener('click', function () {
                currentIndex += loadBatchSize; 
                if (currentIndex < displayedMangaData.length) {
                    loadManga(displayedMangaData.slice(currentIndex, currentIndex + loadBatchSize)); 
                }
            });

            sortFavoritesButton.addEventListener('click', function () {
                const token = localStorage.getItem('jwt');
                if (!token) {
                    alert("Please log in to view your favorites.");
                    return;
                }

                fetch('http://localhost:5000/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => response.json())
                .then(data => {
                    const favoriteMangas = data.favoriteMangas || [];
                    const filteredMangas = displayedMangaData.filter(manga => 
                        favoriteMangas.includes(manga.id)
                    );

                    if (filteredMangas.length === 0) {
                        alert("No manga in favorites.");
                        return;
                    }

                    mangaContainer.innerHTML = ""; 
                    loadManga(filteredMangas); 
                    resetSortingButton.disabled = false; 
                })
                .catch(() => {
                    alert("Server error.");
                });
            });
           
            sortAlphabeticallyButton.addEventListener('click', function () {
                displayedMangaData.sort((a, b) => 
                    a.title.localeCompare(b.title)
                );                
                currentIndex = 0; 
                mangaContainer.innerHTML = ""; 
                loadManga(displayedMangaData.slice(currentIndex, loadBatchSize)); 
                loadMoreButton.style.display = 'block'; 
                resetSortingButton.disabled = false;
            });

            resetSortingButton.addEventListener('click', function () {
                displayedMangaData = [...originalMangaData];
                currentIndex = 0;
                mangaContainer.innerHTML = "";
                loadManga(displayedMangaData.slice(currentIndex, loadBatchSize)); 
                loadMoreButton.style.display = 'block'; 
                resetSortingButton.disabled = true; 
            });

            searchInput.addEventListener('input', function () {
                const searchQuery = this.value.toLowerCase(); 

                if (searchQuery === "") {
                    mangaContainer.innerHTML = "";
                    loadManga(originalMangaData.slice(0, 3)); 
                    resetSortingButton.disabled = true; 
                } else {
                    const filteredMangas = mangaData.filter(manga =>{
                        const titleMatches = manga.title.toLowerCase().includes(searchQuery);
                        const authorsString = Array.isArray(manga.authors)
                        ? manga.authors.join(' ')  
                        : '';     
                        const authorsMatches = authorsString.toLowerCase().includes(searchQuery);
                        return titleMatches || authorsMatches; 
                });
                    mangaContainer.innerHTML = ""; 
                    console.log("filteredMangas" + filteredMangas);
                    loadManga(filteredMangas);
                }
            });
        })
        .catch(error => {
            console.error("Error loading manga:", error);
        });
});
