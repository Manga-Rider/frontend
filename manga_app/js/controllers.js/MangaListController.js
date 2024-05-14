class MangaListController {
    static fetchMangaListAndRender(authorId) {
        MangaModel.getMangaList(authorId)
            .then(data => View.renderMangaList(data))
            .catch(error => console.error('Error fetching manga list:', error));
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const authToken = UserModel.getAuthToken();
    if (!authToken) {
        window.location.href = "login.html";
        return;
    }

    const userId = localStorage.getItem("userId");
    MangaListController.fetchMangaListAndRender(userId);
});
