import { BACKEND_BASE_URL } from "../../util/rest.js";
import {renderUserManagementPage} from "./users.js";




    export function renderUserDetailsPage(userId) {
        fetch(`${BACKEND_BASE_URL}/api/users/${userId}`, {
            credentials: "include",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error loading Data.");
                }
                return response.json();
            })
            .then(user => {
                document.getElementById("content").innerHTML = `
        <div class="container mt-4">
          <h2>User Details</h2>
          <div class="card p-3">
            <p><strong>First Name:</strong> ${user.firstName}</p>
            <p><strong>Last Name:</strong> ${user.lastName}</p>
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Role:</strong> ${user.role}</p>
            <p><strong>Address:</strong> ${user.address || "-"}</p>
            <p><strong>Birthdate:</strong> ${user.birthdate || "-"}</p>
            <p><strong>Status:</strong> ${user.active ? "Active" : "Inactive"}</p>
          </div>
          <button class="btn btn-primary mt-3" id="back-btn">Back</button>
        </div>
      `;

                // Optional: "Zurück"-Button
                document.getElementById("back-btn").addEventListener("click", () => {
                   renderUserManagementPage()
                });
            })
            .catch(error => {
                document.getElementById("content").innerHTML = `
        <div class="alert alert-danger">Fehler: ${error.message}</div>
      `;
            });
    }
