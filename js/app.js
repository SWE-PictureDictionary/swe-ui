async function currentUser() {
    try {
        const response = await fetch("/api/me", { credentials: "same-origin" });

        if (response.status === 401) {
            return null;
        }

        if (!response.ok) {
            throw new Error("Could not fetch current user");
        }

        return await response.json();
    } catch (error) {
        return null;
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(";").shift() : null;
}

async function requireAuth() {
    const user = await currentUser();
    if (!user) {
        window.location.assign("/login.html");
        return null;
    }
    return user;
}

async function logout() {
    const csrf = getCookie("XSRF-TOKEN");

    await fetch("/logout", {
        method: "POST",
        credentials: "same-origin",
        headers: csrf ? { "X-XSRF-TOKEN": csrf } : {}
    });

    window.location.assign("/login.html");
}

function attachLogoutButton(buttonId = "logoutBtn") {
    const button = document.getElementById(buttonId);
    if (!button) return;
    button.addEventListener("click", logout);
}