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


const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api');

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

                    localStorage.removeItem('user');

                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;