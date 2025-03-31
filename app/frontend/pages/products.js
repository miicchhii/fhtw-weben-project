import {renderProductDetailPage} from "./product.js";

export function renderProductsPage() {
    document.getElementById("content").innerHTML = `
        <div class="container mt-5">
            <h1>Products</h1>
            <p>This is the products page content.</p>
        </div>
    `;

    // Fetch products from API
    fetch('http://localhost:8080/api/products')  // Your endpoint for fetching products
        .then(response => response.json())
        .then(products => {
            // Generate HTML for product cards
            const productCards = products.map(product => {
                return `
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div class="card">
                            <img src="${product.imageUrl || 'default-image.jpg'}" class="card-img-top" alt="${product.name}">
                            <div class="card-body">
                                <h5 class="card-title">${product.name}</h5>
                                <p class="card-text">${product.description}</p>
                                <p class="card-text"><strong>$${product.price}</strong></p>
                                <a href="#" class="btn btn-primary" data-product-id="${product.id}">View Details</a>
                            </div>
                        </div>
                    </div>
                `;
            }).join(''); // Join the array into a single string

            // Inject the product cards into the content area
            document.getElementById("content").innerHTML = `
                <div class="container mt-4">
                    <div class="row">
                        ${productCards}
                    </div>
                </div>
            `;

            // Delegate the click event to the container
            document.getElementById("content").addEventListener("click", function (event) {
                // Check if the clicked element is a "View Details" button
                if (event.target && event.target.matches("a.btn.btn-primary")) {
                    event.preventDefault(); // Prevent default anchor behavior

                    const productId = event.target.getAttribute("data-product-id"); // Get product ID from the data attribute
                    renderProductDetailPage(productId); // Pass the product id to the showPage function
                }
            });
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            document.getElementById("content").innerHTML = '<p>Failed to load products.</p>';
        });

}
