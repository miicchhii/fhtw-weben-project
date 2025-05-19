import {BACKEND_BASE_URL} from "./rest.js";

export async function checkLoginStatus() {
    try {
        const res = await fetch(BACKEND_BASE_URL + "/api/auth/me", {
            credentials: "include",
        });

        if (!res.ok) return null;
        return await res.json(); // returns the logged-in user
    } catch {
        return null;
    }
}

export function formatPrice(price) {
    return price.toFixed(2) + "€"; // Two decimals + euro sign
}

//VALIDATIONS

export function sanitizeInput(input) {
    return input.trim()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

//IMG PROCESSING
export async function processImageToWebp(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            let {width, height} = img;
            const maxDim = 800;
            if (width > maxDim || height > maxDim) {
                const scale = Math.min(maxDim / width, maxDim / height);
                width = Math.round(width * scale);
                height = Math.round(height * scale);
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(blob => {
                URL.revokeObjectURL(url);
                blob ? resolve(blob) : reject(new Error("WebP-Konvertierung fehlgeschlagen"));
            }, 'image/webp', 0.8);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Bild konnte nicht geladen werden"));
        };

        img.src = url;
    });
}