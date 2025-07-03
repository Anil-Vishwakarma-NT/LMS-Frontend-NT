import {app} from "./serviceLMS";

export async function dashStats() {
    try {
        const response = await app.get('user/api/service-api/stats/statistics')
        return response.data.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}

