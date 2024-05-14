import LoginController from './controllers/LoginController.js';
import ProfileController from './controllers/ProfileController.js';
import RegistrationController from './controllers/RegistrationController.js';
import UploadMangaController from './controllers/UploadMangaController.js';
import MangaListController from './controllers/MangaListController.js';

document.addEventListener("DOMContentLoaded", function() {
    const currentPage = window.location.pathname;

    switch (currentPage) {
        case "/login.html":
            LoginController.init();
            break;
        case "/profile.html":
            ProfileController.init();
            break;
        case "/registration.html":
            RegistrationController.init();
            break;
        case "/upload_manga.html":
            UploadMangaController.init();
            break;
        case "/manga_list.html":
            MangaListController.init();
            break;
        default:
            console.error("Unknown page:", currentPage);
    }
});