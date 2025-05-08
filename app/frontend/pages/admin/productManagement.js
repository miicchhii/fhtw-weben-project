import { BACKEND_BASE_URL } from "../../util/rest.js";
import { renderProductEditPage } from "./productEdit.js";
import { renderProductAddPage } from "./productAdd.js";

// Hauptfunktion zum Anzeigen der Seite
export function renderProductManagementPage() {
    document.getElementById("content").innerHTML = `
    <div class="container mt-4">
      <h1>Product Management</h1>
      
      <div class="mb-3">
        <input type="text" id="search-input" class="form-control" placeholder="Search ...">
      </div>
      <div class="mb-3">
        <button id="add-product-btn" class="btn btn-success">add new Product</button>
      </div>
      <div id="product-list" class="table-responsive">
        <p>loading Products...</p>
      </div>
    </div>
  `;

    fetchProducts();

    document.getElementById("search-input").addEventListener("input", (event) => {
        const query = event.target.value.trim();
        fetchProducts(query);
    });

    document.getElementById("add-product-btn").addEventListener("click", () => {
        renderProductAddPage();
    });

    document.getElementById("content").addEventListener("click", (event) => {
        if (event.target.classList.contains("edit-product")) {
            const productId = event.target.getAttribute("data-product-id");
            renderProductEditPage(productId);
        } else if (event.target.classList.contains("delete-product")) {
            const productId = event.target.getAttribute("data-product-id");
            if (confirm("Produkt wirklich löschen?")) {
                deleteProduct(productId);
            }
        }
    });
}

// fetch products
function fetchProducts(searchTerm = "") {
    let url = `${BACKEND_BASE_URL}/api/products`;
    if (searchTerm) {
        url += `?search=${encodeURIComponent(searchTerm)}`;
    }

    fetch(url)
        .then((res) => res.json())
        .then(displayProducts)
        .catch((err) => {
            console.error("Error Loading Products:", err);
            document.getElementById("product-list").innerHTML = "<p class='text-danger'>Error Loading Products.</p>";
        });
}

// Produkte als Tabelle anzeigen
function displayProducts(products) {
    if (!products.length) {
        document.getElementById("product-list").innerHTML = "<p>no Products found.</p>";
        return;
    }

    const rows = products.map((product) => `
    <tr>
      <td><img src="${product.imageUrl || '../static/img/default-image.jpg'}" width="50" /></td>
      <td>${product.name}</td>
      <td>${product.price} €</td>
      <td>${product.category}</td>
      <td>
        <button class="btn btn-sm btn-primary edit-product" data-product-id="${product.id}">edit</button>
        <button class="btn btn-sm btn-danger delete-product" data-product-id="${product.id}">delete</button>
      </td>
    </tr>
  `).join("");

    document.getElementById("product-list").innerHTML = `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

// DELETE PRODUCT
function deleteProduct(productId) {
    fetch(`${BACKEND_BASE_URL}/api/products/${productId}`, {
        method: "DELETE",
    })
        .then((res) => {
            if (!res.ok) throw new Error("failed to delete Product");
            fetchProducts(); // Neu laden
        })
        .catch((err) => {
            console.error("Error deleting Product:", err);
            alert("failed to delete Product.");
        });
}
