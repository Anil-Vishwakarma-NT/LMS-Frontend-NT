import {app} from "./serviceLMS"

export const fetchAllCourses = async () => {
  try {
    const response = await axios.get("http://localhost:8082/api/course");
    return response.data; // Return the course data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return []; // Treat 404 as an empty dataset
    }
    throw error; // Rethrow other errors
  }
};

export async function deleteCourse(courseId) {
  try {
    const response = await axios.delete(
      `http://localhost:8082/api/course/${courseId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Course deletion failed");
  }
}

export async function updateCourse(courseId, updatedData) {
  try {
    const response = await axios.put(
      `http://localhost:8082/api/course/${courseId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Course update failed");
  }
}

export async function createCourse(courseData) {
  try {
    const response = await axios.post(
      "http://localhost:8082/api/course",
      courseData
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Course creation failed");
  }
}

export async function fetchCourseById(courseId) {
  try {
    const response = await axios.get(
      `http://localhost:8082/api/course/${courseId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Course not found!");
  }
}

export async function fetchCourseContentByCourseId(courseId) {
  try {
    const response = await axios.get(
      `http://localhost:8082/api/course-content/courseid/${courseId}`
    );
    return response.data; // Return the course content data
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Course content not found!"
    );
  }
}

export async function deleteCourseContent(id) {
  try {
    const response = await axios.delete(
      `http://localhost:8082/api/course-content/${id}`
    );
    return response.data; // Return success message or response
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to delete course content"
    );
  }
}

export async function updateCourseContent(id, updatedData) {
  try {
    const response = await axios.put(
      `http://localhost:8082/api/course-content/${id}`,
      updatedData
    );
    return response.data; // Return the updated content
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to update course content"
    );
  }
}

export async function createCourseContent(newData) {
  try {
    const response = await axios.post(
      "http://localhost:8082/api/course-content",
      newData
    );
    return response.data; // Return the newly created content
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to add course content"
    );
  }
}
