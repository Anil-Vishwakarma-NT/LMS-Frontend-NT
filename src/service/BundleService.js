import { app } from "./serviceLMS";

export const getAllBundles = async () => {

    try {
        const response = await app.get('course/api/client-api/bundles')
        console.log("BUNDLE DETAILS", response.data.data);
        return response.data.data;
    }
    catch (error) {

        throw new Error(error?.response?.data?.message);
    }

};


export const getAllBundleCourses = async (bundleId) => {

    try {
        const response = await app.get(`course/api/client-api/course-bundles/bundle/${bundleId}`)
        console.log("Course DETAILS", response.data.data);
        return response.data.data;
    } catch (error) {

        throw new Error(error?.response?.data?.message);
    }

};

export const CoursesToAdd = async (bundleId) => {

    try {
        const response = await app.get(`course/api/client-api/course-bundles/bundle/courses/${bundleId}`)
        console.log("Course DETAILS", response.data.data);
        return response.data.data;
    } catch (error) {

        throw new Error(error?.response?.data?.message);
    }

};



export const addCourseToBundle = async (bundle) => {

    try {
        const response = await app.post('course/api/client-api/course-bundles/bundle/addCourse', bundle)
        console.log("Course DETAILS", response.data.data);
        return response.data;
    } catch (error) {

        throw new Error(error?.response?.data?.message);
    }

};



export const updateBundle = async (bundle, id) => {

    try {
        const response = await app.patch(`course/api/client-api/bundles/${id}`, bundle)
        return response.data;
    } catch (error) {

        throw new Error(error?.response?.data?.message);
    }

};


export const getCourses = async () => {

    try {
        const response = await app.get('course/api/client-api/course/info')
        console.log("All Course DETAILS", response.data.data);
        return response.data;
    } catch (error) {

        throw new Error(error?.response?.data?.message);
    }

};

export const createBundle = async (bundle) => {
    try {
        const bundleInDTO = {
            bundleName: bundle.bundleName,
            isActive: true
        };

        const bundleResponse = await app.post('course/api/client-api/bundles', bundleInDTO);

        const bundleCourseInDTO = {
            bundleId: bundleResponse.data.data.bundleId,
            courses: bundle.courses,

        };

        const courseResponse = await addCourseToBundle(bundleCourseInDTO);

        return courseResponse.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Server error while creating bundle");
    }
};

