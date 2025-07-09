// import axios from 'axios'
// const BASE_URL = `http://localhost:8091/lms`


// export const app = axios.create({
//     baseURL: BASE_URL,
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     withCredentials: true,
// });

// // Request Interceptor
// app.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('authtoken');
//         if (Boolean(token)) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // Response Interceptor
// app.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         console.log(error);

//         if (error.response && error.response.status === 401) {
//             if (error?.config?.url !== '/api/auth/login' && error?.config?.url !== '/api/current-user') {
//                 window.location.href = '/';
//             }
//         }
//         return Promise.reject(error);
//     }
// );

// // export default app;

// appCourse.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('authtoken');
//         if (Boolean(token)) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // Response Interceptor
// appCourse.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         console.log(error);

//         if (error.response && error.response.status === 401) {
//             if (error?.config?.url !== '/api/auth/login' && error?.config?.url !== '/api/current-user') {
//                 window.location.href = '/';
//             }
//         }
//         return Promise.reject(error);
//     }
// );

import axios from 'axios';

const BASE_URL = `http://localhost:8091/lms`;

export const app = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Attach access token to requests
app.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authtoken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle token refresh
app.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            alert("Session expired, please login again");
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return app(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                const res = await axios.post(`${BASE_URL}/api/client-api/auth/refresh`, {
                    refreshToken,
                });
                alert("Token refreshed successfully");
                console.log("🔄 Token refreshed successfully:", res.data);
                const { accessToken } = res.data;

                // ⬇️ Update localStorage with new token
                localStorage.setItem('authtoken', accessToken);

                processQueue(null, accessToken);

                // ⬇️ Retry the original request with the new token
                originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
                return app(originalRequest);
            } catch (err) {
                processQueue(err, null);
                localStorage.removeItem('authtoken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
