// export const getTotalCourses = async () => {

//     try {
//         const response = await appCourse.get('/api/course/count')
//         return response.data.data
//     } catc h (error) {
//         throw new Error(error?.response?.data?.message);
//     }
// }
import { Group } from "antd/es/radio";
import { app } from "./serviceLMS";

export const getAllGroups = async () => {

    try {
        const response = await app.get('user/api/service-api/group/groups')
        console.log("GROUP DETAILS", response.data.data);
        return response.data.data;
    }
    catch (error) {
        alert("Error fetching groups");
        throw new Error(error?.response?.data?.message);
    }

};


export const addGroup = async (group) => {
    try {
        const response = await app.post('user/api/service-api/group/create-group', group);
        return response.data;
    }
    catch (error) {
        alert("Error adding group");
        throw new Error(error?.response?.data?.message);
    }

};


export const updateGroup = async (group) => {
    try {

        const response = await app.put("user/api/service-api/group/update-group", group);
        // alert(group.groupId + group.groupName)
        return response;
    }
    catch (error) {
        alert("Error while updating group");
        throw new Error(error?.response?.data?.message);
    }
};


export const deleteGroup = async (groupId) => {
    try {
        const response = await app.delete(`user/api/service-api/group/remove/${groupId}`);
    }
    catch (error) {
        alert("Error while deleting group");
        throw new Error(error?.response?.data?.message);
    }
}

export const getUsersInGroup = async (groupId) => {
    try {
        const response = await app.get(`user/api/service-api/group/group-emps/${groupId}`)
        console.log("Users in a group ", response.data.data);
        return response.data.data;
    }
    catch (error) {
        alert("Couldn't fetch users");
        throw new Error(error?.response?.data?.message);
    }
}


export const deleteSingleUser = async (user) => {
    try {
        console.log(user);
        const response = await app.delete("user/api/service-api/group/remove-user", { data: user });
        return response.data;

    }
    catch (error) {
        alert("Couldn't fetch users");
        throw new Error(error?.response?.data?.message);
    }
}



export const addUser = async (user) => {
    try {
        console.log(user);
        const response = await app.post("user/api/service-api/group/add-user", user);
        alert("USer added");
    }
    catch (error) {
        alert("Couldn't fetch users");
        throw new Error(error?.response?.data?.message);
    }
}


export const getCourseDetails = async (groupId) => {
    try {
        console.log("GroupIdin getcoursedetails api", groupId);
        const response = await app.get(`user/api/service-api/group/group-courses/${groupId}`);
        return response.data.data;
    }
    catch (error) {
        alert("Couldn't fetch courses");
        throw new Error(error?.response?.data?.message);
    }
}

export const getUserCoursesInGroup = async (group) => {
    try {
        console.log("Group getcoursedetails api", group);
        const response = await app.post('user/api/service-api/group/user-courses', group);
        console.log("Courses details ", response.data.data);
        return response.data.data;
    }
    catch (error) {
        alert("Couldn't fetch courses");
        throw new Error(error?.response?.data?.message);
    }
}