export function renderSidebar() {
    document.getElementById("sidebar").innerHTML = `
        <ul class="list-group list-group-flush">
            <li class="list-group-item">Dashboard</li>
            <li class="list-group-item">Settings</li>
            <li class="list-group-item">Profile</li>
        </ul>
    `;
}
