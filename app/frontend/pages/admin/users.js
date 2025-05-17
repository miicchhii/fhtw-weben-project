import { BACKEND_BASE_URL } from "../../util/rest.js";
import {renderUserDetailsPage} from "./userDetails.js";

export function renderUserManagementPage() {
    document.getElementById("content").innerHTML = `
        <div class="container mt-4">
            <h1>User Management</h1>
            <p>Manage your users here:</p>
            <div class="mb-3">
                <input type="text" id="search-input" class="form-control" placeholder="Search users...">
            </div>
            <div class="row" id="user-list">
                <p>Loading users...</p>
            </div>
        </div>
    `;

    function fetchUsers(searchTerm = "") {
        let url = BACKEND_BASE_URL + '/api/users';
        if (searchTerm) {
            url += `?search=${encodeURIComponent(searchTerm)}`;
        }

        fetch(url, {
            credentials: "include"
        })
            .then(response => response.json())
            .then(users => {
                const userCards = users.map(user => {
                    const toggleText = user.active ? "Deactivate User" : "Activate User";
                    const toggleClass = user.active ? "btn-danger" : "btn-success";

                    return `
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${user.firstName} ${user.lastName}</h5>
                                <p class="card-text">${user.email}</p>
                                <div class="d-flex justify-content-between gap-2">
                                    <a href="#" class="btn btn-primary btn-details" data-user-id="${user.id}">View Details</a>
                                    <a href="#" class="btn ${toggleClass} btn-toggle-active" 
                                       data-user-id="${user.id}" 
                                       data-user-active="${user.active}">
                                        ${toggleText}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                }).join('');

                document.getElementById("user-list").innerHTML = userCards || "<p>No users found.</p>";

                // Event: Toggle Active Status
                document.querySelectorAll(".btn-toggle-active").forEach(button => {
                    button.addEventListener("click", (e) => {
                        e.preventDefault();
                        const userId = button.getAttribute("data-user-id");
                        const isActive = button.getAttribute("data-user-active") === "true";
                        const newStatus = !isActive;

                        fetch(`${BACKEND_BASE_URL}/api/users/${userId}/active`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            credentials: "include",
                            body: JSON.stringify({ active: newStatus })
                        })
                            .then(response => {
                                if (response.ok) {
                                    fetchUsers(); // refresh list
                                } else {
                                    alert("Failed to update user status.");
                                }
                            })
                            .catch(error => {
                                console.error("Error updating user:", error);
                                alert("An error occurred.");
                            });
                    });
                });

                // Event: View Details
                document.querySelectorAll(".btn-details").forEach(link => {
                    link.addEventListener("click", (event) => {
                        event.preventDefault(); // verhindert das Neuladen der Seite
                        const userId = event.currentTarget.getAttribute("data-user-id");
                        renderUserDetailsPage(userId);
                    });
                });

            })
            .catch(error => {
                console.error('Error fetching users:', error);
                document.getElementById("user-list").innerHTML = '<p>Failed to load users.</p>';
            });
    }

    fetchUsers();

    document.getElementById("search-input").addEventListener("input", (event) => {
        const query = event.target.value.trim();
        fetchUsers(query);
    });
}
