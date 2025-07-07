import axios from "axios";

export const fetchAllCourses = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/course");
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
      `http://localhost:8080/api/course/${courseId}`
    );
    return response.data.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Course deletion failed");
  }
}

export async function updateCourse(courseId, updatedData) {
  try {
    const response = await axios.put(
      `http://localhost:8080/api/course/${courseId}`,
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
      "http://localhost:8080/api/course",
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
      `http://localhost:8080/api/course/${courseId}`
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
      `http://localhost:8080/api/course-content/course/${courseId}`
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
      `http://localhost:8080/api/course-content/${id}`
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
      `http://localhost:8080/api/course-content/${id}`,
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
      "http://localhost:8080/api/course-content",
      newData
    );
    return response.data.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to add course content"
    );
  }
}

export const previewCourseReportPdf = async (options) => {
  return axios
    .post(`http://localhost:8081/api/custom-report/preview-pdf`, options, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
      },
    })
    .then((res) => res.data);
};

export async function downloadCourseReportPdf(options) {
  try {
    const response = await axios.post(
      `http://localhost:8081/api/custom-report/download-pdf`,
      options, // Send the full options (courseId + kpis etc.)
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
    link.download = `course-report-${options.courseId}.pdf`;
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

export async function downloadCourseReportExcel(options) {
  try {
    const response = await axios.post(
      `http://localhost:8081/api/custom-report/download-excel`,
      options, // Send the full options (courseId + kpis etc.)
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
        },
      }
    );

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `course-report-${options.courseId}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading course report Excel:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to download course report Excel"
    );
  }
}
