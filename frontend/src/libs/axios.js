import axios from 'axios';



function setCookie(name, value, days = 7) {
    if (typeof window === 'undefined') return;

    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }

    document.cookie = name + '=' + (value || '') + expires + '; path=/; SameSite=Lax';
}



function getCookie(name) {
    if (typeof window === 'undefined') return null;

    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}




function deleteCookie(name) {
    setCookie(name, '', -1);
}



const API_URL = 'https://headlybackend.onrender.com/api';


//const API_URL = 'http://localhost:4000/api';

//const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://headly-i6zv.vercel.app'||'https://vercel.com/shishir269646s-projects/headly-i6zv/jL95DcryB6fRbyzR3WR8kuTWvKeN');


// Create axios instance
export const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },

    withCredentials: true,
});



axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;


        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {

                await axios.post(`${API_URL}/auth/refresh-token`, {}, {
                    withCredentials: true
                });


                return axiosInstance(originalRequest);

            } catch (refreshError) {

                if (typeof window !== 'undefined') {
                    // List of public paths that should not trigger a redirect to login on 401
                    const publicPaths = ['/', '/about', '/contact', '/all-content', '/popular-content', '/trending-content', '/newsletter'];
                    const isPublicPath = publicPaths.some(path => window.location.pathname === path || (path !== '/' && window.location.pathname.startsWith(path + '/')));

                    // Also consider authentication paths as non-redirecting
                    const authPaths = ['/login', '/register', '/social/success'];
                    const isAuthPath = authPaths.some(path => window.location.pathname.startsWith(path));

                    if (!isPublicPath && !isAuthPath && !window.location.pathname.startsWith('/dashboard') && !window.location.pathname.startsWith('/viewer')) {
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                    } else if (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/viewer')) {
                        // If it's a protected route, always redirect
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
