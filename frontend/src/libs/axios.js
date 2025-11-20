import axios from 'axios';

// --- Cookie Utility Functions ---

/**
 * Sets a cookie with a given name, value, and optional expiration days.
 * To delete a cookie, set days to a negative number
 * @param {string} name The name of the cookie.
 * @param {string} value The value of the cookie.
 * @param {number} [days=7] The number of days until the cookie expires.
 */


function setCookie(name, value, days = 7) {
    if (typeof window === 'undefined') return;

    let expires = '';
    if (days) {
        const date = new Date();
        // Calculate expiration in milliseconds: current time + days * 24h * 60m * 60s * 1000ms
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    // Set cookie path to root ('/') to make it available globally across the application.
    document.cookie = name + '=' + (value || '') + expires + '; path=/; SameSite=Lax';
}



function getCookie(name) {
    if (typeof window === 'undefined') return null;

    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length); // Trim leading spaces
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}




function deleteCookie(name) {
    setCookie(name, '', -1);
}


const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api');

// Create axios instance
export const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    // Note: withCredentials is often required when using cookies with a separate API domain.
    withCredentials: true,
});

// Request interceptor is no longer needed as the browser will send the httpOnly cookie.
// axiosInstance.interceptors.request.use(...)

// Response interceptor - Handle token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 (Unauthorized) and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // The httpOnly refreshToken cookie is sent automatically by the browser.
                // We just need to call the refresh endpoint.
                await axios.post(`${API_URL}/auth/refresh-token`, {}, {
                    withCredentials: true
                });

                // The backend will have set a new accessToken cookie.
                // We can now retry the original failed request.
                // axiosInstance will automatically use the new cookie.
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                // Failed to refresh token
                if (typeof window !== 'undefined') {
                    // Clear user from localStorage
                    localStorage.removeItem('user');
                    // Redirect to login
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;