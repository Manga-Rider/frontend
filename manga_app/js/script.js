const mangaGrid = document.getElementById('mangaGrid');
const pagination = document.getElementById('pagination');
const authToken = localStorage.getItem("authToken"); 

let currentPage = 0;

function fetchMangas(page = 0, orderBy = 'DESC') {
    const size = 9;
    fetch(`http://18.199.96.125:8080/api/v1/mangas?num=${page}&size=${size}&orderBy=${orderBy}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch mangas');
        }
        return response.json();
      })
      .then(data => {
        mangaGrid.innerHTML = '';
        if (data.content.length === 0) {
          mangaGrid.innerHTML = '<p>No mangas found.</p>';
        } else {
          data.content.forEach(manga => {
            const mangaItem = document.createElement('div');
            mangaItem.classList.add('manga-item');
            mangaItem.addEventListener('click', function () {
                const mangaId = manga.mangaId;
                window.open(`manga-details.html?id=${mangaId}`, '_blank');
            });
            mangaItem.innerHTML = `
              <h3>${manga.title}</h3>
              <p>${manga.description}</p>
            `;
            mangaGrid.appendChild(mangaItem);
          });
          renderPagination(data.totalPages);
        }
      })
      .catch(error => console.error('Error fetching mangas:', error));
}
  
function renderPagination(totalPages) {
    pagination.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const button = document.createElement('button');
      button.innerText = i + 1;
      button.addEventListener('click', () => {
        currentPage = i;
        fetchMangas(currentPage);
      });
      pagination.appendChild(button);
    }
}

function openManga(mangaId) {
  window.open(`/manga/${mangaId}`, '_blank');
}

fetchMangas();
