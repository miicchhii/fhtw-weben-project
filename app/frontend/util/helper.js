import {BACKEND_BASE_URL} from "../util/rest.js";

export async function checkLoginStatus() {
    try {
        const res = await fetch("BACKEND_BASE_URL/api/auth/me", {
            credentials: "include",
        });

        if (!res.ok) return null;
        return await res.json(); // returns the logged-in user
    } catch {
        return null;
    }
}
