import axios from "axios";

export async function fetchAllCourses() {
  try {
    const response = await axios.get("http://localhost:8082/api/course");
    return response.data; // Returns an array of courses
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch courses"
    );
  }
}

export async function deleteCourse(courseId) {
  try {
    const response = await axios.delete(
      `http://localhost:8082/api/course/${courseId}`
    );
    return response.data; // Returns success message
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Course deletion failed");
  }
}
