import {app}from "./serviceLMS"


export const getTotalUsers = async () => {
    try {
        console.log("getting total users");
        const response = await app.get('user/api/service-api/admin/count')
        console.log("response", response.data);
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}
export const getTotalCourses = async () => {
    
    try {
        const response = await app.get('course/api/service-api/course/count')
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}
export const getTotalBundles = async () => {
    
    try {
        const response = await app.get('course/api/service-api/bundles/count')
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}
export const getTotalEnrollment = async () => {
  try {
    const response = await app.get('user/api/service-api/enrollment/statistics');

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
        const response = await app.get('user/api/service-api/group/count')
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}
export const getRecentUser = async () => {
    
    try {
        const response = await app.get('user/api/service-api/admin/users/recent')
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}
export const getRecentCourse = async () => {
    
    try {
        const response = await app.get('course/api/service-api/course/recent')
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}
export const getRecentBundle = async () => {
    
    try {
        const response = await app.get('course/api/service-api/course-bundles/recent')
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}
export const getRecentGroups = async () => {
    
    try {
        const response = await app.get('user/api/service-api/group/recent')
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}