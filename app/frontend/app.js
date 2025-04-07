import {renderNavBar} from './ui/navbar.js';
import {renderSidebar} from './ui/sidebar.js';
import {renderHomePage} from './pages/home.js';

document.addEventListener("DOMContentLoaded", init);

function init() {
    // Add the basic layout
    document.getElementById("body").innerHTML = `
        <div class="d-flex flex-column" style="height: 100vh">
            <div id="nav" class="border d-flex align-items-center flex-shrink-0"></div>
            <div id="main" class="d-flex flex-grow-1">
                <div id="sidebar" class="border d-none d-md-flex flex-column flex-shrink-0" style="width: 16.666%"></div>
                <div id="content" class="border d-flex flex-column flex-grow-1"></div>
            </div>
        </div>`;

    // Render sections
    renderNavBar();
    renderSidebar();

    // Default page
    renderHomePage();

}
