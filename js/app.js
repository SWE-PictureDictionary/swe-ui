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

async function requireAuth() {
    const user = await currentUser();
    if (!user) {
        window.location.assign("/login.html");
        return null;
    }
    return user;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length !== 2) {
        return null;
    }

    const cookieValue = parts.pop().split(";").shift();

    try {
        return decodeURIComponent(cookieValue);
    } catch (error) {
        return cookieValue;
    }
}

function csrfHeaders(headers = {}) {
    const csrfToken = getCookie("XSRF-TOKEN");
    if (!csrfToken) {
        return headers;
    }

    return {
        ...headers,
        "X-XSRF-TOKEN": csrfToken
    };
}

function hasRole(user, role) {
    if (!user || !Array.isArray(user.roles)) {
        return false;
    }

    const roleName = role.startsWith("ROLE_") ? role : "ROLE_" + role;
    return user.roles.includes(roleName);
}

function canManageTopics(user) {
    return hasRole(user, "CONTENT_MANAGER");
}

function canEditHotspots(user) {
    return canManageTopics(user) || hasRole(user, "HOTSPOT_EDITOR");
}

async function logout(event) {
    if (event) {
        event.preventDefault();
    }

    window.location.assign("/logout");
}

function attachLogoutButton(buttonId = "logoutBtn") {
    const buttons = document.querySelectorAll(`[id="${buttonId}"]`);
    buttons.forEach(button => {
        if (button.dataset.logoutAttached === "true") return;

        button.dataset.logoutAttached = "true";
        button.addEventListener("click", logout);
    });
}
