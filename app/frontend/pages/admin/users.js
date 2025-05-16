import {BACKEND_BASE_URL} from "../../util/rest.js";

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
                const userCards = users.map(user => `
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${user.firstName} ${user.lastName}</h5>
                                <p class="card-text">${user.email}</p>
                                 <div class="d-flex justify-content-between gap-2">
                                    <a href="#" class="btn btn-primary btn-details" data-user-id="${user.id}">View Details</a>
                                    <a href="#" class="btn btn-danger btn-deactivate" data-user-id="${user.id}">Deactivate User</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('');

                document.getElementById("user-list").innerHTML = userCards || "<p>No users found.</p>";
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
    })

    function deactivateUser(userId) {
        fetch(`${BACKEND_BASE_URL}/api/users/${userId}/deactivate`, {
            method: "POST",
            credentials: "include"
        })
            .then(response => {
                if (response.ok) {
                    alert("User successfully deactivated.");
                    fetchUsers(); // Refresh list
                } else {
                    return response.json().then(err => {
                        throw new Error(err.message || "Deactivation failed.");
                    });
                }
            })
            .catch(error => {
                console.error("Deactivation error:", error);
                alert("Failed to deactivate user: " + error.message);
            });
    }

    fetchUsers();

    document.getElementById("search-input").addEventListener("input", (event) => {
        const query = event.target.value.trim();
        fetchUsers(query);
    });



}