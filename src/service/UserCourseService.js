import axios from "axios";

export async function fetchUserEnrolledCourses(userId) {
  try {
    const response = await axios.get(
      `http://localhost:8081/api/enrollment/user/${userId}/enrolled-courses`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch enrolled courses."
    );
  }
}

export async function fetchCourseDetails(courseId) {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/course/${courseId}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch course details.");
  }
}

export async function fetchCourseProgress(userId, courseId) {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/user-progress?userId=${userId}&courseId=${courseId}`
    );
    return response.data; // Returns completion percentage
  } catch (error) {
    return 0; // Default to 0% if no entry exists
  }
}

export async function getUserEnrolledCourseDetails(userId) {
  try {
    const enrollments = await fetchUserEnrolledCourses(userId);
    const courseDetailsPromises = enrollments.map(async (enrollment) => {
      const courseDetails = await fetchCourseDetails(enrollment.courseId);
      const completionPercentage = await fetchCourseProgress(
        userId,
        enrollment.courseId
        
      );
      const roundedCompletion = parseFloat(completionPercentage.toFixed(2));

      return {
        ...courseDetails,
        assignedById: enrollment.assignedById,
        enrollmentDate: enrollment.enrollmentDate,
        deadline: enrollment.deadline,
        roundedCompletion,
        status:
          roundedCompletion === 100
            ? "Completed"
            : roundedCompletion > 0
              ? "In Progress"
              : "Not Started",
      };
    });

    return await Promise.all(courseDetailsPromises);
  } catch (error) {
    throw new Error("Failed to retrieve user enrolled courses.");
  }
}

export async function updateContentProgress(
  userId,
  contentId,
  courseId,
  lastPosition,
  newCompletionPercentage,
  contentType
) {
  try {
    const existingCompletionPercentage = await fetchCourseProgress(
      userId,
      courseId
    );

    const finalCompletionPercentage = Math.max(
      existingCompletionPercentage,
      newCompletionPercentage
    );

    const progressPayload = {
      userId,
      contentId,
      courseId,
      lastPosition,
      lastUpdated: new Date().toISOString(),
      contentCompletionPercentage: finalCompletionPercentage,
      contentType,
    };

    await axios.post(
      `http://localhost:8080/api/user-progress/update`,
      progressPayload
    );

    console.log(`Content progress updated successfully`);
  } catch (error) {
    console.error(
      "Error updating content progress:",
      error.response?.data || error.message
    );
  }
}
