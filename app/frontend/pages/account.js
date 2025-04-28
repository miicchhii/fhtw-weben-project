import {renderUserSidebar} from "../ui/sidebar.js";
import {renderChangePasswordPage} from "./user/password.js";
import {BACKEND_BASE_URL} from "../../util/rest.js";



export function renderAccountPage() {
    document.getElementById("content").innerHTML = `
        <div class="container-fluid">
            <div class="row">                
                <main id="account-main-content" class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                    <h2>Account Page</h2>
                    <p>Welcome to your account settings!</p>
                    <a href="#" id="changePassword">Change Password</a>
                </main>
            </div>
        </div>
    `;

    renderUserSidebar();

    document.getElementById("changePassword").addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("account-main-content").innerHTML = `
            <h2>Change Password</h2>
            <div id="change-password-form-container"></div>
        `;
        renderChangePasswordPage();
    });
}
