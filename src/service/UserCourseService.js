import axios from "axios";

export async function fetchUserEnrolledCourses(userId) {
  try {
    const response = await axios.get(
      `http://localhost:8081/api/enrollment/user/${userId}/enrolled-courses`
    );
    return response.data.data;
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
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch course details.");
  }
}

export async function fetchCourseProgress(userId, courseId) {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/user-progress?userId=${userId}&courseId=${courseId}`
    );
    return response.data.data; // Returns completion percentage
  } catch (error) {
    return 0; // Default to 0% if no entry exists
  }
}

export async function getUserEnrolledCourseDetails(userId) {
  try {
    const enrollments = await fetchUserEnrolledCourses(userId);
    console.log("Enrolled coursed fetched ", enrollments);
    const courseDetailsPromises = enrollments.map(async (enrollment) => {
      const courseDetails = await fetchCourseDetails(enrollment.courseId);
      console.log("details fetched for course", courseDetails);
      const completionPercentage = await fetchCourseProgress(
        userId,
        enrollment.courseId

      );
      console.log("Completion percentage fetched", completionPercentage);
      const roundedCompletion = parseFloat(completionPercentage.toFixed(2));
      const date = new Date().toISOString().split("T")[0];
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
              : (date < enrollment.deadline ? "Not Started" : "Defaulter"),
      };
    });

    return await Promise.all(courseDetailsPromises);
  } catch (error) {
    throw new Error("Failed to retrieve user enrolled courses.");
  }
}

export async function fetchContentProgress(userId, courseId, contentId) {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/user-progress/content?userId=${userId}&courseId=${courseId}&contentId=${contentId}`
    );
    return response.data.data; // Returns content completion percentage
  } catch (error) {
    return 0; // Default to 0% if no entry exists
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
    const existingCompletionPercentage = await fetchContentProgress(
      userId,
      courseId,
      contentId
    );
    const finalCompletionPercentage = Math.max(
      existingCompletionPercentage,
      newCompletionPercentage
    );

    // console.log(
    //   newCompletionPercentage,
    //   existingCompletionPercentage,
    //   finalCompletionPercentage,
    //   lastPosition,
    //   contentId
    // );

    const progressPayload = {
      userId,
      contentId,
      courseId,
      lastPosition,
      lastUpdated: new Date().toISOString(),
      contentCompletionPercentage: finalCompletionPercentage,
      contentType,
    };

    console.log(progressPayload);

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
