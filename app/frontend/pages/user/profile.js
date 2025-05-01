import {BACKEND_BASE_URL} from "../../util/rest.js";
import { sanitizeInput } from "../../util/helper.js";
import { checkLoginStatus } from "../../util/helper.js";
import { renderUserSidebar } from "../../ui/sidebar.js";


export async function renderProfilePage() {
    const content = document.getElementById("content");
    content.innerHTML = `
        <h2>Profile Settings</h2>
        <p>Here you can manage your personal information.</p>
        <!-- Weitere Inhalte folgen -->
    `;
}