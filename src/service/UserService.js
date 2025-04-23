import app from "./serviceLMS"


export async function fetchUsers() {
    try {
        const response = await app.get('/api/user')
        return response.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}

export async function deleteUsers(id) {
    try {
        const response = await app.delete(`/admin/remove-user/${id}`)
        return response.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}

export async function fetchAllActiveUsers(token) {
    try {
        console.log("token");
        console.log(token);
        const response = await app.get('/admin/active-employees', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}

export async function fetchAllInactiveUsers(token) {
    try {
        console.log("getting inactive users");
        const response = await app.get('/admin/inactive-employees', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    }
    catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}

export async function createUser(userData, token) {
    try {
        const response = await app.post(
            '/admin/register',
            userData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || 'Something went wrong');
    }
}


export async function updateUser(userData, id) {
    try {
        const response = await app.put(`/admin/update-user/${id}`, userData);
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}

export async function countAllUsers() {
    try {
        const response = await app.get('/api/user/userCount')
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}

export async function userLogin(data) {
    try {

        const response = await app.post('/api/auth/login', data);
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}

export async function getUserByToken(token) {
    try {
        const response = await app.get('/api/current-user', {
            headers: {
                Authorization: token
            }
        })
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}

export const logoutUser = () => {
    window.localStorage.removeItem('authtoken')
}