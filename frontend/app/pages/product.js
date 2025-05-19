import {renderProductsPage} from "./products.js";
import {BACKEND_BASE_URL} from "../util/rest.js";
import {addToCart} from "../ui/cartSidebar.js";

export function renderProductDetailPage(productId) {
    // Fetch product details by ID
    fetch(BACKEND_BASE_URL + `/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            // Generate HTML for product details
            const imageSrc = product.imageUrl
                ? `${BACKEND_BASE_URL.replace('/api', '')}${product.imageUrl}`
                : '../static/img/default-image.jpg';
            const productDetail = `
                <div class="container mt-5">
                    <h1>${product.name}</h1>
                    <div class="row">
                        <div class="col-md-6">
                            <img src="${imageSrc}" class="img-fluid" alt="${product.name}">
                        </div>
                        <div class="col-md-6">
                            <h4>Description:</h4>
                            <p>${product.description}</p>
                            <p><strong>Price:</strong> $${product.price}</p>
                            <p><strong>Category:</strong> ${product.category.name}</p>
                            <p><strong>Created On:</strong> ${new Date(product.creationDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <button id="backToProductsBtn" class="btn btn-secondary mt-3">Back to Products</button>
                    <button id="addToCartBtn" class="btn btn-primary mt-3">Add to Cart</button>
                    
                </div>
            `;

            // Inject product details into the content area
            document.getElementById("content").innerHTML = productDetail;

            // Add event listener for the "Back to Products" button
            document.getElementById("backToProductsBtn").addEventListener("click", function () {
                renderProductsPage();
            });

            // Add event listener for the "Add to Cart" button
            document.getElementById("addToCartBtn").addEventListener("click", function () {
                addToCart(product.id); // 👈 Make sure addToCart is in scope
            });


        })
        .catch(error => {
            console.error('Error fetching product details:', error);
            document.getElementById("content").innerHTML = '<p>Failed to load product details.</p>';
        });
}
