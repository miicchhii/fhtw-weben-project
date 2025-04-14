import { renderProductDetailPage } from "./product.js";
import {renderProductsSidebar} from "../ui/sidebar.js";
import {BACKEND_BASE_URL} from "../util/rest.js";


export function renderProductsPage() {
    document.getElementById("content").innerHTML = `
        <div class="container mt-4">
            <h1>Products</h1>
            <p>Find great products.</p>
            <div class="mb-3">
                <input type="text" id="search-input" class="form-control" placeholder="Search products...">
            </div>
            <div class="row" id="product-list">
                <p>Loading products...</p>
            </div>
        </div>
    `;
    renderProductsSidebar();

    function fetchProducts(searchTerm = "") {
        let url = BACKEND_BASE_URL+'/api/products';
        if (searchTerm) {
            url += `?search=${encodeURIComponent(searchTerm)}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(products => displayProducts(products))
            .catch(error => {
                console.error('Error fetching products:', error);
                document.getElementById("product-list").innerHTML = '<p>Failed to load products.</p>';
            });
    }

    // Initial load
    fetchProducts();


    // Listen for search input changes
    document.getElementById("search-input").addEventListener("input", (event) => {
        const query = event.target.value.trim();
        fetchProducts(query);
    });

    // Delegate click event for product details
    document.getElementById("content").addEventListener("click", function (event) {
        if (event.target && event.target.matches("a.btn.btn-primary")) {
            event.preventDefault();
            const productId = event.target.getAttribute("data-product-id");
            renderProductDetailPage(productId);
        }
    });
}

export function fetchProductsByCategory(categoryId){

    const productList = document.getElementById("product-list");
    productList.innerHTML = '<div class="text-center">Loading products...</div>';

    let url = BACKEND_BASE_URL+`/api/products/filter?categoryId=${categoryId}`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(products => {
            if (products.length === 0) {
                productList.innerHTML = '<div class="alert alert-info">No products in this category</div>';
            } else {
                displayProducts(products);
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            productList.innerHTML = '<div class="alert alert-danger">Error loading products</div>';
        });
}

//display Products (for product search and filter by category (sidebar))
function displayProducts(products) {
    const productCards = products.map(product => `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                <div class="card">
                    <img src="${product.imageUrl || '../static/img/default-image.jpg'}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text"><strong>$${product.price}</strong></p>
                        <a href="#" class="btn btn-primary" data-product-id="${product.id}">View Details</a>
                    </div>
                </div>
            </div>
        `).join('');

    document.getElementById("product-list").innerHTML = productCards || "<p>No products found.</p>";
}
