import {BACKEND_BASE_URL} from "../../util/rest.js";


export function renderUserManagementPage(){
    document.getElementById("content").innerHTML = "User Management Page"
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
                                <a href="#" class="btn btn-primary" data-user-id="${user.id}">View Details</a>
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

    document.getElementById("search-input").addEventListener("input", (event) =>{
        const query = event.target.value.trim();
        fetchUsers(query);
    })

}