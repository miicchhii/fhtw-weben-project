import {BACKEND_BASE_URL} from "../../util/rest.js";
import { sanitizeInput , processImageToWebp} from "../../util/helper.js";



export function renderProductAddPage() {
    document.getElementById("content").innerHTML = `
        <div class="container mt-4">
            <h2>Create New Product</h2>
            <form id="product-form" enctype="multipart/form-data">
                <div class="mb-3">
                    <label for="name" class="form-label">Product Name</label>
                    <input type="text" class="form-control" id="name" required>
                </div>
                <div class="mb-3">
                    <label for="description" class="form-label">Description</label>
                    <textarea class="form-control" id="description" rows="3"></textarea>
                </div>
                <div class="mb-3">
                    <label for="price" class="form-label">Price</label>
                    <input type="number" class="form-control" id="price" step="0.01" required>
                </div>
                <div class="mb-3">
                    <label for="category" class="form-label">Category</label>
                    <select class="form-select" id="category" required>
                        <option value="">Loading categories...</option>
                    </select>
                </div>
                <!-- file upload -->
                <div class="mb-3">
                    <label for="imageFile" class="form-label">Product Image</label>
                    <input type="file" class="form-control" id="imageFile" accept="image/*">
                </div>
                
                <button type="submit" class="btn btn-primary">Create Product</button>
            </form>
        </div>
    `;

    // load Categories <select>
    fetch(`${BACKEND_BASE_URL}/api/categories`, {
        credentials: "include"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(categories => {
            const select = document.getElementById("category");

            if (!categories.length) {
                select.innerHTML = '<option disabled selected>No categories available</option>';
                return;
            }

            select.innerHTML = categories.map(cat => `
            <option value="${cat.id}">${cat.name}</option>
        `).join('');
        })
        .catch(error => {
            console.error("Error loading categories:", error);
            const select = document.getElementById("category");
            select.innerHTML = '<option disabled selected>Failed to load categories</option>';
        });

    // SEND FORM
    document.getElementById("product-form").addEventListener("submit", async (event) => {
        event.preventDefault();

        const form = event.target;

        const productData = {
            name: sanitizeInput(form.name.value),
            description: sanitizeInput(form.description.value),
            price: parseFloat(form.price.value),
            categoryId: parseInt(form.category.value)
        };

        try {
            // 1. Produktdaten speichern
            const res = await fetch(`${BACKEND_BASE_URL}/api/products`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(productData)
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Server error ${res.status}: ${errorText}`);
            }

            // Produkt erfolgreich erstellt → ID extrahieren
            const createdProduct = await res.json();
            const productId = createdProduct.id;

            const imageFile = form.imageFile.files[0];
            if (imageFile) {
                const processedBlob = await processImageToWebp(imageFile);
                const imageFormData = new FormData();
                imageFormData.append("image", processedBlob, "product.webp");

                await fetch(`${BACKEND_BASE_URL}/api/products/${productId}/image`, {
                    method: "PUT",
                    credentials: "include",
                    body: imageFormData
                });
            }


            alert("Product created successfully.");
            import("./productManagement.js").then(module => module.renderProductManagementPage());

        } catch (err) {
            console.error("Error creating product:", err);
            alert("Failed to create product.");
        }
    });
}
