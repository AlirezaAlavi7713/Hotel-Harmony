const API = import.meta.env.VITE_URL_API || "";

const API_BASE = API.endsWith("/api") ? API.slice(0, -4) : API;

export function buildMediaUrl(path) {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${API_BASE}${path}`;
}
