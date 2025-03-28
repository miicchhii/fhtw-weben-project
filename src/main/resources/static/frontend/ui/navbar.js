export function renderNavBar() {
    document.getElementById("nav").innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <img src="static/img/logo.webp" alt="Logo" width="100px">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <button id="homeBtn" class="nav-link">Home</button>
                        </li>
                        <li class="nav-item">
                            <button id="productsBtn" class="nav-link">Products</button>
                        </li>
                        <li class="nav-item">
                            <button id="accountBtn" class="nav-link">My Account</button>
                        </li>
                        <li class="nav-item">
                            <button id="logoutBtn" class="nav-link">Logout</button>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    `;
}
