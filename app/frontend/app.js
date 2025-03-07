document.addEventListener("DOMContentLoaded", init);

function init() {
    //add basic layout
    document.getElementById("body").innerHTML = `
        <div class="d-flex flex-column" style="height: 100vh">
            <div
                    id="nav"
                    class="border d-flex align-items-center flex-shrink-0"
                    style=""
            >

            </div>
            <div class="d-flex flex-grow-1">
                <div
                        id="sidebar"
                        class="border d-none d-md-flex flex-column flex-shrink-0"
                        style="width: 16.666%"
                >

                </div>
                <div id="content" class="border d-flex flex-column flex-grow-1">

                </div>
            </div>
        </div> `;
    renderNavBar();

    document.getElementById("sidebar").innerHTML = "Sidebar-Code";

    document.getElementById("content").innerHTML = "Content-Code";
}


function renderNavBar() {
    document.getElementById("nav").innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <img src="static/img/logo.webp" alt="Logo Super Happy Hotel" width="100px">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <button class="nav-link">Mein Konto</button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link">Logout</button>
                        </li>
                    </ul>
                </div>
        </nav>
    `;
}

function showPage(page) {
    switch (page) {
        case "home":
            document.getElementsByTagName("body");

            break;
        default:
            break;
    }
}
