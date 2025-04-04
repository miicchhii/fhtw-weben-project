import { fetchProductsByCategory } from "../pages/products.js";

export function renderSidebar() {
    document.getElementById("sidebar").innerHTML = `
        <ul class="list-group list-group-flush">
            <li class="list-group-item">Dashboard</li>
            <li class="list-group-item">Settings</li>
            <li class="list-group-item">Profile</li>
        </ul>
    `;
}

export function renderProductsSidebar() {
    fetch('http://localhost:8080/api/categories')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(categories => {
            const categoryList = categories.map(category => `
                <a href="#" class="list-group-item list-group-item-action category-link" data-category-id="${category.id}">
                    ${category.name}
                </a>
            `).join('');

            document.getElementById("sidebar").innerHTML = `
                <div class="list-group">
                    <a href="#" class="list-group-item disabled">Categories</a>
                    ${categoryList || '<a href="#" class="list-group-item">No categories available</a>'}
                </div>
            `;
        })
        .catch(error => {
            console.error('Error loading categories:', error);
            document.getElementById("sidebar").innerHTML = `
                <div class="list-group">
                    <a href="#" class="list-group-item text-danger disabled">Failed to load categories</a>
                </div>
            `;
        });

    document.getElementById("sidebar").addEventListener("click", function(event) {
        if (event.target && event.target.matches(".category-link")) {
            event.preventDefault();
            const categoryId = event.target.getAttribute("data-category-id");
            fetchProductsByCategory(categoryId);
        }
    });


}


