export async function checkLoginStatus() {
    try {
        const res = await fetch("http://localhost:8080/api/auth/me", {
            credentials: "include",
        });

        if (!res.ok) return null;
        return await res.json(); // returns the logged-in user
    } catch {
        return null;
    }
}
