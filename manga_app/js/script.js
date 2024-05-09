document.addEventListener('DOMContentLoaded', function () {
    const mangaContainer = document.getElementById('manga-container'); // Контейнер для манги
    const searchInput = document.getElementById('search-manga'); // Поле поиска
    const paginationContainer = document.getElementById('pagination-container'); // Контейнер для пагинации
    const sortFavoritesButton = document.getElementById('sort-favorites'); // Кнопка "Избранное"
    const sortAlphabeticallyButton = document.getElementById('sort-alphabetically'); // Кнопка "По алфавиту"
    const resetSortingButton = document.getElementById('reset-sorting'); // Кнопка "Сбросить"
    
    const mangaPerPage = 9;
    let currentPage = 1; 
    let displayedMangaData = []; 
    let originalMangaData = []; 

    function loadManga(page) {
        mangaContainer.innerHTML = ""; 
        const start = (page - 1) * mangaPerPage;
        const end = start + mangaPerPage;

        const mangaToShow = displayedMangaData.slice(start, end);

        mangaToShow.forEach(manga => {
            const mangaElement = document.createElement('div');
            mangaElement.className = 'manga-item';
            mangaElement.innerHTML = `
                <img src="${manga.cover}" alt="${manga.title}">
                <p>${manga.title}</p>
            `;

            mangaElement.addEventListener('click', function () {
                const mangaId = manga.id;
                window.open(`manga-details.html?id=${mangaId}`, '_blank');
            });

            mangaContainer.appendChild(mangaElement);
        });

        updatePagination();
    }

    function updatePagination() {
        paginationContainer.innerHTML = "";

        const totalPages = Math.ceil(displayedMangaData.length / mangaPerPage);

        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.innerText = '<';
            prevButton.addEventListener('click', function () {
                currentPage -= 1;
                loadManga(currentPage);
            });
            paginationContainer.appendChild(prevButton);
        }

        if (currentPage > 3) {
            const firstPageButton = document.createElement('button');
            firstPageButton.innerText = '1';
            firstPageButton.addEventListener('click', function () {
                currentPage = 1;
                loadManga(currentPage);
            });
            paginationContainer.appendChild(firstPageButton);
        }

        if (currentPage > 3) {
            const ellipsis = document.createElement('span');
            ellipsis.innerText = '...';
            paginationContainer.appendChild(ellipsis);
        }

        if (currentPage > 1) {
            const prevPageButton = document.createElement('button');
            prevPageButton.innerText = currentPage - 1;
            prevPageButton.addEventListener('click', function () {
                currentPage -= 1;
                loadManga(currentPage);
            });
            paginationContainer.appendChild(prevPageButton);
        }

        const currentPageButton = document.createElement('button');
        currentPageButton.innerText = currentPage;
        currentPageButton.classList.add('active'); 
        paginationContainer.appendChild(currentPageButton);

        if (currentPage < totalPages - 1) {
            const nextPageButton = document.createElement('button');
            nextPageButton.innerText = currentPage + 1;
            nextPageButton.addEventListener('click', function () {
                currentPage += 1;
                loadManga(currentPage);
            });
            paginationContainer.appendChild(nextPageButton);
        }

        if (currentPage < totalPages - 2) {
            const ellipsis = document.createElement('span');
            ellipsis.innerText = '...';
            paginationContainer.appendChild(ellipsis);
        }

        if (totalPages > 1 && currentPage < totalPages) {
            const lastPageButton = document.createElement('button');
            lastPageButton.innerText = totalPages;
            lastPageButton.addEventListener('click', function () {
                currentPage = totalPages;
                loadManga(currentPage); 
            });
            paginationContainer.appendChild(lastPageButton);
        }

        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.innerText = '>';
            nextButton.addEventListener('click', function () {
                currentPage += 1;
                loadManga(currentPage);
            });
            paginationContainer.appendChild(nextButton);
        }
    }

    function resetData() {
        currentPage = 1;
        loadManga(currentPage); 
    }

    fetch('http://localhost:5000/mangas')
    .then(response => response.json())
    .then(data => {
        originalMangaData = [...data]; 
        displayedMangaData = [...originalMangaData]; 

        resetData(); 

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

                    displayedMangaData = filteredMangas; 
                    resetData(); 
                    resetSortingButton.disabled = false; 
                })
                .catch(() => {
                    alert("Server error.");
                });
            });        
            
            sortAlphabeticallyButton.addEventListener('click', function () {
                displayedMangaData.sort((a, b) => a.title.localeCompare(b.title)); 
                resetData(); 
                resetSortingButton.disabled = false; 
            });

            resetSortingButton.addEventListener('click', function () {
                displayedMangaData = [...originalMangaData]; 
                resetData(); 
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

            searchInput.addEventListener('input', function () {
                const searchQuery = this.value.toLowerCase(); 

                if (searchQuery === "") {
                    displayedMangaData = [...originalMangaData];
                } else {
                    displayedMangaData = originalMangaData.filter(manga => 
                        manga.title.toLowerCase().includes(searchQuery) || manga.author.toLowerCase().includes(searchQuery)
                    );
                }

                resetData(); 
            });
        })
        .catch(error => {
            console.error("Error loading manga:", error);
        });
});