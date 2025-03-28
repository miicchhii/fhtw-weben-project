import {renderProductsPage} from "./products.js";

export function renderProductDetailPage(productId) {
    // Fetch product details by ID
    fetch(`http://localhost:8080/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            // Generate HTML for product details
            const productDetail = `
                <div class="container mt-5">
                    <h1>${product.name}</h1>
                    <div class="row">
                        <div class="col-md-6">
                            <img src="${product.imageUrl || 'default-image.jpg'}" class="img-fluid" alt="${product.name}">
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
                </div>
            `;

            // Inject product details into the content area
            document.getElementById("content").innerHTML = productDetail;

            // Add event listener for the "Back to Products" button
            document.getElementById("backToProductsBtn").addEventListener("click", function () {
                renderProductsPage();
            });
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
            document.getElementById("content").innerHTML = '<p>Failed to load product details.</p>';
        });
}
