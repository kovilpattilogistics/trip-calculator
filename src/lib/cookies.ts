export function setCookie(name: string, value: string, days = 365) {
    if (typeof document === 'undefined') return;

    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }

    // Path=/ ensures it's available across the whole domain (including /trip-calculator)
    // SameSite=Lax is good default for navigation
    // Secure ensures it's sent over HTTPS
    document.cookie = `${name}=${value || ''}${expires}; path=/; SameSite=Lax; Secure`;
}

export function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
