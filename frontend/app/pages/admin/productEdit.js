import { BACKEND_BASE_URL } from "../../util/rest.js";
import { sanitizeInput,processImageToWebp } from "../../util/helper.js";


export async function renderProductEditPage(productId) {
    document.getElementById("content").innerHTML = `
        <div class="container mt-4">
            <h2>Edit Product</h2>
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
                <div class="mb-3">
                    <label for="imageFile" class="form-label">Update Image</label>
                    <input type="file" class="form-control" id="imageFile" accept="image/*">
                </div>
                
                <button type="submit" class="btn btn-primary">Update Product</button>
            </form>
        </div>
    `;

    const form = document.getElementById("product-form");

    try {
        // Lade Produktdaten
        const productRes = await fetch(`${BACKEND_BASE_URL}/api/products/${productId}`, {
            credentials: "include"
        });
        if (!productRes.ok) throw new Error("Failed to load product");
        const product = await productRes.json();

        // Lade Kategorien
        const categoryRes = await fetch(`${BACKEND_BASE_URL}/api/categories`, {
            credentials: "include"
        });
        const categories = await categoryRes.json();
        const select = document.getElementById("category");
        select.innerHTML = categories.map(cat => `
            <option value="${cat.id}" ${cat.id === product.category.id ? "selected" : ""}>${cat.name}</option>
        `).join("");

        // Fülle Formular
        form.name.value = product.name;
        form.description.value = product.description;
        form.price.value = product.price;

    } catch (error) {
        console.error("Fehler beim Laden der Produktdaten:", error);
        alert("Fehler beim Laden der Produktdaten");
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const productData = {
            name: sanitizeInput(form.name.value),
            description: sanitizeInput(form.description.value),
            price: parseFloat(form.price.value),
            categoryId: parseInt(form.category.value)
        };

        try {
            // 1. Produkt aktualisieren
            const res = await fetch(`${BACKEND_BASE_URL}/api/products/${productId}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(productData)
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Update failed: ${errorText}`);
            }

            // 2. Optional: Bild hochladen
            const imageFile = form.imageFile.files[0];
            if (imageFile) {
                const processedBlob = await processImageToWebp(imageFile);
                const formData = new FormData();
                formData.append("image", processedBlob, "product.webp");

                const imageRes = await fetch(`${BACKEND_BASE_URL}/api/products/${productId}/image`, {
                    method: "PUT",
                    credentials: "include",
                    body: formData
                });

                if (!imageRes.ok) {
                    const imageErrorText = await imageRes.text();
                    throw new Error(`Image upload failed: ${imageErrorText}`);
                }
            }

            alert("Product updated successfully.");
            import("./productManagement.js").then(module => module.renderProductManagementPage());

        } catch (err) {
            console.error("Update error:", err);
            alert("Failed to update product.");
        }
    });
}
