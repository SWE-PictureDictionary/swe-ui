function normalizeRole(role) {
    return role && role.startsWith("ROLE_") ? role : `ROLE_${role}`;
}

function hasRole(user, role) {
    const expectedRole = normalizeRole(role);
    return Boolean(user?.roles?.includes(expectedRole));
}

function canManageTopics(user) {
    return hasRole(user, "CONTENT_MANAGER");
}

function canEditHotspots(user) {
    return hasRole(user, "CONTENT_MANAGER") || hasRole(user, "HOTSPOT_EDITOR");
}

function canLearn(user) {
    return canEditHotspots(user) || hasRole(user, "LEARNER");
}

function getCookie(name) {
    return document.cookie
        .split("; ")
        .find(cookie => cookie.startsWith(name + "="))
        ?.split("=")[1];
}

function withCsrfHeader(headers) {
    const csrfToken = getCookie("XSRF-TOKEN");
    const nextHeaders = new Headers(headers || {});

    if (csrfToken) {
        nextHeaders.set("X-XSRF-TOKEN", decodeURIComponent(csrfToken));
    }

    return nextHeaders;
}

function fetchWithCsrf(url, options = {}) {
    return fetch(url, {
        ...options,
        credentials: "same-origin",
        headers: withCsrfHeader(options.headers)
    });
}

async function loadCurrentUser() {
    const response = await fetch("/api/me", { credentials: "same-origin" });

    if (response.status === 401) {
        window.location.replace("/login.html");
        return null;
    }

    if (!response.ok) {
        throw new Error("Could not check sign-in status.");
    }

    const user = await response.json();
    window.currentUser = user;
    return user;
}
