import axios from "axios";

const COURSE_API = process.env.REACT_APP_COURSE_API_BASE_URL || "http://localhost:8080";
const REPORT_API = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081";


export const fetchAllCourses = async () => {
  try {
    const response = await axios.get(`${COURSE_API}/api/course`);
    return response.data.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return [];
    }
    throw error;
  }
};

export async function deleteCourse(courseId) {
  try {
    const response = await axios.delete(
      `${COURSE_API}/api/course/${courseId}`
    );
    return response.data.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Course deletion failed");
  }
}

export async function updateCourse(courseId, updatedData) {
  try {
    const response = await axios.put(
      `${COURSE_API}/api/course/${courseId}`,
      updatedData
    );
    return response.data.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Course update failed");
  }
}

export async function createCourse(courseData) {
  try {
    const response = await axios.post(
      `${COURSE_API}/api/course`,
      courseData
    );
    return response.data.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Course creation failed");
  }
}

export async function fetchCourseById(courseId) {
  try {
    const response = await axios.get(
      `${COURSE_API}/api/course/${courseId}`
    );
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Course not found!");
  }
}

export async function fetchCourseContentByCourseId(courseId) {
  try {
    const response = await axios.get(
      `${COURSE_API}/api/course-content/course/${courseId}`
    );
    return response.data.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Course content not found!"
    );
  }
}

export async function deleteCourseContent(id) {
  try {
    const response = await axios.delete(
      `${COURSE_API}/api/course-content/${id}`
    );
    return response.data.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to delete course content"
    );
  }
}

export async function updateCourseContent(id, updatedData) {
  try {
    const response = await axios.put(
      `${COURSE_API}/api/course-content/${id}`,
      updatedData
    );
    return response.data.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to update course content"
    );
  }
}

export async function createCourseContent(newData) {
  try {
    const response = await axios.post(
      `${COURSE_API}/api/course-content`,
      newData
    );
    return response.data.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to add course content"
    );
  }
}

export async function previewCourseReportPdf(courseId) {
  try {
    const response = await axios.get(
      `${REPORT_API}/api/report/course/${courseId}/pdf`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching course report PDF:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch course report PDF"
    );
  }
}

export async function downloadCourseReportPdf(courseId) {
  try {
    const response = await axios.get(
      `${REPORT_API}/api/report/course/${courseId}/pdf/download`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
        },
      }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `course-report-${courseId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading course report PDF:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to download course report PDF"
    );
  }
}
