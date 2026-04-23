const fallbackBaseUrl = "/";

export function withBaseUrl(path: string): string {
    const baseUrl = import.meta.env.BASE_URL || fallbackBaseUrl;
    const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    return `${normalizedBase}${normalizedPath}`;
}
