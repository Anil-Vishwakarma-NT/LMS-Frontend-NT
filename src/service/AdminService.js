import {app, appCourse }from "./serviceLMS"


export const getTotalUsers = async () => {
    try {
        const response = await app.get('/admin/count')
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}
export const getTotalCourses = async () => {
    
    try {
        const response = await appCourse.get('/api/course/count')
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}
export const getTotalBundles = async () => {
    
    try {
        const response = await appCourse.get('/api/bundles/count')
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}
export const getTotalEnrollment = async () => {
  try {
    const response = await app.get('/api/enrollment/stats');

    const data = response?.data?.data;

    if (!data || data.length === 0) {
      console.warn("No active enrollments found");
      return []; // or return 0 depending on your use-case
    }

    return data;
  } catch (error) {
    console.error("Error fetching enrollment stats:", error?.response?.data?.message || error.message);
    return []; // or return 0 or null as fallback
  }
};

export const getTotalGroups = async () => {
    
    try {
        const response = await app.get('/group/count')
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}
export const getRecentUser = async () => {
    
    try {
        const response = await app.get('/admin/users/recent')
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}
export const getRecentCourse = async () => {
    
    try {
        const response = await appCourse.get('/api/course/recent')
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}
export const getRecentBundle = async () => {
    
    try {
        const response = await appCourse.get('/api/bundles/course-bundles/recent')
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}
export const getRecentGroups = async () => {
    
    try {
        const response = await app.get('/group/recent')
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}